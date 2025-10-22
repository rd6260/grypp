'use client';

import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { LogOut, User, Mail, Wallet as WalletIcon } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/login');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#ff7a66] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg">
              <User className="w-5 h-5 text-[#ff7a66]" />
              <div>
                <p className="text-sm text-gray-400">User ID</p>
                <p className="font-mono text-sm">{user?.id}</p>
              </div>
            </div>

            {user?.email && (
              <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg">
                <Mail className="w-5 h-5 text-[#ff7a66]" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p>{user.email.address}</p>
                </div>
              </div>
            )}

            {user?.wallet && (
              <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg">
                <WalletIcon className="w-5 h-5 text-[#ff7a66]" />
                <div>
                  <p className="text-sm text-gray-400">Wallet Address</p>
                  <p className="font-mono text-sm break-all">{user.wallet.address}</p>
                </div>
              </div>
            )}

            {user?.google && (
              <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div>
                  <p className="text-sm text-gray-400">Google</p>
                  <p>{user.google.email}</p>
                </div>
              </div>
            )}

            {user?.twitter && (
              <div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <div>
                  <p className="text-sm text-gray-400">Twitter</p>
                  <p>@{user.twitter.username}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
