// src/app/page.tsx
import HeroSection from '@/components/HeroSection';
import OfficialStorePromo from '@/components/OfficialStorePromo';
import CategoriesList from '@/components/CategoriesList';
import ShopByStore from '@/components/ShopByStore'; // 🚨 Import the new component
import ValuePropsGrid from '@/components/ValuePropsGrid';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeroSection />
      <OfficialStorePromo />
      <CategoriesList />
      <ShopByStore /> {/* 🚨 Add it right here */}
      <ValuePropsGrid />
    </div>
  );
}
