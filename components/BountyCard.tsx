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
    <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <button 
          className={`ml-4 px-6 py-2 rounded-full text-sm font-medium ${
            status === 'open' 
              ? 'bg-indigo-100 text-indigo-600' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {status === 'open' ? 'Open' : 'Closed'}
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full h-32 mb-4 rounded-2xl overflow-hidden bg-gray-200">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Money per Million Views and Tags */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
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

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          <Eye className="w-5 h-5" />
          View Details
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-full text-white font-medium hover:bg-indigo-700 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Submit Clip
        </button>
      </div>
    </div>
  );
};

export default BountyCard;

// // Demo with sample data
// const App = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
//       <BountyCard
//         title="Product Launch Video"
//         description="Create an engaging video showcasing our new product features"
//         imageUrl="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop"
//         moneyPerMillionViews={5000}
//         entries={24}
//         totalViews={15600}
//         paid={2500}
//         prize={3000}
//         contentTypeTags={['Video', 'Animation', 'Graphics']}
//         industryTags={['Tech', 'SaaS', 'Marketing']}
//         status="open"
//       />
//     </div>
//   );
// };
//
// export default App;
