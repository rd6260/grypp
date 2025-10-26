'use client'

import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, MapPin, Instagram, Youtube, X, Wallet, ExternalLink, Loader2, AlertCircle, Sparkles, Edit2, LogOut } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import WalletSection from '@/components/WalletSection';

// --- ADDED TYPE DEFINITIONS ---
// Define the possible user types from Supabase
type UserType = 'clipper' | 'creator' | 'admin';

// Create a display mapping for presentation
const userTypeDisplay: Record<UserType, string> = {
  clipper: 'Clipper',
  creator: 'Creator',
  admin: 'Admin',
};
// --- END ADDED TYPE DEFINITIONS ---

type Section = 'profile' | 'wallet';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  region: string;
  type: UserType; // <-- ADDED THIS
  pfp_url?: string;
  interests?: string[];
  x?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

const ProfilePage: React.FC = () => {
  const { user, ready, authenticated, logout } = usePrivy();
  const router = useRouter();
  const supabase = createClient();

  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!ready || !user?.id) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*') // This will now fetch the 'type' column as well
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          setIsLoadingProfile(false);
          return;
        }

        if (data) {
          setProfileData(data as ProfileData);
        }
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user?.id, ready, supabase]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!ready || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ff7a66] animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-[#ff7a66] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Not Authenticated</h2>
          <p className="text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 p-6 sticky top-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#ff7a66]" />
              Profile
            </h2>
          </div>

          <div className="mb-4">
            <button
              onClick={() => router.back()}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-zinc-800 hover:text-white rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'profile'
                ? 'bg-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.3)]'
                : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile Info</span>
            </button>

            <button
              onClick={() => setActiveSection('wallet')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'wallet'
                ? 'bg-[#ff7a66] text-white shadow-[0_0_15px_rgba(255,122,102,0.3)]'
                : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Wallet</span>
            </button>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors text-gray-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === 'profile' && (
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Profile Information</h1>
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#ff7a66] text-white rounded-lg hover:bg-[#ff8c7a] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              {/* Profile Card */}
              {/* --- MODIFIED: Added 'relative' --- */}
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

                {/* --- ADDED BADGE HERE --- */}
                {/* User Type Badge */}
                {profileData?.type && (
                  <span
                    className={`absolute top-8 right-8 inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${profileData.type === 'admin'
                        ? 'bg-red-900/50 text-red-300 border-red-700'
                        : profileData.type === 'creator'
                          ? 'bg-purple-900/50 text-purple-300 border-purple-700'
                          : 'bg-zinc-800 text-gray-300 border-zinc-700'
                      }`}
                  >
                    {userTypeDisplay[profileData.type]}
                  </span>
                )}
                {/* --- END BADGE --- */}

                <div className="flex items-start gap-6 mb-8">
                  {/* Profile Picture */}
                  <div className="relative">
                    {profileData?.pfp_url ? (
                      <img
                        src={profileData.pfp_url}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-2 border-[#ff7a66] object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-2 border-[#ff7a66] bg-zinc-800 flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Name and Username */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {profileData?.first_name} {profileData?.last_name}
                    </h3>
                    <p className="text-lg text-gray-400 mb-3">@{profileData?.username}</p>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="capitalize">{profileData?.region?.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                {profileData?.interests && profileData.interests.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((interest: string) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-gray-300"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Social Links</h4>
                  <div className="space-y-2">
                    {profileData?.x && (
                      <a
                        href={`https://${profileData.x}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors group"
                      >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <span className="text-gray-300 group-hover:text-white">@{profileData.x}</span>
                        <ExternalLink className="w-4 h-4 ml-auto text-gray-500 group-hover:text-gray-300" />
                      </a>
                    )}
                    {profileData?.instagram && (
                      <a
                        href={`httpshttps://instagram.com/${profileData.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors group"
                      >
                        <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <span className="text-gray-300 group-hover:text-white">@{profileData.instagram}</span>
                        <ExternalLink className="w-4 h-4 ml-auto text-gray-500 group-hover:text-gray-300" />
                      </a>
                    )}
                    {profileData?.youtube && (
                      <a
                        href={`https://youtube.com/@${profileData.youtube}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors group"
                      >
                        <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <span className="text-gray-300 group-hover:text-white">@{profileData.youtube}</span>
                        <ExternalLink className="w-4 h-4 ml-auto text-gray-500 group-hover:text-gray-300" />
                      </a>
                    )}
                    {profileData?.tiktok && (
                      <a
                        href={`https://tiktok.com/@${profileData.tiktok}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors group"
                      >
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                        <span className="text-gray-300 group-hover:text-white">@{profileData.tiktok}</span>
                        <ExternalLink className="w-4 h-4 ml-auto text-gray-500 group-hover:text-gray-300" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'wallet' && <WalletSection />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
