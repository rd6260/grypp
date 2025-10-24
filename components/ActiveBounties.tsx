'use client';

import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';


const supabase = createClient();

interface Campaign {
  id: string;
  created_at: string;
  creator_id: string;
  title: string;
  description: string;
  image: string;
  money_per_million_views: number;
  entries: number;
  total_views: number;
  paid: number;
  prize: number;
  content_type_tags: string[];
  category_tags: string[];
  status: boolean;
  creator_pfp?: string;
}

interface BountyCardProps {
  title: string;
  description: string;
  imageUrl: string;
  creatorPfp?: string;
  moneyPerMillionViews: number;
  entries: number;
  totalViews: number;
  paid: number;
  prize: number;
  contentTypeTags: string[];
  categoryTags: string[];
  status?: 'open' | 'closed';
}

const BountyCard: React.FC<BountyCardProps> = ({
  title,
  description,
  imageUrl,
  creatorPfp,
  moneyPerMillionViews,
  entries,
  totalViews,
  paid,
  prize,
  contentTypeTags,
  categoryTags,
  status = 'open'
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}m`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const progressPercentage = Math.min((totalViews / 10000000) * 100, 100);

  return (
    <div className="w-full bg-[#1a1a1a] rounded-2xl border border-gray-700 p-6 font-sans">
      {/* Title and Description with Logo */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff7a66] to-[#ff5544] flex-shrink-0 overflow-hidden">
          <img 
            src={imageUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"} 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        {/* Content Type Tag */}
        {contentTypeTags.length > 0 && (
          <div className="px-3 py-1 bg-white text-black text-xs font-medium rounded-md whitespace-nowrap">
            {contentTypeTags[0]}
          </div>
        )}
      </div>

      {/* Stats in one line */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-400 text-xs mb-[-3]">Entries</p>
          <p className="text-white font-bold text-lg">{entries}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-[-3]">Views</p>
          <p className="text-white font-bold text-lg">{formatNumber(totalViews)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-[-3]">Prize</p>
          <p className="text-white font-bold text-lg">{formatCurrency(prize)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-[-3]">Per 1M Views</p>
          <p className="text-white font-bold text-lg">${formatNumber(moneyPerMillionViews)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-xs">Progress</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Button */}
      <button className="w-full py-3 bg-[#ff7a66] text-white font-medium rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)] flex items-center justify-center gap-2">
        <Eye className="w-4 h-4" />
        View Details
      </button>
    </div>
  );
}

interface ActiveBountiesProps {
  cardsPerRow?: number;
}

const ActiveBounties: React.FC<ActiveBountiesProps> = ({ cardsPerRow = 3 }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data: campaignsData, error } = await supabase
        .from('campaign')
        .select('*')
        .eq('status', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get unique creator IDs
      // const creatorIds = [...new Set(campaignsData?.map(c => c.creator_id) || [])];
      //
      // // Fetch creator pfp_urls
      // const { data: usersData, error: usersError } = await supabase
      //   .from('users')
      //   .select('id, pfp_url')
      //   .in('id', creatorIds);
      //
      // if (usersError) throw usersError;
      //
      // // Map pfp_urls to campaigns
      // const userPfpMap = new Map(usersData?.map(u => [u.id, u.pfp_url]) || []);
      //
      // const campaignsWithPfp = campaignsData?.map(campaign => ({
      //   ...campaign,
      //   creator_pfp: userPfpMap.get(campaign.creator_id)
      // })) || [];
      //
      // setCampaigns(campaignsWithPfp);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 mx-8 rounded-3xl">
        <div className="max-w-[1700px] mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Active Bounties</h1>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 mx-8 rounded-3xl">
      <div className="max-w-[1700px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Active Bounties</h1>
        </div>
        
        <div 
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${cardsPerRow}, minmax(0, 1fr))`
          }}
        >
          {campaigns.map((campaign) => (
            <BountyCard 
              key={campaign.id}
              title={campaign.title}
              description={campaign.description}
              imageUrl={campaign.image}
              creatorPfp={campaign.creator_pfp}
              moneyPerMillionViews={campaign.money_per_million_views}
              entries={campaign.entries}
              totalViews={campaign.total_views}
              paid={campaign.paid}
              prize={campaign.prize}
              contentTypeTags={campaign.content_type_tags}
              categoryTags={campaign.category_tags}
              status={campaign.status ? 'open' : 'closed'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveBounties;
