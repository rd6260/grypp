"use client";
import React, { useState } from 'react';

interface PrizePool {
  id: string;
  amount: string;
  projectName: string;
}

const prizePools: PrizePool[] = [
  { id: 'proj_001', amount: '$2000', projectName: 'PROJECT 1' },
  { id: 'proj_002', amount: '$2000', projectName: 'PROJECT 2' },
  { id: 'proj_003', amount: '$2000', projectName: 'PROJECT 3' },
  { id: 'proj_004', amount: '$2000', projectName: 'PROJECT 4' },
  { id: 'proj_005', amount: '$2000', projectName: 'PROJECT 5' },
  { id: 'proj_006', amount: '$2000', projectName: 'PROJECT 6' },
];

const PrizePoolBanner: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  const handlePrizeClick = (projectId: string) => {
    window.location.href = `/project?projectid=${projectId}`;
  };

  // Duplicate the array to create seamless loop
  const duplicatedPools = [...prizePools, ...prizePools, ...prizePools];

  return (
    <div className="w-full bg-black overflow-hidden py-2">
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
