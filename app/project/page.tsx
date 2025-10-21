'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ProjectDetailsContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectid');

  // Mock project data - replace with actual API call
  const project = {
    id: projectId,
    title: 'Clip highlight moments from AI talks',
    description: 'Find 30-60s highlight segments from the latest AI conference videos. Focus on clear insights, novel ideas, and audience reactions.',
    status: 'Accepting',
    entries: 128,
    views: '12.4k',
    deadline: 'Nov 30, 2025',
    totalBudget: '850 USDC',
    minViews: '1K',
    payPerView: '$3',
    maxPayout: '$100',
    objective: 'Identify 3-5 high-impact clips (30-60s) per talk that showcase breakthroughs, quotable insights, or moments with strong audience reaction.',
    sourceMaterial: ['YouTube Playlist', 'Conference 2025', 'Keynote + Panels'],
    clipSpecs: 'Resolution 1080p+, aspect 9:16 or 1:1, hard captions, subtle waveform, clean cut-in/out.',
    licensing: 'Fair use commentary. Attribute original speaker and event in overlay.',
    judging: 'Relevance, clarity, share-worthiness, watch-through rate.',
    contentTypeTags: ['Clipping'],
    categoryTags: ['AI', 'Stream'],
  };

  if (!projectId) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">No Project ID</h1>
            <p className="text-gray-400">Please provide a project ID in the URL: ?projectid=PROJECTID</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button className="text-gray-400 hover:text-white flex items-center gap-2">
            <span>←</span> Back to bounties
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Tags */}
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Open</span>
              <span className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm">Clipping</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{project.title}</h1>
              <p className="text-gray-400">{project.description}</p>
            </div>

            {/* Banner Image */}
            <div className="rounded-lg overflow-hidden shadow-lg">
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
              <div className="bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-800">
                <div className="text-gray-500 text-sm mb-1">Entries</div>
                <div className="text-2xl font-bold text-white">{project.entries}</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-800">
                <div className="text-gray-500 text-sm mb-1">Views</div>
                <div className="text-2xl font-bold text-white">{project.views}</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-800">
                <div className="text-gray-500 text-sm mb-1">Status</div>
                <div className="text-lg font-semibold text-green-400">{project.status}</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-800">
                <div className="text-gray-500 text-sm mb-1">Deadline</div>
                <div className="text-lg font-semibold text-white">{project.deadline}</div>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-zinc-900 rounded-lg p-6 shadow-sm border border-zinc-800">
              <h2 className="text-xl font-bold mb-4 text-white">Description</h2>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">Objective</div>
                  <div className="text-gray-200">{project.objective}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">Source Material</div>
                  <div className="flex gap-2">
                    {project.sourceMaterial.map((source, idx) => (
                      <span key={idx} className="px-3 py-1 bg-zinc-800 text-gray-300 rounded text-sm">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">Clip Specs</div>
                  <div className="text-gray-200">{project.clipSpecs}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">Licensing</div>
                  <div className="text-gray-200">{project.licensing}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">Judging</div>
                  <div className="text-gray-200">{project.judging}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Submission Form */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-lg p-6 shadow-sm sticky top-8 space-y-6 border border-zinc-800">
              <h3 className="text-xl font-bold text-white">Submit Your Entry</h3>
              <button className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                SUBMIT ENTRY
              </button>

              <div className="text-center">
                <button className="text-orange-500 hover:underline text-sm">Read full rules</button>
              </div>

              {/* Budget Info */}
              <div className="bg-black rounded-lg p-6 text-white space-y-4 border border-zinc-800">
                <div>
                  <div className="text-gray-500 text-sm mb-1">TOTAL BUDGET</div>
                  <div className="text-2xl font-bold">{project.totalBudget}</div>
                </div>

                <div>
                  <div className="text-gray-500 text-sm mb-1">MINIMUM VIEWS</div>
                  <div className="text-xl font-semibold">{project.minViews}</div>
                </div>

                <div>
                  <div className="text-gray-500 text-sm mb-1">PAY PER 1K VIEWS</div>
                  <div className="text-xl font-semibold">{project.payPerView}</div>
                </div>

                <div>
                  <div className="text-gray-500 text-sm mb-1">MAX PAYOUT PER VIDEO</div>
                  <div className="text-xl font-semibold">{project.maxPayout}</div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="text-gray-500 text-sm mb-2">Payment Token</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">USDC</span>
                    <span className="text-green-400">✓ Verified</span>
                  </div>
                </div>
              </div>
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
