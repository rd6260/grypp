'use client'

import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NavigationBar() {
  const router = useRouter()
  const { ready, authenticated, user } = usePrivy()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!authenticated || !user?.id) {
        setIsAdmin(false)
        return
      }

      setIsCheckingAdmin(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('users')
          .select('type')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
          return
        }

        setIsAdmin(data?.type === 'admin')
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setIsCheckingAdmin(false)
      }
    }

    checkAdminStatus()
  }, [authenticated, user?.id])

  const handleLoginClick = () => {
    router.push('/onboarding')
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleAdminPanelClick = () => {
    router.push('/admin')
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
          {/* Only show buttons when ready */}
          {!ready ? (
            // Optional: Show a loading state or placeholder
            <div className="h-10 w-32 animate-pulse bg-gray-200 rounded-lg" />
          ) : authenticated ? (
            // User is logged in - show admin panel (if admin) and profile button
            <>
              {isAdmin && (
                <button 
                  onClick={handleAdminPanelClick}
                  className="px-5 py-2 text-sm font-medium border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors flex items-center gap-2"
                >
                  ADMIN PANEL
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                </button>
              )}
              <button 
                onClick={handleProfileClick}
                className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                PROFILE
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            </>
          ) : (
            // User is not logged in - show both sponsor and login buttons
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
