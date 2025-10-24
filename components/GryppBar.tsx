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
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="1288" height="1288" viewBox="0 0 1288 1288" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_166_16)">
                <path d="M645.608 314.464C612.529 418.895 594.717 530.091 594.717 645.408C594.717 760.776 612.529 871.922 645.608 976.354L394.104 1288.48C335.68 1227.13 270.184 1172.55 198.987 1126.01C269.93 980.881 309.727 817.799 309.727 645.408C309.727 473.069 269.93 309.937 198.937 164.862C271.1 117.708 337.309 62.3127 396.343 0L645.608 314.464ZM894.873 0C953.856 62.3129 1020.12 117.708 1092.28 164.862C1021.29 309.937 981.49 473.069 981.49 645.408C981.49 817.799 1021.29 980.881 1092.23 1126.01C1020.98 1172.55 955.485 1227.13 897.112 1288.48L645.608 976.354C678.688 871.922 696.5 760.776 696.5 645.408C696.5 530.091 678.688 418.895 645.608 314.464L894.873 0Z" fill="black" />
                <path d="M645.669 308.271C817.861 308.271 980.756 268.301 1125.71 197.051C1172.21 268.608 1226.72 334.389 1288 393.015L976.234 645.611C871.923 612.388 760.904 594.499 645.669 594.499C530.484 594.499 419.415 612.388 315.103 645.611C319.117 646.94 311.038 644.333 315.103 645.611L0.999989 395.264C63.2414 336.025 118.573 269.477 165.673 197C310.581 268.301 473.527 308.271 645.669 308.271Z" fill="black" />
                <path d="M645.669 696.701C760.904 696.701 871.922 678.955 976.234 646L1288 896.563C1226.72 954.767 1172.21 1020.02 1125.71 1090.95C980.756 1020.27 817.861 980.625 645.669 980.625C473.527 980.625 310.581 1020.27 165.673 1091C118.573 1019.11 63.2414 953.145 0.999991 894.332L315.103 646C419.415 678.956 530.484 696.701 645.669 696.701Z" fill="black" />
              </g>
              <defs>
                <clipPath id="clip0_166_16">
                  <rect width="1288" height="1288" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-wide">CLOUT</span>
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
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
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
