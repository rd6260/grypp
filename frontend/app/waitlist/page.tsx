
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ThankYouPopup from './ThankYouPopup';
import './particles-static.css';

// Twitter post link stored at the top
const TWITTER_POST_LINK = 'https://twitter.com/YourHandle/status/1234567890';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      
      // Insert email into waitlist table
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (insertError) {
        throw insertError;
      }

      // Show success popup
      setShowPopup(true);
      setEmail('');
    } catch (err: any) {
      console.error('Error adding to waitlist:', err);
      setError(err.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="waitlist-container">
      {/* Particle background */}
      <div className="particles-background">
        {Array.from({ length: 300 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Content */}
      <div className="content-wrapper">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo">
            <img src="/clout-black.svg" alt="Clout" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="heading">
          <span className="heading-make">Make clips.</span>{' '}
          <span className="heading-get">Get paid.</span>
        </h1>

        {/* Subheading */}
        <p className="subheading">
          Clip the best moments and earn every time they go viral on Clout.
        </p>

        {/* Call to action */}
        <p className="cta-text">
          Join now to be first in the new clip to earn economy
        </p>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="email-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Joining...' : 'Join waitlist'}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <p className="error-message">{error}</p>
        )}

        {/* Limited spots text */}
        <p className="limited-spots">limited spots available!</p>
      </div>

      {/* Thank you popup */}
      {showPopup && (
        <ThankYouPopup
          onClose={() => setShowPopup(false)}
          twitterLink={TWITTER_POST_LINK}
        />
      )}

      <style jsx>{`
        .waitlist-container {
          position: relative;
          min-height: 100vh;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 2rem;
          max-width: 800px;
        }

        .logo-container {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        .logo {
          background: white;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .logo img {
          height: 120px;
          width: auto;
        }

        .heading {
          font-size: 4rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .heading-make {
          color: #FF6B4A;
          font-weight: 300;
        }

        .heading-get {
          color: #FFFFFF;
          font-weight: 400;
        }

        .subheading {
          color: #FFFFFF;
          font-size: 1.125rem;
          margin-bottom: 1rem;
          font-weight: 300;
        }

        .cta-text {
          color: #FFFFFF;
          font-size: 1rem;
          margin-bottom: 2.5rem;
          font-weight: 300;
        }

        .email-form {
          display: flex;
          gap: 0;
          max-width: 600px;
          margin: 0 auto 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
        }

        .email-input {
          flex: 1;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: #FFFFFF;
          font-size: 1rem;
          outline: none;
        }

        .email-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .submit-button {
          padding: 1rem 2rem;
          background: #FF6B4A;
          color: #FFFFFF;
          border: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background: #FF5534;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: #FF6B4A;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .limited-spots {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          font-weight: 300;
        }

        @media (max-width: 768px) {
          .heading {
            font-size: 2.5rem;
          }

          .email-form {
            flex-direction: column;
          }

          .submit-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
