import React from 'react';
import { Eye, TrendingUp } from 'lucide-react';

interface BountyCardProps {
  title: string;
  description: string;
  imageUrl: string;
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

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg p-6 font-sans">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <button 
          className={`ml-4 px-6 py-2 rounded-lg text-sm font-medium ${
            status === 'open' 
              ? 'bg-indigo-100 text-indigo-600' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {status === 'open' ? 'Open' : 'Closed'}
        </button>
      </div>

      <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-200">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 shrink-0">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            ${formatNumber(moneyPerMillionViews)}/1m views
          </span>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {contentTypeTags.map((tag, index) => (
            <div 
              key={`content-${index}`}
              className="px-3 py-1.5 rounded-full border text-xs font-medium bg-purple-50 border-purple-200 text-purple-700"
            >
              {tag}
            </div>
          ))}
          {categoryTags.map((tag, index) => (
            <div 
              key={`category-${index}`}
              className="px-3 py-1.5 rounded-full border text-xs font-medium bg-emerald-50 border-emerald-200 text-emerald-700"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Entries</p>
          <p className="text-xl font-bold text-gray-900">{entries}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Views</p>
          <p className="text-xl font-bold text-gray-900">{formatNumber(totalViews)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Paid</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(paid)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Prize</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(prize)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          <Eye className="w-5 h-5" />
          View Details
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Submit Clip
        </button>
      </div>
    </div>
  );
};

// Sample bounty data
const bountyData: BountyCardProps[] = [
  {
    title: "Product Launch Video",
    description: "Create an engaging video showcasing our new product features",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop",
    moneyPerMillionViews: 5000,
    entries: 24,
    totalViews: 1560000,
    paid: 7800,
    prize: 5000,
    contentTypeTags: ['Video', 'Animation'],
    categoryTags: ['Tech', 'SaaS'],
    status: 'open'
  },
  {
    title: "Fitness Challenge",
    description: "30-day transformation workout routine compilation",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop",
    moneyPerMillionViews: 3500,
    entries: 42,
    totalViews: 2340000,
    paid: 8190,
    prize: 3500,
    contentTypeTags: ['Video', 'Tutorial'],
    categoryTags: ['Fitness', 'Lifestyle'],
    status: 'open'
  },
  {
    title: "Recipe Compilation",
    description: "Quick and healthy meal prep ideas for busy professionals",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop",
    moneyPerMillionViews: 4200,
    entries: 31,
    totalViews: 1890000,
    paid: 7938,
    prize: 4000,
    contentTypeTags: ['Video', 'Photos'],
    categoryTags: ['Food', 'Cooking'],
    status: 'open'
  },
  {
    title: "Travel Vlog Series",
    description: "Capture hidden gems and local experiences around Europe",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop",
    moneyPerMillionViews: 6000,
    entries: 18,
    totalViews: 3420000,
    paid: 20520,
    prize: 8000,
    contentTypeTags: ['Vlog', 'Video'],
    categoryTags: ['Travel', 'Adventure'],
    status: 'open'
  },
  {
    title: "Gaming Highlights",
    description: "Epic moments and strategies from competitive gaming",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
    moneyPerMillionViews: 7500,
    entries: 67,
    totalViews: 5680000,
    paid: 42600,
    prize: 10000,
    contentTypeTags: ['Stream', 'Video'],
    categoryTags: ['Gaming', 'Esports'],
    status: 'open'
  },
  {
    title: "DIY Home Projects",
    description: "Creative home improvement and decoration tutorials",
    imageUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=400&fit=crop",
    moneyPerMillionViews: 3800,
    entries: 29,
    totalViews: 1240000,
    paid: 4712,
    prize: 3000,
    contentTypeTags: ['Tutorial', 'Video'],
    categoryTags: ['DIY', 'Home'],
    status: 'open'
  },
  {
    title: "Tech Reviews",
    description: "In-depth analysis of latest gadgets and technology",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
    moneyPerMillionViews: 5500,
    entries: 35,
    totalViews: 2870000,
    paid: 15785,
    prize: 6000,
    contentTypeTags: ['Review', 'Video'],
    categoryTags: ['Tech', 'Gadgets'],
    status: 'open'
  },
  {
    title: "Fashion Lookbook",
    description: "Seasonal outfit ideas and styling tips for all occasions",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop",
    moneyPerMillionViews: 4500,
    entries: 52,
    totalViews: 3150000,
    paid: 14175,
    prize: 5500,
    contentTypeTags: ['Video', 'Photos'],
    categoryTags: ['Fashion', 'Style'],
    status: 'open'
  },
  {
    title: "Music Production",
    description: "Behind-the-scenes of creating beats and mixing tracks",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=400&fit=crop",
    moneyPerMillionViews: 4800,
    entries: 21,
    totalViews: 980000,
    paid: 4704,
    prize: 4000,
    contentTypeTags: ['Tutorial', 'Video'],
    categoryTags: ['Music', 'Production'],
    status: 'closed'
  }
];

interface ActiveBountiesProps {
  cardsPerRow?: number;
}

const ActiveBounties: React.FC<ActiveBountiesProps> = ({ cardsPerRow = 3 }) => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Active Bounties</h1>
          <p className="text-gray-600">Discover and participate in exciting content bounties</p>
        </div>
        
        <div 
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${cardsPerRow}, minmax(0, 1fr))`
          }}
        >
          {bountyData.map((bounty, index) => (
            <BountyCard key={index} {...bounty} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveBounties;
