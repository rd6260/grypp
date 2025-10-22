import CreativityHero from '@/components/CreativityHeor';
import NavigationBar from '@/components/GryppBar';
import PrizePoolBanner from '@/components/PricePoolBanner';
import BountyCard from '@/components/BountyCard';
import ActiveBounties from '@/components/ActiveBounties';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black via-50% to-black">
      <PrizePoolBanner />
      <div className='px-8 py-2'>
        <NavigationBar />
        <CreativityHero />
      </div>
      <ActiveBounties/>
    </div>
  );
}
