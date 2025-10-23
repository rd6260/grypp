'use client'

import React, { useState, useEffect } from 'react';
import { Wallet, Copy, Check, RefreshCw, Loader2, AlertCircle, Plus, ArrowDownToLine, ArrowUpFromLine, X } from 'lucide-react';
import { useWallets, useCreateWallet } from '@privy-io/react-auth';
import { formatEther, formatUnits } from 'viem';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// USDC contract address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// USDC ABI (minimal for balanceOf)
const USDC_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

const WalletSection: React.FC = () => {
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

  const [walletBalance, setWalletBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingUsdc, setIsLoadingUsdc] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Get embedded wallet
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );

  // Create a public client for fetching balance
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

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

  // Fetch USDC balance
  const fetchUsdcBalance = async () => {
    if (!embeddedWallet) return;
    
    setIsLoadingUsdc(true);
    try {
      const balance = await publicClient.readContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [embeddedWallet.address as `0x${string}`],
      });
      setUsdcBalance(formatUnits(balance, 6)); // USDC has 6 decimals
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
    } finally {
      setIsLoadingUsdc(false);
    }
  };

  useEffect(() => {
    if (embeddedWallet) {
      fetchBalance();
      fetchUsdcBalance();
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

  if (!embeddedWallet) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Wallet</h1>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Wallet Yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Create your embedded wallet to start using crypto features, manage USDC, and interact with Web3 applications.
          </p>
          
          {walletError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-red-400">{walletError}</p>
            </div>
          )}

          <button
            onClick={handleCreateWallet}
            disabled={isCreatingWallet}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_15px_rgba(255,122,102,0.4)] hover:shadow-[0_0_25px_rgba(255,122,102,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingWallet ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Wallet...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Wallet
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#ff7a66] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-500 text-left">
                Your wallet will be created instantly and is fully self-custodial. Only you have access to your keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">Wallet</h1>

      <div className="space-y-6">
        {/* Wallet Info Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#ff7a66] rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Embedded Wallet</h3>
              <p className="text-xs text-gray-400">Privy Wallet on Base</p>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="mb-4">
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

          {/* Network Info */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Network</label>
            <div className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Base</span>
              </div>
            </div>
          </div>
        </div>

        {/* Balances Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ETH Balance */}
          {/*
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">ETH Balance</h3>
              <button
                onClick={fetchBalance}
                disabled={isLoadingBalance}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh balance"
              >
                <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoadingBalance ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {isLoadingBalance ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-400">Loading...</span>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-white mb-1">{parseFloat(walletBalance).toFixed(4)}</p>
                <p className="text-sm text-gray-400">ETH</p>
              </div>
            )}
          </div>
          */}

          {/* USDC Balance */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">USDC Balance</h3>
              <button
                onClick={fetchUsdcBalance}
                disabled={isLoadingUsdc}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh balance"
              >
                <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoadingUsdc ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {isLoadingUsdc ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-400">Loading...</span>
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-white mb-1">{parseFloat(usdcBalance).toFixed(2)}</p>
                <p className="text-sm text-gray-400">USDC</p>
              </div>
            )}
          </div>
        </div>

        { /*
className="w-full py-4 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)] flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ff7a66]"
 
        */}

        {/* Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex items-center justify-center gap-3 px-6 py-4 text-lg bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ff7a66]"
            >
              <ArrowDownToLine className="w-5 h-5 text-white-500" />
              <div className="text-left">
                <p className="font-semibold text-white">Deposit</p>
                <p className="text-xs text-white-400">Add funds to wallet</p>
              </div>
            </button>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center justify-center gap-3 px-6 py-4 text-lg bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#ff7a66]"
            >
              <ArrowUpFromLine className="w-5 h-5 text-white-500" />
              <div className="text-left">
                <p className="font-semibold text-white">Withdraw</p>
                <p className="text-xs text-white-400">Send funds out</p>
              </div>
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff7a66] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">Self-Custodial Wallet</p>
              <p className="text-sm text-gray-500">
                You have full control of your wallet. Neither Privy nor the app can access your keys. Always verify transaction details before confirming.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Deposit Funds</h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Your Wallet Address</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-white font-mono break-all">
                    {embeddedWallet.address}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-2 hover:bg-zinc-700 rounded transition-colors flex-shrink-0"
                  >
                    {copiedAddress ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-400 mb-1">Deposit Instructions</p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Send ETH or USDC to the address above</li>
                      <li>• Only use Base network</li>
                      <li>• Funds will appear in your wallet once confirmed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDepositModal(false)}
                className="w-full px-4 py-3 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Withdraw Funds</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Asset</label>
                <select className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-[#ff7a66] focus:outline-none">
                  <option value="usdc">USDC</option>
                  <option value="eth">ETH</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:border-[#ff7a66] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:border-[#ff7a66] focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#ff7a66] hover:text-[#ff8c7a]"
                  >
                    MAX
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Available: {parseFloat(usdcBalance).toFixed(2)} USDC</p>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400 mb-1">Important</p>
                    <p className="text-sm text-gray-400">
                      Double-check the recipient address. Transactions cannot be reversed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSection;
