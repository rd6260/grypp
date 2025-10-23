'use client'

import React, { useState, useEffect } from 'react';
import { User, MapPin, Instagram, Youtube, X, Wallet, Copy, Check, ExternalLink, RefreshCw, Download, Loader2, AlertCircle, Sparkles, Edit2, LogOut, Plus } from 'lucide-react';
import { usePrivy, useWallets, useCreateWallet } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatEther } from 'viem';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const ProfilePage: React.FC = () => {
  const { user, ready, authenticated, logout, exportWallet } = usePrivy();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet({
    onSuccess: (wallet) => {
      console.log('Wallet created successfully:', wallet);
    },
    onError: (error) => {
      console.error('Failed to create wallet:', error);
      setWalletError('Failed to create wallet. Please try again.');
    }
  });
  const router = useRouter();
  const supabase = createClient();

  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [walletBalance, setWalletBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Get embedded wallet
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );

  // Create a public client for fetching balance
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

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
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          setIsLoadingProfile(false);
          return;
        }

        if (data) {
          setProfileData(data);
        }
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user?.id, ready]);

  // Fetch wallet balance
  const fetchBalance = async () => {
    if (!embeddedWallet) return;
    
    setIsLoadingBalance(true);
    try {
      const balance = await publicClient.getBalance({
        address: embeddedWallet.address as `0x${string}`,
      });
      setWalletBalance(formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (embeddedWallet) {
      fetchBalance();
    }
  }, [embeddedWallet?.address]);

  // Copy address to clipboard
  const copyAddress = async () => {
    if (!embeddedWallet) return;
    
    try {
      await navigator.clipboard.writeText(embeddedWallet.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle create wallet
  const handleCreateWallet = async () => {
    setIsCreatingWallet(true);
    setWalletError(null);
    try {
      await createWallet();
    } catch (error) {
      console.error('Error creating wallet:', error);
      setWalletError('Failed to create wallet. Please try again.');
    } finally {
      setIsCreatingWallet(false);
    }
  };

  // Handle export wallet
  const handleExportWallet = async () => {
    if (!embeddedWallet) return;
    
    try {
      await exportWallet();
    } catch (error) {
      console.error('Error exporting wallet:', error);
    }
  };

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
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#ff7a66]" />
            My Profile
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors text-gray-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#ff7a66] text-white rounded-lg hover:bg-[#ff8c7a] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

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
                      href={`https://x.com/${profileData.x}`}
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
                      href={`https://instagram.com/${profileData.instagram}`}
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

          {/* Wallet Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ff7a66] rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Embedded Wallet</h3>
                  <p className="text-xs text-gray-400">Privy Wallet</p>
                </div>
              </div>

              {embeddedWallet ? (
                <div className="space-y-4">
                  {/* Wallet Address */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Wallet Address</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-gray-300 font-mono truncate">
                        {formatAddress(embeddedWallet.address)}
                      </div>
                      <button
                        onClick={copyAddress}
                        className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
                        title="Copy address"
                      >
                        {copiedAddress ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Balance */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Balance</label>
                    <div className="flex items-center justify-between px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg">
                      {isLoadingBalance ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          <span className="text-sm text-gray-400">Loading...</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xl font-bold text-white">{parseFloat(walletBalance).toFixed(4)} ETH</p>
                          <p className="text-xs text-gray-400">Base Network</p>
                        </div>
                      )}
                      <button
                        onClick={fetchBalance}
                        disabled={isLoadingBalance}
                        className="p-2 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Refresh balance"
                      >
                        <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Chain Info */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Network</label>
                    <div className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-300">Base</span>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Actions */}
                  <div className="pt-4 border-t border-zinc-700 space-y-2">
                    <button
                      onClick={handleExportWallet}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_15px_rgba(255,122,102,0.4)] hover:shadow-[0_0_25px_rgba(255,122,102,0.6)]"
                    >
                      <Download className="w-4 h-4" />
                      Export Wallet
                    </button>
                    <p className="text-xs text-gray-500 text-center px-2">
                      Export your private key or seed phrase to use in other wallets
                    </p>
                  </div>

                  {/* Security Note */}
                  <div className="mt-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#ff7a66] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-300 mb-1">Self-Custodial</p>
                        <p className="text-xs text-gray-500">
                          You have full control of your wallet. Neither Privy nor the app can access your keys.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">No Wallet Yet</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Create your embedded wallet to start using crypto features
                  </p>
                  
                  {walletError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-400">{walletError}</p>
                    </div>
                  )}

                  <button
                    onClick={handleCreateWallet}
                    disabled={isCreatingWallet}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_15px_rgba(255,122,102,0.4)] hover:shadow-[0_0_25px_rgba(255,122,102,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingWallet ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Wallet...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Wallet
                      </>
                    )}
                  </button>

                  <div className="mt-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#ff7a66] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500 text-left">
                        Your wallet will be created instantly and is fully self-custodial. Only you have access to your keys.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
