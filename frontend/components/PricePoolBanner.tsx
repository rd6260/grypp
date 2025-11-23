"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Campaign {
  id: string;
  prize: number;
}

interface PrizePool {
  id: string;
  amount: string;
  projectName: string;
}

const PrizePoolBanner: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [prizePools, setPrizePools] = useState<PrizePool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('campaign')
          .select('id, prize')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching campaigns:', error);
          return;
        }

        if (data) {
          const pools: PrizePool[] = data.map((campaign: Campaign, index: number) => ({
            id: campaign.id,
            amount: `$${campaign.prize.toLocaleString()}`,
            projectName: `PROJECT ${index + 1}`,
          }));
          setPrizePools(pools);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handlePrizeClick = (campaignId: string) => {
    window.location.href = `/campaign/${campaignId}`;
  };

  // Show loading state or empty state
  if (loading || prizePools.length === 0) {
    return (
      <div className="w-full overflow-hidden py-2" style={{ backgroundColor: '#ff7a66' }}>
        <div className="text-white text-sm font-medium text-center">
          {loading ? 'Loading...' : 'No campaigns available'}
        </div>
      </div>
    );
  }

  // Duplicate the array to create seamless loop
  const duplicatedPools = [...prizePools, ...prizePools, ...prizePools];

  return (
    <div className="w-full overflow-hidden py-2" style={{ backgroundColor: '#ff7a66' }}>
      <div
        className="flex gap-0"
        style={{
          animation: 'scroll 30s linear infinite',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedPools.map((pool, index) => (
          <div
            key={`${pool.id}-${index}`}
            onClick={() => handlePrizeClick(pool.id)}
            className="flex items-center gap-2 px-6 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            <input
              type="checkbox"
              checked
              readOnly
              className="w-3 h-3 cursor-pointer"
            />
            <span className="text-white text-sm font-medium tracking-wide">
              {pool.amount} PRIZE POOL FROM {pool.projectName}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
};

export default PrizePoolBanner;
