'use client'
import React, { useState, useEffect } from 'react';
import {
  Trophy, Users, Search, RefreshCw, Plus, Eye, DollarSign,
  Tag, TrendingUp, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// --- Types ---
interface Campaign {
  id: string;
  created_at: string;
  creator_id: string;
  title: string;
  description: string;
  image: string | null;
  money_per_million_views: number;
  entries: number;
  total_views: number;
  paid: number;
  prize: number;
  content_type_tags: string[];
  category_tags: string[] | null;
  status: boolean;
  creator?: {
    username: string;
    first_name: string;
    pfp_url: string;
  };
  submission_count?: number;
}

interface Stats {
  total: number;
  active: number;
  closed: number;
  totalPrizePool: number;
}

const getStatusColor = (status: boolean) => {
  return status 
    ? 'bg-[#ff7a66] text-white border-[#ff7a66]'
    : 'bg-zinc-800 text-gray-400 border-zinc-700';
};

const getStatusIcon = (status: boolean) => {
  return status 
    ? <CheckCircle className="w-4 h-4" />
    : <XCircle className="w-4 h-4" />;
};

const getTimeAgo = (date: string) => {
  const now = new Date();
  const createdDate = new Date(date);
  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) return 'just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return createdDate.toLocaleDateString();
};

const BountySection = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [bountyFilter, setBountyFilter] = useState('all');

  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    closed: 0,
    totalPrizePool: 0,
  });

  const supabase = createClient();

  // Fetch campaigns from Supabase
  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      // Fetch campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaign')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;
      if (!campaignsData) throw new Error("No campaigns data returned.");

      // Fetch creators
      const creatorIds = [...new Set(campaignsData.map(c => c.creator_id))];
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', creatorIds);

      if (usersError) throw usersError;

      // Get submission counts for each campaign
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('campaign_id');

      if (submissionsError) throw submissionsError;

      const submissionCounts = submissionsData?.reduce((acc, sub) => {
        acc[sub.campaign_id] = (acc[sub.campaign_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Create lookup map
      const userMap = new Map(usersData?.map(u => [u.id, u]) || []);

      // Combine data
      const combinedData = campaignsData.map(campaign => ({
        ...campaign,
        creator: userMap.get(campaign.creator_id) || null,
        submission_count: submissionCounts[campaign.id] || 0
      }));

      // Calculate stats
      const newStats: Stats = {
        total: combinedData.length,
        active: combinedData.filter(c => c.status === true).length,
        closed: combinedData.filter(c => c.status === false).length,
        totalPrizePool: combinedData
          .filter(c => c.status === true)
          .reduce((sum, c) => sum + (c.prize || 0), 0),
      };

      setStats(newStats);
      setCampaigns(combinedData as Campaign[]);

    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    // Status filter
    if (statusFilter === 'active' && !campaign.status) return false;
    if (statusFilter === 'closed' && campaign.status) return false;

    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      campaign.title?.toLowerCase().includes(searchLower) ||
      campaign.description?.toLowerCase().includes(searchLower) ||
      campaign.creator?.username?.toLowerCase().includes(searchLower);

    if (searchQuery && !matchesSearch) return false;

    // Content type filter
    if (contentTypeFilter !== 'all') {
      if (!campaign.content_type_tags?.includes(contentTypeFilter)) return false;
    }

    // Bounty filter
    const bounty = campaign.money_per_million_views || 0;
    if (bountyFilter === 'high' && bounty < 500) return false;
    if (bountyFilter === 'medium' && (bounty < 100 || bounty >= 500)) return false;
    if (bountyFilter === 'low' && bounty >= 100) return false;

    return true;
  });

  return (
    <>
      {/* Bounty Section Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Campaign Bounties</h2>
          <button
            onClick={() => router.push('/campaign/create')}
            className="flex items-center gap-2 px-6 py-3 bg-[#ff7a66] text-white rounded-lg border border-[#ff7a66] shadow-[0_0_10px_rgba(255,122,102,0.3)] hover:bg-[#ff6b56] transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search campaigns"
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
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ff7a66] focus:border-transparent cursor-pointer"
          >
            <option value="all">Content Type: All</option>
            <option value="Clipping">Clipping</option>
            <option value="Logo display">Logo Display</option>
            <option value="Video content">Video Content</option>
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

          <button
            onClick={fetchCampaigns}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white hover:bg-zinc-800 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Overview</h3>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Total Campaigns</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Active</p>
            <p className="text-3xl font-bold text-[#ff7a66]">{stats.active}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Closed</p>
            <p className="text-3xl font-bold text-white">{stats.closed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Total Prize Pool</p>
            <p className="text-3xl font-bold text-white">${stats.totalPrizePool.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4 mb-8">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm text-gray-500 font-medium">
          <div className="col-span-4">Campaign</div>
          <div className="col-span-2">Creator</div>
          <div className="col-span-2">Bounty</div>
          <div className="col-span-2">Engagement</div>
          <div className="col-span-2">Status</div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            Loading campaigns...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCampaigns.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No campaigns found
          </div>
        )}

        {/* Campaign Rows */}
        {!loading && filteredCampaigns.map((campaign) => {
          const avatarUrl = campaign.creator?.pfp_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${campaign.creator?.first_name || 'Creator'}`;

          return (
            <div
              key={campaign.id}
              className="grid grid-cols-12 gap-4 items-center px-6 py-5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all cursor-pointer"
              onClick={() => router.push(`/campaign/${campaign.id}`)}
            >
              {/* Campaign Info */}
              <div className="col-span-4 flex items-center gap-4">
                <img
                  src={campaign.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${campaign.title}`}
                  alt={campaign.title}
                  className="w-16 h-16 rounded-lg bg-zinc-800 object-cover"
                />
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {campaign.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {campaign.content_type_tags?.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Created {getTimeAgo(campaign.created_at)}
                  </p>
                </div>
              </div>

              {/* Creator */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <img
                    src={avatarUrl}
                    alt={campaign.creator?.username || 'Creator'}
                    className="w-8 h-8 rounded-full bg-zinc-800"
                  />
                  <span className="text-sm text-gray-300">
                    @{campaign.creator?.username || 'unknown'}
                  </span>
                </div>
              </div>

              {/* Engagement */}
              <div className="col-span-2">
                <div className="px-3 py-2 bg-zinc-800 border border-[#ff7a66] rounded-lg">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#ff7a66]" />
                      <span className="text-white font-semibold">
                        {(campaign.total_views || 0).toLocaleString()} views
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {campaign.submission_count || 0} submissions
                    </span>
                  </div>
                </div>
              </div>

              {/* Bounty */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    ${campaign.money_per_million_views}/1M views
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-fit ${getStatusColor(campaign.status)}`}>
                  {getStatusIcon(campaign.status)}
                  <span className="text-sm font-medium">
                    {campaign.status ? 'Active' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BountySection;
