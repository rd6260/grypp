'use client';

import { useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Users, 
  CheckCircle2, 
  XCircle,
  Target,
  FileVideo,
  Scale,
  Award,
  DollarSign,
  TrendingUp,
  Tag,
  FolderOpen,
  Send,
  X
} from 'lucide-react';

import NavigationBar from '@/components/GryppBar';
import { createClient } from '@/lib/supabase/client';
import { usePrivy } from '@privy-io/react-auth';

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
  category_tags: string[];
  status: boolean;
  resource: string | null;
}

function ProjectDetailsContent() {
  const params = useParams();
  const projectId = params.id as string;
  const supabase = createClient();
  const { authenticated, user, login } = usePrivy();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [contentUrl, setContentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Get Privy user ID
  const userId = user?.id || null;

  // Fetch campaign data
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        
        // Fetch campaign details
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaign')
          .select('*')
          .eq('id', projectId)
          .single();

        if (campaignError) throw campaignError;

        setCampaign(campaignData);

        // Fetch submission count
        const { count, error: countError } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', projectId);

        if (countError) throw countError;

        setSubmissionCount(count || 0);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching campaign:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchCampaign();
    }
  }, [projectId, supabase]);

  const handleSubmit = async () => {
    if (!contentUrl.trim()) {
      alert('Please enter a content URL');
      return;
    }

    if (!authenticated || !userId) {
      alert('Please login to submit');
      login();
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('submissions')
        .insert({
          campaign_id: projectId,
          user_id: userId,
          content_url: [contentUrl],
          status: null,
          paid: 0
        });

      if (error) throw error;

      alert('Submission successful!');
      setShowSubmitModal(false);
      setContentUrl('');
      
      // Refresh submission count
      const { count } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', projectId);
      
      setSubmissionCount(count || 0);
    } catch (err: any) {
      alert('Error submitting: ' + err.message);
      console.error('Error submitting:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    if (!authenticated) {
      login();
      return;
    }
    setShowSubmitModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-gray-400">Loading campaign...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 rounded-lg shadow p-8 text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-medium text-white mb-4">Campaign Not Found</h1>
            <p className="text-gray-400">{error || 'The campaign you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const isOpen = campaign.status;
  const payPerThousandViews = (campaign.money_per_million_views / 1000).toFixed(2);

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <div className='px-4 py-2'>
        <NavigationBar/>
      </div>
      
      {/* Main Content */}
      <main className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to bounties</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Tags */}
            <div className="bg-[#171719] p-6 rounded-lg">
              <div className="flex gap-2 flex-wrap mb-4">
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${isOpen
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
                  }`}>
                  {isOpen ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {isOpen ? 'Open' : 'Closed'}
                </span>
                {campaign.content_type_tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-medium text-white mb-3">{campaign.title}</h1>
              </div>

              {/* Banner Image */}
              {campaign.image && (
                <div className="rounded-lg overflow-hidden shadow-lg mb-4">
                  <div className="aspect-video w-full h-64">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg p-4 shadow-sm border border-zinc-800">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Submissions
                  </div>
                  <div className="text-lg font-medium text-white">{submissionCount}</div>
                </div>
                <div className="rounded-lg p-4 shadow-sm border border-zinc-800">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    Total Views
                  </div>
                  <div className="text-lg font-medium text-white">{campaign.total_views.toLocaleString()}</div>
                </div>
                <div className="rounded-lg p-4 shadow-sm border border-zinc-800">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                    {isOpen ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    Status
                  </div>
                  <div className={`text-lg font-medium ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                    {isOpen ? 'Accepting' : 'Closed'}
                  </div>
                </div>
                <div className="rounded-lg p-4 shadow-sm border border-zinc-800">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    Total Paid
                  </div>
                  <div className="text-lg font-medium text-white">${campaign.paid.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg p-6 shadow-sm border border-zinc-800">
              <h2 className="text-xl font-medium mb-4 text-white flex items-center gap-2">
                <FileVideo className="w-5 h-5" />
                Description
              </h2>

              <div className="text-gray-200 whitespace-pre-wrap">
                {campaign.description}
              </div>

              {/* Category Tags */}
              {campaign.category_tags && campaign.category_tags.length > 0 && (
                <div className="mt-6">
                  <div className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    Categories
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {campaign.category_tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Submission Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#171719] rounded-lg p-6 border border-zinc-800">
              <h3 className="text-xl font-medium text-white flex items-center gap-2">
                <Send className="w-5 h-5" />
                Submit Your Entry
              </h3>

              {/* Budget Info */}
              <div className="bg-[#171719] rounded-lg p-4 text-white border border-zinc-800 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      Prize Pool
                    </div>
                    <div className="text-lg font-medium">${campaign.prize.toLocaleString()}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      Pay Per 1K Views
                    </div>
                    <div className="text-lg font-medium">${payPerThousandViews}</div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      Per Million Views
                    </div>
                    <div className="text-lg font-medium">${campaign.money_per_million_views.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4 mt-6">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">Content Type</div>
                  <div className="flex gap-2 flex-wrap">
                    {campaign.content_type_tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {campaign.category_tags && campaign.category_tags.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-2">Categories</div>
                    <div className="flex gap-2 flex-wrap">
                      {campaign.category_tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className='bg-[#0b0b0b] p-3 rounded-lg mt-6'>
                <button 
                  onClick={handleSubmitClick}
                  disabled={!isOpen}
                  className={`w-full py-2 font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                    isOpen 
                      ? 'bg-[#ff7a66] text-white hover:bg-[#ff8c7a] shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)]'
                      : 'bg-zinc-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {!authenticated ? 'Login to Submit' : isOpen ? 'Submit Entry' : 'Campaign Closed'}
                </button>
              </div>
            </div>

            {/* Resources Section */}
            {campaign.resource && (
              <div className="bg-[#171719] rounded-lg p-4 text-white border border-zinc-800">
                <h4 className="text-base font-medium mb-3 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Resources
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                  Access brand assets, guidelines, and reference materials
                </p>
                <a 
                  href={campaign.resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Resources
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#171719] rounded-lg p-6 max-w-md w-full border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-white">Submit Your Content</h3>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Content URL
              </label>
              <input
                type="url"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ff7a66] transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the URL of your YouTube video, Instagram reel, TikTok, or other social media content
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !contentUrl.trim()}
                className={`flex-1 py-2 font-medium rounded-lg transition-all ${
                  submitting || !contentUrl.trim()
                    ? 'bg-zinc-700 text-gray-400 cursor-not-allowed'
                    : 'bg-[#ff7a66] text-white hover:bg-[#ff8c7a] shadow-[0_0_20px_rgba(255,122,102,0.5)]'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-gray-400">Loading campaign...</div>
      </div>
    }>
      <ProjectDetailsContent />
    </Suspense>
  );
}
