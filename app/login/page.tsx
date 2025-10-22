'use client';

import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, Zap, ArrowRight, Mail, Wallet, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { 
    ready, 
    authenticated, 
    login,
  } = usePrivy();

  // Redirect if already authenticated
  useEffect(() => {
    if (ready && authenticated) {
      router.push('/dashboard');
    }
  }, [ready, authenticated, router]);

  // Show loading state while Privy initializes
  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff7a66] animate-spin" />
      </div>
    );
  }

  // If already authenticated, show loading while redirecting
  if (authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff7a66] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Gradient orbs for visual interest */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#ff7a66] rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#ff7a66] rounded-full opacity-10 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff7a66] to-[#ff9a88] flex items-center justify-center shadow-[0_0_30px_rgba(255,122,102,0.4)]">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-lg">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Feature Pills */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5 text-[#ff7a66]" />
              Secure
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-gray-400">
              <Zap className="w-3.5 h-3.5 text-[#ff7a66]" />
              Fast
            </div>
          </div>

          {/* Login Buttons */}
          <div className="space-y-4">
            {/* Email Login */}
            <button
              onClick={login}
              className="w-full px-6 py-4 bg-[#ff7a66] text-white font-semibold rounded-xl hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.4)] hover:shadow-[0_0_30px_rgba(255,122,102,0.6)] flex items-center justify-center gap-3 text-base group"
            >
              <Mail className="w-5 h-5" />
              Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-[#ff7a66] hover:text-[#ff8c7a] transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#ff7a66] hover:text-[#ff8c7a] transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
