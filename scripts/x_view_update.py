from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options
import time

from mycred import USERNAME, PASSWORD


# Configuration
URL = "https://x.com/ayman_web3/status/1992192624812540141?s=20"
HEADLESS_MODE = False  # Set to True for headless mode
KEEP_BROWSER_OPEN = True  # Set to False to close browser after script


def login_to_x(driver, username, password):
    """
    Login to X (Twitter) account.
    
    Args:
        driver: Selenium webdriver instance
        username: X username or email
        password: X password
    
    Returns:
        True if login successful, False otherwise
    """
    try:
        print("Navigating to X login page...")
        driver.get("https://twitter.com/i/flow/login")
        time.sleep(3)
        
        # Enter username/email
        print("Entering username...")
        username_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[autocomplete='username']"))
        )
        username_input.send_keys(username)
        username_input.send_keys(Keys.RETURN)
        time.sleep(2)
        
        # Check if phone/email verification is needed (unusual activity)
        # try:
        #     verification_input = driver.find_element(By.CSS_SELECTOR, "input[data-testid='ocfEnterTextTextInput']")
        #     print("Unusual activity detected - verification required")
        #     phone_or_email = input("Enter your phone number or email for verification: ")
        #     verification_input.send_keys(phone_or_email)
        #     verification_input.send_keys(Keys.RETURN)
        #     time.sleep(2)
        # except:
        #     pass  # No verification needed
        
        # Enter password
        print("Entering password...")
        password_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='password']"))
        )
        password_input.send_keys(password)
        password_input.send_keys(Keys.RETURN)
        time.sleep(5)
        
        # Check if login was successful
        if "home" in driver.current_url.lower() or driver.current_url == "https://twitter.com/":
            print("✓ Login successful!")
            return True
        else:
            print("✗ Login may have failed")
            return False
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return False


def is_logged_in(driver):
    """
    Check if user is already logged in to X.
    
    Args:
        driver: Selenium webdriver instance
    
    Returns:
        True if logged in, False otherwise
    """
    try:
        # Check if we're on login page
        if "login" in driver.current_url or "i/flow/login" in driver.current_url:
            return False
        
        # Check for login button on the page
        try:
            driver.find_element(By.XPATH, "//*[contains(text(), 'Sign in') or contains(text(), 'Log in')]")
            return False
        except:
            pass
        
        # Check for elements that only appear when logged in
        try:
            # Look for compose tweet button or home timeline
            driver.find_element(By.XPATH, "//a[@href='/compose/tweet' or @aria-label='Post']")
            return True
        except:
            pass
        
        # If no login indicators found, assume logged in
        return True
        
    except Exception as e:
        print(f"Error checking login status: {str(e)}")
        return False


def get_x_post_impressions(post_url, username=None, password=None):
    """
    Scrape impression count from an X (Twitter) post.
    
    Args:
        post_url: Full URL of the X post
        username: X username or email (optional)
        password: X password (optional)
    
    Returns:
        Impression count as string or None if not found
    """
    # Setup Firefox options
    firefox_options = Options()
    if HEADLESS_MODE:
        firefox_options.add_argument('--headless')
    firefox_options.set_preference('dom.webdriver.enabled', False)
    firefox_options.set_preference('useAutomationExtension', False)
    firefox_options.set_preference('general.useragent.override', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0')
    
    driver = webdriver.Firefox(options=firefox_options)
    
    try:
        # First, visit the post
        print(f"Step 1: Loading post: {post_url}")
        driver.get(post_url)
        time.sleep(3)
        
        # Automatically detect if logged in
        print("\nStep 2: Checking login status...")
        logged_in = is_logged_in(driver)
        
        if logged_in:
            print("✓ Already logged in")
        else:
            print("✗ Not logged in")
            
            # Attempt login if credentials provided
            if username and password:
                print("\nStep 3: Attempting login...")
                login_success = login_to_x(driver, username, password)
                
                if login_success:
                    print(f"\nStep 4: Revisiting post after login: {post_url}")
                    driver.get(post_url)
                    time.sleep(5)
                else:
                    print("Login failed, cannot retrieve impressions")
                    return None
            else:
                print("Login required but no credentials provided")
                return None
        
        # Now try to find impressions
        print("\nLooking for impressions...")
        time.sleep(3)
        
        # Method 1: Look for analytics link with impressions (for your own posts)
        try:
            impressions_element = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//a[contains(@href, 'analytics')]//span[contains(@class, 'css')]"))
            )
            impressions = impressions_element.text
            if impressions:
                print(f"✓ Impressions found (Method 1): {impressions}")
                return impressions
        except:
            pass
        
        # Method 2: Look for view count in aria-label
        try:
            elements = driver.find_elements(By.XPATH, "//a[contains(@href, 'analytics')]")
            for element in elements:
                aria_label = element.get_attribute('aria-label')
                if aria_label and 'view' in aria_label.lower():
                    # Extract numbers and formatting
                    import re
                    match = re.search(r'([\d,\.]+[KMB]?)\s*view', aria_label, re.IGNORECASE)
                    if match:
                        impressions = match.group(1)
                        print(f"✓ Impressions found (Method 2): {impressions}")
                        return impressions
        except:
            pass
        
        # Method 3: Look for any element with view count
        try:
            view_elements = driver.find_elements(By.XPATH, "//*[contains(@aria-label, 'view')]")
            for element in view_elements:
                aria_label = element.get_attribute('aria-label')
                if aria_label:
                    import re
                    match = re.search(r'([\d,\.]+[KMB]?)\s*view', aria_label, re.IGNORECASE)
                    if match:
                        impressions = match.group(1)
                        print(f"✓ Impressions found (Method 3): {impressions}")
                        return impressions
        except:
            pass
        
        # Method 4: Look for visible text with numbers
        try:
            view_links = driver.find_elements(By.XPATH, "//a[contains(@href, 'analytics')]")
            if view_links:
                for link in view_links:
                    text = link.text.strip()
                    if text and any(char.isdigit() for char in text):
                        print(f"✓ Impressions found (Method 4): {text}")
                        return text
        except:
            pass
        
        print("✗ Could not find impressions. The post may not display impressions or you may not have access.")
        return None
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return None
    
    finally:
        if KEEP_BROWSER_OPEN:
            print("\n" + "="*50)
            print("Browser will remain open. Close manually when done.")
            print("="*50)
            input("Press Enter to close the browser...")
        driver.quit()


if __name__ == "__main__":
    post_url = URL
    username = USERNAME
    password = PASSWORD
    
    print("\n" + "="*50)
    print("Starting X Post Impressions Scraper (Firefox)")
    print(f"Headless Mode: {HEADLESS_MODE}")
    print(f"Keep Browser Open: {KEEP_BROWSER_OPEN}")
    print("="*50 + "\n")
    
    impressions = get_x_post_impressions(post_url, username, password)
    
    print("\n" + "="*50)
    if impressions:
        print(f"✓ POST IMPRESSIONS: {impressions}")
    else:
        print("✗ Could not retrieve impressions")
    print("="*50)
