// src/app/page.tsx
import HeroSection from '@/components/HeroSection';
import OfficialStorePromo from '@/components/OfficialStorePromo';
import CategoriesList from '@/components/CategoriesList';
import ValuePropsGrid from '@/components/ValuePropsGrid';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeroSection />
      <OfficialStorePromo />
      <CategoriesList />
      <ValuePropsGrid />
    </div>
  );
}
