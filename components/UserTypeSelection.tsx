"use client";

import React, { useState } from 'react';

export type UserType = 'creator' | 'clipper';

export interface UserTypeSelectionProps {
  onSelect: (type: UserType) => void;
}

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelect }) => {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleSelect = (type: UserType) => {
    setSelectedType(type);
    onSelect(type);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12">
        {/* Creator Option */}
        <div className="flex flex-col">
          <h2 className="text-white text-4xl font-bold mb-6">
            Continue as a Creator.
          </h2>
          <p className="text-gray-400 text-lg w-95 mb-8 leading-relaxed">
            Create, share, and earn from your videos. Build your brand and grow your audience with every upload
          </p>
          <button
            onClick={() => handleSelect('creator')}
            className="w-95 py-4 bg-[#ff6b57] text-white text-xl font-semibold rounded-xl hover:bg-[#ff7a66] transition-all duration-300 shadow-[0_0_30px_rgba(255,107,87,0.6)] hover:shadow-[0_0_40px_rgba(255,107,87,0.8)]"
          >
            Video Creator
          </button>
        </div>

        {/* Clipper Option */}
        <div className="flex flex-col">
          <h2 className="text-white text-4xl font-bold mb-6">
            Continue as a Clipper.
          </h2>
          <p className="text-gray-400 text-lg mb-8 w-95 leading-relaxed">
            Clip viral moments, upload your edits, and earn. Turn your editing skills into a stream of income
          </p>
          <button
            onClick={() => handleSelect('clipper')}
            className="w-95 py-4 bg-[#ff6b57] text-white text-xl font-semibold rounded-xl hover:bg-[#ff7a66] transition-all duration-300 shadow-[0_0_30px_rgba(255,107,87,0.6)] hover:shadow-[0_0_40px_rgba(255,107,87,0.8)]"
          >
            Clipper
          </button>
        </div>
      </div>
    </div>
  );
}
