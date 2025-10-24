'use client'
import React, { useState, useEffect } from 'react';
import {
  Trophy, Users, Settings, Search, Filter, Eye, Check, X,
  RefreshCw, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// --- Types ---
interface Submission {
  id: string;
  campaign_id: string;
  user_id: string;
  content_url: string[];
  status: 'pending' | 'approved' | 'rejected' | null;
  paid: number;
  created_at: string;
  campaign: {
    title: string;
    description: string;
    money_per_million_views: number;
    total_views: number;
    prize: number;
  };
  user: {
    username: string;
    first_name: string;
    pfp_url: string;
  };
}

// Stats interface for the summary card
interface Stats {
  pending: number;
  accepted: number;
  rejected: number;
  payoutsQueued: number;
}

const getStatusColor = (status: string | null) => {
  switch (status) {
    case null:
    case 'pending':
      return 'bg-zinc-800 text-gray-300 border-zinc-700';
    case 'approved':
      return 'bg-[#ff7a66] text-white border-[#ff7a66]';
    case 'rejected':
      return 'bg-red-900/30 text-red-400 border-red-800';
    default:
      return 'bg-zinc-800 text-gray-300';
  }
};

const getStatusIcon = (status: string | null) => {
  switch (status) {
    case null:
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'approved':
      return <CheckCircle className="w-4 h-4" />;
    case 'rejected':
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

const getTimeAgo = (date: string) => {
  const now = new Date();
  const submittedDate = new Date(date);
  const diffInMs = now.getTime() - submittedDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) return 'just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return submittedDate.toLocaleDateString();
};

const ClipSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bountyFilter, setBountyFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // State for the summary card
  const [stats, setStats] = useState<Stats>({
    pending: 0,
    accepted: 0,
    rejected: 0,
    payoutsQueued: 0,
  });

  const supabase = createClient();

  // Fetch submissions from Supabase
  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      // Build query for submissions
      let query = supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply time filter (Status filter is now applied client-side)
      if (timeFilter !== 'all') {
        const days = timeFilter === '7days' ? 7 : 30;
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);
        query = query.gte('created_at', dateThreshold.toISOString());
      }

      const { data: submissionsData, error: submissionsError } = await query;

      if (submissionsError) throw submissionsError;
      if (!submissionsData) throw new Error("No submissions data returned.");

      // Fetch related campaigns
      const campaignIds = [...new Set(submissionsData.map(s => s.campaign_id))];
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaign')
        .select('*')
        .in('id', campaignIds);

      if (campaignsError) throw campaignsError;

      // Fetch related users
      const userIds = [...new Set(submissionsData.map(s => s.user_id))];
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', userIds);

      if (usersError) throw usersError;

      // Create lookup maps
      const campaignMap = new Map(campaignsData?.map(c => [c.id, c]) || []);
      const userMap = new Map(usersData?.map(u => [u.id, u]) || []);

      // Combine data
      const combinedData = submissionsData.map(submission => ({
        ...submission,
        campaign: campaignMap.get(submission.campaign_id) || null,
        user: userMap.get(submission.user_id) || null
      }));

      // --- Calculate Stats ---
      const newStats: Stats = {
        pending: 0,
        accepted: 0,
        rejected: 0,
        payoutsQueued: 0,
      };

      let totalPayout = 0;

      for (const sub of combinedData) {
        if (sub.status === null) { // 'null' is pending
          newStats.pending += 1;
        } else if (sub.status === 'approved') {
          newStats.accepted += 1;
          // Sum prize money for approved submissions as "Payouts Queued"
          if (sub.campaign?.prize) {
            totalPayout += sub.campaign.prize;
          }
        } else if (sub.status === 'rejected') {
          newStats.rejected += 1;
        }
      }
      newStats.payoutsQueued = totalPayout;

      setStats(newStats);
      setSubmissions(combinedData as Submission[]);

    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [timeFilter]); // Re-fetch only when timeFilter changes

  // Filter submissions based on search, bounty, and status (client-side)
  const filteredSubmissions = submissions.filter((submission) => {
    // Status filter
    if (statusFilter === 'pending') {
      if (submission.status !== null) return false;
    } else if (statusFilter !== 'all') {
      if (submission.status !== statusFilter) return false;
    }

    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      submission.campaign?.title?.toLowerCase().includes(searchLower) ||
      submission.campaign?.description?.toLowerCase().includes(searchLower) ||
      submission.user?.username?.toLowerCase().includes(searchLower);

    if (searchQuery && !matchesSearch) return false;

    // Bounty filter
    const bounty = submission.campaign?.money_per_million_views || 0;
    if (bountyFilter === 'high' && bounty < 500) return false;
    if (bountyFilter === 'medium' && (bounty < 100 || bounty >= 500)) return false;
    if (bountyFilter === 'low' && bounty >= 100) return false;

    return true;
  });

  // Handle accept submission
  const handleAccept = async (submissionId: string) => {
    try {
      setProcessingId(submissionId);
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'approved' })
        .eq('id', submissionId);

      if (error) throw error;

      await fetchSubmissions(); // Re-fetch to update list and stats
    } catch (error) {
      console.error('Error accepting submission:', error);
      alert('Failed to accept submission');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject submission
  const handleReject = async (submissionId: string) => {
    try {
      setProcessingId(submissionId);
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'rejected' })
        .eq('id', submissionId);

      if (error) throw error;

      await fetchSubmissions(); // Re-fetch to update list and stats
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Failed to reject submission');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle revert submission
  const handleRevert = async (submissionId: string) => {
    try {
      setProcessingId(submissionId);
      const { error } = await supabase
        .from('submissions')
        .update({ status: null }) // Set back to null (pending)
        .eq('id', submissionId);

      if (error) throw error;

      await fetchSubmissions(); // Re-fetch to update list and stats
    } catch (error) {
      console.error('Error reverting submission:', error);
      alert('Failed to revert submission');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusDisplay = (status: string | null) => {
    if (status === null) return 'pending';
    return status;
  };

  // Helper to display the time filter text in the summary
  const getTimeFilterDisplay = () => {
    switch (timeFilter) {
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case 'all': return 'All Time';
      default: return 'Today';
    }
  }

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
            <option value="all">Status: All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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

          <button
            onClick={fetchSubmissions}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white hover:bg-zinc-800 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* --- ADDED SUMMARY SECTION --- */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Summary</h3>
          <span className="px-3 py-1 bg-[#ff7a66] text-white text-sm rounded-lg capitalize">
            {getTimeFilterDisplay()}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Pending</p>
            <p className="text-3xl font-bold text-white">{stats.pending}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Accepted</p>
            <p className="text-3xl font-bold text-white">{stats.accepted}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Declined</p>
            <p className="text-3xl font-bold text-white">{stats.rejected}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Payouts Queued</p>
            <p className="text-3xl font-bold text-white">${stats.payoutsQueued.toLocaleString()}</p>
          </div>
        </div>
      </div>
      {/* --- END SUMMARY SECTION --- */}


      {/* Submissions List */}
      <div className="space-y-4 mb-8">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm text-gray-500 font-medium">
          <div className="col-span-4">Campaign Title</div>
          <div className="col-span-2">Creator</div>
          <div className="col-span-2">Performance</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            Loading submissions...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSubmissions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No submissions found
          </div>
        )}

        {/* Submission Rows */}
        {!loading && filteredSubmissions.map((submission) => {
          const avatarUrl = submission.user?.pfp_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.user?.first_name || 'User'}`;
          const isPending = submission.status === null;
          const isApproved = submission.status === 'approved';
          const isProcessing = processingId === submission.id;

          return (
            <div
              key={submission.id}
              className="grid grid-cols-12 gap-4 items-center px-6 py-5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all"
            >
              {/* Title & Campaign Info */}
              <div className="col-span-4 flex items-center gap-4">
                <img
                  src={avatarUrl}
                  alt={submission.user?.username || 'User'}
                  className="w-12 h-12 rounded-lg bg-zinc-800"
                />
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {submission.campaign?.title || 'Untitled Campaign'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted {getTimeAgo(submission.created_at)}
                  </p>
                </div>
              </div>

              {/* Creator */}
              <div className="col-span-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg w-fit">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    @{submission.user?.username || 'unknown'}
                  </span>
                </div>
              </div>

              {/* Performance */}
              <div className="col-span-2">
                <div className="px-3 py-1.5 bg-zinc-800 border border-[#ff7a66] rounded-lg">
                  <div className="flex flex-col items-start gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#ff7a66]" />
                      <span className="text-white font-semibold">
                        {(submission.campaign?.total_views || 0).toLocaleString()} views
                      </span>
                    </div>
                    <span className="text-[#ff7a66] font-bold">
                      ${((submission.campaign?.total_views || 0) / 1000000 * (submission.campaign?.money_per_million_views || 0)).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    ${submission.campaign?.money_per_million_views || 0}/1M views
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-fit ${getStatusColor(submission.status)}`}>
                  {getStatusIcon(submission.status)}
                  <span className="text-sm font-medium capitalize">
                    {getStatusDisplay(submission.status)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-2 relative">
                <div className="relative inline-block">
                  <div className="flex items-center gap-0">
                    {/* Review Button */}
                    <a
                      href={submission.content_url?.[0] || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-l-lg hover:bg-zinc-700 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Review</span>
                    </a>

                    {/* Dropdown Arrow */}
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === submission.id ? null : submission.id)}
                      className="px-2 py-2 bg-zinc-800 border border-l-0 border-zinc-700 text-white rounded-r-lg hover:bg-zinc-700 transition-all"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${openDropdownId === submission.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {openDropdownId === submission.id && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdownId(null)}
                      />
                      <div className="absolute left-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20 overflow-hidden">
                        {isPending && (
                          <>
                            <button
                              onClick={() => {
                                handleAccept(submission.id);
                                setOpenDropdownId(null);
                              }}
                              disabled={isProcessing}
                              className="flex items-center gap-3 px-4 py-3 w-full text-left text-[#ff7a66] hover:bg-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => {
                                handleReject(submission.id);
                                setOpenDropdownId(null);
                              }}
                              disabled={isProcessing}
                              className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {(isApproved || submission.status === 'rejected') && (
                          <button
                            onClick={() => {
                              handleRevert(submission.id);
                              setOpenDropdownId(null);
                            }}
                            disabled={isProcessing}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Revert to Pending</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ClipSubmissions;
