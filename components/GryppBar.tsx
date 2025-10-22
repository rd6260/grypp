'use client'

import { useRouter } from 'next/navigation'

export default function NavigationBar() {
  const router = useRouter()

  const handleLoginClick = () => {
    router.push('/login')
  }

  return (
    <nav className="bg-white text-gray-900 px-6 py-1 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              <circle cx="5" cy="12" r="1.5" fill="currentColor" />
              <circle cx="19" cy="12" r="1.5" fill="currentColor" />
              <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
              <circle cx="16.5" cy="16.5" r="1.5" fill="currentColor" />
              <circle cx="16.5" cy="7.5" r="1.5" fill="currentColor" />
              <circle cx="7.5" cy="16.5" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-wide">GRYPP</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-2 text-sm font-medium border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
            BECOME A SPONSOR
          </button>
          <button 
            onClick={handleLoginClick}
            className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            LOG IN
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
