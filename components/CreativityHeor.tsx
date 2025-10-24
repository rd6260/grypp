export default function CreativityHero() {
  return (
    <div className="w-full py-8">
      <div className="w-full rounded-3xl shadow-sm py-12 px-8 text-center" style={{ backgroundColor: '#0B0B0B' }}>
        <h1 className="text-7xl font-serif mb-3 leading-tight text-white">
          Your creativity,
          <br />
          turned into earnings
        </h1>
        
        <div className="flex items-center justify-center gap-4 mt-6 mb-4">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            EXPLORE BOUNTIES
          </button>
          
          <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
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
