export default function CreativityHero() {
  return (
    <div className="w-full py-8 px-6">
      <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-600 py-12 px-8 text-center">
        <h1 className="text-7xl font-serif mb-3 leading-tight">
          Your creativity,
          <br />
          turned into earnings
        </h1>
        
        <div className="flex items-center justify-center gap-4 mt-6 mb-4">
          <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
            EXPLORE BOUNTIES
          </button>
          
          <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </span>
            HOW IT WORKS
          </button>
        </div>
        
        <p className="text-sm text-gray-600 tracking-wide">
          OVER $20,000 DISTRIBUTED TO CREATORS AND CLIPPERS
        </p>
      </div>
    </div>
  );
}
