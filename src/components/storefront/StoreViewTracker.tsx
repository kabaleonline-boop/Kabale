'use client';

import { useEffect } from 'react';
import { incrementStoreViews } from '@/services/storeService';

export default function StoreViewTracker({ storeSlug }: { storeSlug: string }) {
  useEffect(() => {
    if (!storeSlug) return;
    const viewKey = `viewed_store_${storeSlug}`;
    if (!sessionStorage.getItem(viewKey)) {
      incrementStoreViews(storeSlug);
      sessionStorage.setItem(viewKey, 'true');
    }
  }, [storeSlug]);

  return null; // This is purely an invisible tracking component
}