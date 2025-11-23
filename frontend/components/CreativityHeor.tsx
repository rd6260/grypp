export default function CreativityHero() {
  return (
    <div className="w-full py-8">
      <div className="w-full rounded-3xl shadow-sm py-12 px-8 text-center" style={{ backgroundColor: '#0B0B0B' }}>
        <h1 className="text-7xl mb-3 leading-none text-white">
          Your creativity,
          <br />
          turned into earnings
        </h1>
        
        <div className="flex items-center justify-center gap-4 mt-6 mb-4">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            EXPLORE BOUNTIES
          </button>
          
          <button className="px-6 py-3 bg-[#ff7a66] text-white font-medium rounded-lg hover:bg-[#ff8c7a] transition-all shadow-[0_0_20px_rgba(255,122,102,0.5)] hover:shadow-[0_0_30px_rgba(255,122,102,0.7)] flex items-center justify-center gap-2">
            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </span>
            HOW IT WORKS
          </button>
        </div>
        
        <p className="text-sm text-gray-400 tracking-wide">
          OVER $20,000 DISTRIBUTED TO CREATORS AND CLIPPERS
        </p>
      </div>
    </div>
  );
}
