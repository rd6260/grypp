'use client'
import React, { useState, useEffect } from 'react';
import { List, Trophy, Users, DollarSign, Settings } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ClipSubmissions from '@/components/ClipSubmissions';

// --- Helper Components for Auth States ---

const LoadingScreen = () => (
  <div className="min-h-screen bg-black flex items-center justify-center text-white">
    <p className="text-lg">Loading admin panel...</p>
  </div>
);

const NotAdminPopup = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-400 mb-6">Only admins can use this page.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-[#ff7a66] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#ff8c7a] transition-all shadow-[0_0_15px_rgba(255,122,102,0.3)]"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};


// --- Main Admin Panel Component ---

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  
  // --- NEW: Auth State ---
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: Auth Effect ---
  useEffect(() => {
    // 1. Wait for Privy to be ready
    if (ready) {
      // 2. If not logged in, redirect to /login
      if (!authenticated) {
        router.push('/login');
      } else {
        // 3. If logged in, check admin status
        const checkAdminStatus = async () => {
          if (user && user.id) {
            // As requested: user.id is the privy id, which is the 'id' in your table
            const privyId = user.id; 
            const supabase = createClient();
            
            try {
              const { data, error } = await supabase
                .from('users')
                .select('type')
                .eq('id', privyId) // Check 'id' column against privy id
                .single();

              if (error || !data) {
                console.error('Error fetching user type or user not found:', error);
                setIsAdmin(false);
              } else if (data.type === 'admin') {
                setIsAdmin(true); // User is an admin
              } else {
                setIsAdmin(false); // User is not an admin
              }
            } catch (e) {
              console.error('An exception occurred during admin check:', e);
              setIsAdmin(false);
            }
          } else {
            // Should not happen if authenticated, but good to handle
            setIsAdmin(false);
          }
          setIsLoading(false); // Done checking
        };

        checkAdminStatus();
      }
    }
  }, [ready, authenticated, user, router]);


  // --- Stats (Remains in AdminPanel) ---
  const stats = {
    pending: 32,
    accepted: 18,
    declined: 7,
    payoutsQueued: 1540
  };

  // --- NEW: Render Logic based on Auth State ---

  // 1. Show loading screen while Privy initializes or we check Supabase
  if (!ready || isLoading) {
    return <LoadingScreen />;
  }

  // 2. Show "Access Denied" if logged in but NOT admin
  if (ready && authenticated && !isAdmin) {
    return <NotAdminPopup />;
  }

  // 3. Show full panel ONLY if ready, authenticated, AND admin
  if (ready && authenticated && isAdmin) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-black border-r border-zinc-900 p-6">
          <h1 className="text-2xl font-bold text-white mb-8">Admin Panel</h1>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'submissions'
                  ? 'bg-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.3)]'
                  : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <List className="w-5 h-5" />
              <span className="font-medium">Submissions</span>
            </button>

            <button
              onClick={() => setActiveTab('bounties')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'bounties'
                  ? 'bg-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.3)]'
                  : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Bounties</span>
            </button>

            <button
              onClick={() => setActiveTab('creators')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'creators'
                  ? 'bg-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.3)]'
                  : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Creators</span>
            </button>

            <button
              onClick={() => setActiveTab('payouts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'payouts'
                  ? 'bg-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.3)]'
                  : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Payouts</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.3)]'
                  : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          
          {/* --- REFACTORED: Conditional Tab Content --- */}
          
          {activeTab === 'submissions' && (
            <>
              {/* 1. The refactored component */}
              <ClipSubmissions />
              
              {/* 2. The summary section that belongs to this tab */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Summary</h3>
                  <span className="px-3 py-1 bg-[#ff7a66] text-white text-sm rounded-lg">Today</span>
                </div>
                
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Pending</p>
                    <p className="text-3xl font-bold text-white">{stats.pending}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Accepted</p>
                    <p className="text-3xl font-bold text-white">{stats.accepted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Declined</p>
                    <p className="text-3xl font-bold text-white">{stats.declined}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Payouts Queued</p>
                    <p className="text-3xl font-bold text-white">${stats.payoutsQueued.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'bounties' && (
             <div className="text-white text-3xl font-bold">Bounties Page (Content goes here)</div>
          )}
          {activeTab === 'creators' && (
             <div className="text-white text-3xl font-bold">Creators Page (Content goes here)</div>
          )}
           {activeTab === 'payouts' && (
             <div className="text-white text-3xl font-bold">Payouts Page (Content goes here)</div>
          )}
           {activeTab === 'settings' && (
             <div className="text-white text-3xl font-bold">Settings Page (Content goes here)</div>
          )}

        </div>
      </div>
    );
  }

  // Fallback (shouldn't be reached if logic is correct)
  return null;
};

export default AdminPanel;
