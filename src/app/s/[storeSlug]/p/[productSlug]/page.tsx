// src/app/s/[storeSlug]/p/[productSlug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/services/productService';
import { getStoreConfig } from '@/services/storeService';
import AddToCartButton from '@/components/storefront/AddToCartButton';

interface PageProps {
  params: { storeSlug: string; productSlug: string };
}

// 1. DYNAMIC METADATA GENERATOR (The WhatsApp Magic)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.storeSlug, params.productSlug);
  const store = await getStoreConfig(params.storeSlug);

  if (!product || !store) {
    return { title: 'Product Not Found' };
  }

  const priceFormatted = `UGX ${product.price.toLocaleString()}`;
  const ogTitle = `${priceFormatted} - ${product.title}`;

  return {
    title: `${product.title} | ${store.storeName}`,
    description: product.description,
    openGraph: {
      title: ogTitle,
      description: `Available at ${store.storeName}. ${product.description.substring(0, 100)}...`,
      url: `https://kabaleonline.com/s/${params.storeSlug}/p/${params.productSlug}`,
      siteName: 'Kabale Online',
      images: [
        {
          url: product.images[0] || '/placeholder.png', // WhatsApp will pull this exact image
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: product.description,
      images: [product.images[0] || '/placeholder.png'],
    },
  };
}

// 2. THE PAGE UI (Server Component for maximum speed and SEO)
export default async function ProductDetailsPage({ params }: PageProps) {
  // Fetch data concurrently for maximum loading speed
  const [product, store] = await Promise.all([
    getProductBySlug(params.storeSlug, params.productSlug),
    getStoreConfig(params.storeSlug)
  ]);

  if (!product || !store) {
    notFound();
  }

  const { theme, storeName } = store;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">

      {/* Micro-Header for easy navigation back to the store */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href={`/s/${params.storeSlug}`} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm tracking-tight"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back to {storeName}
          </Link>

          <Link 
            href={`/checkout/${params.storeSlug}`} 
            className="relative p-2 text-slate-900 hover:scale-105 transition-transform bg-slate-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto md:px-6 md:py-10">
        <div className="bg-white md:rounded-[2.5rem] md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 lg:gap-12 md:p-4">

          {/* Image Gallery */}
          <div className="relative aspect-square w-full bg-slate-50 md:rounded-[2rem] overflow-hidden border-b md:border-none border-slate-100">
            <Image 
              src={product.images[0] || '/placeholder.png'} 
              alt={product.title} 
              fill 
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            
            <div className="mb-4">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {product.storeCategory}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-[1.1] tracking-tight">
              {product.title}
            </h1>

            {/* Dynamic Store Color Applied to Price */}
            <div className="text-3xl sm:text-4xl font-black mb-8 tracking-tight" style={{ color: theme?.primaryColor || '#059669' }}>
              UGX {product.price.toLocaleString()}
            </div>

            <div className="prose prose-sm sm:prose-base text-slate-500 mb-10 flex-1 leading-relaxed">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Action Area */}
            <div className="mt-auto space-y-4 pt-8 border-t border-slate-100">
              
              {/* AddToCartButton should handle the specific cart logic */}
              <AddToCartButton 
                product={product} 
                storeSlug={params.storeSlug} 
                accentColor={theme?.accentColor || '#dc2626'} 
              />

              <Link 
                href={`/checkout/${params.storeSlug}`}
                className="flex w-full items-center justify-center bg-slate-900 text-white font-bold py-5 px-6 rounded-2xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.99]"
              >
                Go to Secure Checkout
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

            </div>
            
            {/* Trust Badges */}
            <div className="mt-6 flex items-center justify-center gap-6 text-slate-400">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Verified Store
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Fast Delivery
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
