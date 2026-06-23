'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function StoreOwnerBanner({ storeSlug, ownerId }: { storeSlug: string, ownerId: string }) {
  const { profile } = useAuth();
  
  const isOwner = profile && (
    (profile as any).storeSlug === storeSlug || profile.uid === ownerId
  );

  if (!isOwner) return null;

  return (
    <div className="bg-slate-100 py-4 px-4 border-b border-slate-200 flex flex-col items-center justify-center gap-2 text-center">
      <span className="font-bold text-slate-800 text-sm">Welcome to your public storefront.</span>
      <Link 
        href="/seller/dashboard" 
        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold transition text-xs shadow-sm"
      >
        Go to Dashboard
      </Link>
      <span className="text-slate-500 text-xs font-medium mt-1">
        (This banner is only visible to you because you own this store)
      </span>
    </div>
  );
}