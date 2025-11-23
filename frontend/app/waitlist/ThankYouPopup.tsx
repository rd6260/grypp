'use client';

import { useEffect } from 'react';

interface ThankYouPopupProps {
  onClose: () => void;
  twitterLink: string;
}

export default function ThankYouPopup({ onClose, twitterLink }: ThankYouPopupProps) {
  useEffect(() => {
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleTwitterRedirect = () => {
    window.open(twitterLink, '_blank');
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {/* Success icon */}
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#4CAF50" strokeWidth="4" />
            <path d="M20 32 L28 40 L44 24" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Thank you message */}
        <h2 className="popup-heading">Thanks for joining!</h2>
        
        <p className="popup-text">
          Now click on this button, like this post and retweet to continue
        </p>

        {/* Twitter button */}
        <button className="twitter-button" onClick={handleTwitterRedirect}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Go to Twitter Post
        </button>

        <p className="popup-note">
          Like and retweet the post to secure your spot!
        </p>
      </div>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .popup-content {
          position: relative;
          background: #1a1a1a;
          border-radius: 16px;
          padding: 3rem 2rem;
          max-width: 500px;
          width: 100%;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 2rem;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .success-icon {
          margin: 0 auto 1.5rem;
          display: flex;
          justify-content: center;
        }

        .popup-heading {
          color: #FFFFFF;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .popup-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.125rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .twitter-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: #1DA1F2;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 1rem;
        }

        .twitter-button:hover {
          background: #1a8cd8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(29, 161, 242, 0.4);
        }

        .popup-note {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin-top: 1rem;
        }

        @media (max-width: 640px) {
          .popup-content {
            padding: 2rem 1.5rem;
          }

          .popup-heading {
            font-size: 1.5rem;
          }

          .popup-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

