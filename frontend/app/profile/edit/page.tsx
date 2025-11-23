'use client';

import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import ProfileSetup from '@/components/ProfileSetup';

export default function EditProfilePage(): React.JSX.Element {
  const { user, ready, authenticated } = usePrivy();
  const router = useRouter();
  const [userType, setUserType] = useState<'creator' | 'clipper' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserType = async (): Promise<void> => {
      // Wait for Privy to be ready
      if (!ready) {
        return;
      }

      // Redirect if not authenticated
      if (!authenticated || !user?.id) {
        router.push('/login');
        return;
      }

      try {
        // Fetch user type from database
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('type')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // User doesn't exist in database yet, default to creator
            setUserType('creator');
          } else {
            console.error('Error fetching user type:', fetchError);
            setError('Failed to load user profile. Please try again.');
          }
        } else if (data) {
          setUserType(data.type as 'creator' | 'clipper');
        } else {
          // No data returned, default to creator
          setUserType('creator');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserType();
  }, [ready, authenticated, user?.id, router]);

  // Show loading state while checking authentication and fetching user type
  if (!ready || isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ff7a66] animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#ff7a66] text-white font-semibold rounded-lg hover:bg-[#ff8c7a] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Show ProfileSetup component when user type is loaded
  if (userType) {
    return <ProfileSetup userType={userType} redirectPath='/profile'/>;
  }

  // Fallback (should not reach here)
  return (<div>error</div>);
}
