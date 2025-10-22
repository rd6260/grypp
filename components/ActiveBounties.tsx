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

  const progressPercentage = Math.min((totalViews / 10000000) * 100, 100);

  return (
    <div className="w-full bg-[#1a1a1a] rounded-2xl border border-gray-700 p-6 font-sans">
      {/* Title and Description with Logo */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff7a66] to-[#ff5544] flex-shrink-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" 
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
          <p className="text-gray-400 text-xs mb-1">Entries</p>
          <p className="text-white font-bold text-lg">{entries}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Views</p>
          <p className="text-white font-bold text-lg">{formatNumber(totalViews)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Prize</p>
          <p className="text-white font-bold text-lg">{formatCurrency(prize)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Per 1M Views</p>
          <p className="text-white font-bold text-lg">${formatNumber(moneyPerMillionViews)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-xs">Progress</span> </div>
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
    contentTypeTags: ['Clipping'],
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
    contentTypeTags: ['Logo Display'],
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
    contentTypeTags: ['Video content'],
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
    <div className="min-h-screen p-8 mx-8 rounded-3xl border border-gray-600">
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
          {bountyData.map((bounty, index) => (
            <BountyCard key={index} {...bounty} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveBounties;
