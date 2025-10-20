import NavigationBar from '@/components/GryppBar';
import PrizePoolBanner from '@/components/PricePoolBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white via-50% to-white">
      <PrizePoolBanner />
      <div className='px-8 py-2'>
        <NavigationBar />
      </div>
    </div>
  );
}
