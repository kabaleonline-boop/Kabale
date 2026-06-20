// src/app/s/[store_slug]/p/[product_slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/services/productService';
import { getStoreConfig } from '@/services/storeService';
import AddToCartButton from '@/components/storefront/AddToCartButton';

interface PageProps {
  params: { store_slug: string; product_slug: string };
}

// 1. DYNAMIC METADATA GENERATOR (The WhatsApp Magic)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.store_slug, params.product_slug);
  const store = await getStoreConfig(params.store_slug);

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
      url: `https://kabaleonline.com/s/${params.store_slug}/p/${params.product_slug}`,
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

// 2. THE PAGE UI
export default async function ProductDetailsPage({ params }: PageProps) {
  // Fetch data concurrently for speed
  const [product, store] = await Promise.all([
    getProductBySlug(params.store_slug, params.product_slug),
    getStoreConfig(params.store_slug)
  ]);

  if (!product || !store) {
    notFound();
  }

  const { theme, storeName } = store;

  return (
    <div className="min-h-screen bg-slate-50 pb-24" style={{ fontFamily: theme.fontFamily }}>
      
      {/* Micro-Header for easy navigation back to the store */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={`/s/${params.store_slug}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold text-sm">Back to {storeName}</span>
          </Link>
          
          <Link href={`/checkout/${params.store_slug}`} className="relative p-2 text-slate-800">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto md:px-4 md:py-6">
        <div className="bg-white md:rounded-3xl md:shadow-sm md:border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Gallery */}
          <div className="relative aspect-square w-full bg-slate-100 border-b md:border-b-0 md:border-r border-slate-200">
            <Image 
              src={product.images[0] || '/placeholder.png'} 
              alt={product.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="p-6 flex flex-col">
            <div className="mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {product.storeCategory}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="text-3xl font-black mb-6" style={{ color: theme.primaryColor }}>
              UGX {product.price.toLocaleString()}
            </div>

            <div className="prose prose-sm text-slate-600 mb-8 flex-1">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Action Area */}
            <div className="mt-auto space-y-3 pt-6 border-t border-slate-100">
              <AddToCartButton 
                product={product} 
                storeSlug={params.store_slug} 
                accentColor={theme.accentColor} 
              />
              
              <Link 
                href={`/checkout/${params.store_slug}`}
                className="block w-full text-center bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl shadow-sm hover:bg-slate-800 transition"
              >
                Go to Checkout
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
