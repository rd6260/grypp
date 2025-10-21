'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
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
  Send
} from 'lucide-react';

import NavigationBar from '@/components/GryppBar';


function ProjectDetailsContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectid');

  // Mock project data - replace with actual API call
  const project = {
    id: projectId,
    title: 'Clip highlight moments from AI talks',
    description: 'Find 30-60s highlight segments from the latest AI conference videos. Focus on clear insights, novel ideas, and audience reactions.',
    status: 1, // 0 = closed, 1 = open
    entries: 128,
    views: '12.4k',
    deadline: 'Nov 30, 2025',
    totalBudget: '850 USDC',
    minViews: '1000',
    payPerView: '$3',
    maxPayout: '$100',
    objective: 'Identify 3-5 high-impact clips (30-60s) per talk that showcase breakthroughs, quotable insights, or moments with strong audience reaction.',
    sourceMaterial: ['YouTube Playlist', 'Conference 2025', 'Keynote + Panels'],
    clipSpecs: 'Resolution 1080p+, aspect 9:16 or 1:1, hard captions, subtle waveform, clean cut-in/out.',
    licensing: 'Fair use commentary. Attribute original speaker and event in overlay.',
    judging: 'Relevance, clarity, share-worthiness, watch-through rate.',
    contentTypeTags: ['Clipping', 'Editing'],
    categoryTags: ['AI', 'Stream', 'Tech'],
  };

  if (!projectId) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 rounded-lg shadow p-8 text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-medium text-white mb-4">No Project ID</h1>
            <p className="text-gray-400">Please provide a project ID in the URL: ?projectid=PROJECTID</p>
          </div>
        </div>
      </div>
    );
  }

  const isOpen = project.status === 1;

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <div className='px-4 py-2'>
        <NavigationBar/>
      </div>
      {/* Main Content */}
      <main className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
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
                {project.contentTypeTags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-medium text-white mb-1">{project.title}</h1>
                <p className="text-gray-400 mb-2">{project.description}</p>
              </div>

              {/* Banner Image */}
              <div className="rounded-lg overflow-hidden shadow-lg mb-4">
                <div className="aspect-video w-full h-64">
                  <img
                    src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop"
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg p-4 shadow-sm border border-zinc-800">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Entries
                  </div>
                  <div className="text-lg font-medium text-white">{project.entries}</div>
                </div>
                <div className="rounded-lg p-4 shadow-sm border border-zinc-800">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    Views
                  </div>
                  <div className="text-lg font-medium text-white">{project.views}</div>
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
                    <Calendar className="w-4 h-4" />
                    Deadline
                  </div>
                  <div className="text-lg font-medium text-white">{project.deadline}</div>
                </div>
              </div>
            </div>


            {/* Overview */}
            <div className="rounded-lg p-6 shadow-sm border border-zinc-800">
              <h2 className="text-xl font-medium mb-4 text-white flex items-center gap-2">
                <FileVideo className="w-5 h-5" />
                Description
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    Objective
                  </div>
                  <div className="text-gray-200">{project.objective}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4" />
                    Source Material
                  </div>
                  <div className="flex gap-2">
                    {project.sourceMaterial.map((source, idx) => (
                      <span key={idx} className="px-3 py-1 bg-zinc-800 text-gray-300 rounded text-sm">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <FileVideo className="w-4 h-4" />
                    Clip Specs
                  </div>
                  <div className="text-gray-200">{project.clipSpecs}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    Licensing
                  </div>
                  <div className="text-gray-200">{project.licensing}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Judging
                  </div>
                  <div className="text-gray-200">{project.judging}</div>
                </div>
              </div>
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
                      <DollarSign className="w-4 h-4" />
                      Total Budget
                    </div>
                    <div className="text-lg font-medium">{project.totalBudget}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      Minimum Views
                    </div>
                    <div className="text-lg font-medium">{project.minViews}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      Pay Per 1K Views
                    </div>
                    <div className="text-lg font-medium">{project.payPerView}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      Max Payout Per Video
                    </div>
                    <div className="text-lg font-medium">{project.maxPayout}</div>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4 mt-6">
                <div>
                  <div className="flex gap-2 flex-wrap">
                    {project.contentTypeTags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex gap-2 flex-wrap">
                    {project.categoryTags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button at Bottom */}
              <div className='bg-[#0b0b0b] p-3 rounded-lg mt-6'>
                <button className="w-full py-2 bg-[#ff7a66] text-white font-medium rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)] flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Entry
                </button>
              </div>
            </div>

            {/* Resources Section */}
            <div className="bg-[#171719] rounded-lg p-4 text-white border border-zinc-800">
              <h4 className="text-base font-medium mb-3 flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Resources
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Access brand assets, guidelines, and reference materials
              </p>
              <button className="w-full py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open Resources
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading project...</div>
      </div>
    }>
      <ProjectDetailsContent />
    </Suspense>
  );
}
