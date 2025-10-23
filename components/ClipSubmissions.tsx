// components/ClipSubmissions.tsx
'use client'
import React, { useState } from 'react';
import { 
  Trophy, Users, Settings, Search, Filter, Eye, Check, X, 
  RefreshCw, Clock, CheckCircle, XCircle 
} from 'lucide-react';

// --- Types, Data, and Helpers ---
// (Moved from AdminPanel)

interface Submission {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorAvatar: string;
  bounty: number;
  views: number;
  status: 'pending' | 'accepted' | 'declined';
  submittedAt: string;
}

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: '1',
    title: '"AGI timeline in 30s"',
    description: 'Clip highlight moments from AI talks',
    creator: '@ava_clips',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
    bounty: 1000,
    views: 1200,
    status: 'pending',
    submittedAt: '2h ago'
  },
  {
    id: '2',
    title: '"Fix null ref in 20s"',
    description: 'Clip best bug-fix tips from streams',
    creator: '@bugfix_ben',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ben',
    bounty: 1000,
    views: 890,
    status: 'accepted',
    submittedAt: '5h ago'
  },
  {
    id: '3',
    title: '"Demo to short: onboarding"',
    description: 'Create shorts from product demos',
    creator: '@demo_dan',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dan',
    bounty: 1000,
    views: 2400,
    status: 'declined',
    submittedAt: 'yesterday'
  },
  {
    id: '4',
    title: '"Founder quote goes viral"',
    description: 'Extract viral moments from interviews',
    creator: '@clip_kara',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kara',
    bounty: 1000,
    views: 3100,
    status: 'pending',
    submittedAt: '3d ago'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-zinc-800 text-gray-300 border-zinc-700';
    case 'accepted':
      return 'bg-[#ff7a66] text-white border-[#ff7a66]';
    case 'declined':
      return 'bg-red-900/30 text-red-400 border-red-800';
    default:
      return 'bg-zinc-800 text-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'accepted':
      return <CheckCircle className="w-4 h-4" />;
    case 'declined':
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};


// --- The Component ---

const ClipSubmissions = () => {
  // State for filters, now encapsulated here
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bountyFilter, setBountyFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('7days');

  return (
    <>
      {/* Clip Submissions Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Clip Submissions</h2>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#ff7a66] text-white rounded-lg border border-[#ff7a66] shadow-[0_0_10px_rgba(255,122,102,0.3)]">
            <Settings className="w-4 h-4" />
            Moderation Queue
          </button>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search submissions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent cursor-pointer"
          >
            <option value="all">Status: Pending</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>

          <select
            value={bountyFilter}
            onChange={(e) => setBountyFilter(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent cursor-pointer"
          >
            <option value="all">Bounty: All</option>
            <option value="high">High ($500+)</option>
            <option value="medium">Medium ($100-$500)</option>
            <option value="low">Low (&lt;$100)</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent cursor-pointer"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="all">All time</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white hover:bg-zinc-800 transition-all">
            <Filter className="w-4 h-4" />
            More filters
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4 mb-8">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm text-gray-500 font-medium">
          <div className="col-span-4">Clip Title & Bounty</div>
          <div className="col-span-2">Creator</div>
          <div className="col-span-2">Performance</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Submission Rows */}
        {MOCK_SUBMISSIONS.map((submission) => (
          <div
            key={submission.id}
            className="grid grid-cols-12 gap-4 items-center px-6 py-5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all"
          >
            {/* Title & Bounty */}
            <div className="col-span-4 flex items-center gap-4">
              <img
                src={submission.creatorAvatar}
                alt={submission.creator}
                className="w-12 h-12 rounded-lg bg-zinc-800"
              />
              <div>
                <h3 className="text-white font-semibold mb-1">{submission.title}</h3>
                <p className="text-sm text-gray-400">{submission.description}</p>
                <p className="text-xs text-gray-500 mt-1">Submitted {submission.submittedAt}</p>
              </div>
            </div>

            {/* Creator */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg w-fit">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{submission.creator}</span>
              </div>
            </div>

            {/* Performance */}
            <div className="col-span-2">
              <div className="px-3 py-1.5 bg-zinc-800 border border-[#ff7a66] rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#ff7a66]" />
                  <span className="text-white font-semibold">${submission.bounty} / 1m views</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Views: {submission.views.toLocaleString()} • Prize: prize
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-fit ${getStatusColor(submission.status)}`}>
                {getStatusIcon(submission.status)}
                <span className="text-sm font-medium capitalize">{submission.status}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 transition-all">
                <Eye className="w-4 h-4" />
                Review
              </button>
              {submission.status === 'pending' && (
                <button className="flex items-center gap-2 px-3 py-2 bg-[#ff7a66] text-white rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_10px_rgba(255,122,102,0.3)]">
                  <Check className="w-4 h-4" />
                  Accept
                </button>
              )}
              {submission.status === 'accepted' && (
                <button className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 transition-all">
                  <RefreshCw className="w-4 h-4" />
                  Revert
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClipSubmissions;
