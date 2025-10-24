import CreativityHero from '@/components/CreativityHeor';
import NavigationBar from '@/components/GryppBar';
import PrizePoolBanner from '@/components/PricePoolBanner';
import BountyCard from '@/components/BountyCard';
import ActiveBounties from '@/components/ActiveBounties';

export default function Home() {

  return (
    <div className="min-h-screen">
      <PrizePoolBanner />
      <div className='px-8 py-2'>
        <NavigationBar />
        <CreativityHero />
      </div>
      <ActiveBounties/>
    </div>
  );
}
