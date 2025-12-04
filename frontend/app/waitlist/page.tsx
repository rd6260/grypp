export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Border Container */}
      <div className="w-full h-full min-h-[calc(100vh-2rem)] border-2 border-gray-800 rounded-lg flex flex-col">
        {/* Header */}
        <header className="px-4 sm:px-8 pt-4 sm:pt-6 pb-2">
          <div className="text-orange-500 font-mono text-sm sm:text-base">[CLOUT]</div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center px-4 sm:px-8 pb-6 sm:py-0">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Escape the 9–5 by turning viral content into Real Money
              </h1>
            </div>

            {/* Right Side - Image */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/waitlist-image.png" 
                alt="Money pie chart illustration" 
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl"
              />
            </div>
          </div>
        </main>

        {/* Footer Section */}
        <footer className="px-4 sm:px-8 py-6 sm:py-8 border-t border-gray-800">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Side - CTA Button */}
            <div className="flex items-center">
              <button className="w-full sm:w-auto bg-[#FA7154] hover:bg-orange-600 text-black font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-colors">
                ■ CLAIM YOUR SPOT
              </button>
            </div>

            {/* Right Side - Description */}
            <div className="flex items-center">
              <div className="text-left">
                <div className="text-gray-400 text-xs font-mono mb-2">[WHAT IS CLOUT]</div>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  CLOUT IS A MARKETPLACE WHERE EDITORS TURN VIRAL CLIPS INTO INCOME. UPLOAD YOUR BEST EDITS, EARN BASED ON PERFORMANCE, AND BOOST YOUR TWITTER SCORE TO UNLOCK BIGGER DEALS, EXCLUSIVE CREATOR ACCESS, & PREMIUM EARNING OPPORTUNITIES.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
