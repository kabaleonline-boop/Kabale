import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug } from '@/services/productService';
import { getStoreConfig } from '@/services/storeService';
import ProductGallery from '@/components/storefront/ProductGallery';
import ProductActionCenter from '@/components/storefront/ProductActionCenter';
import MoreFromShop from '@/components/storefront/MoreFromShop';
import FloatingCart from '@/components/storefront/FloatingCart';

interface PageProps {
  params: { storeSlug: string; productSlug: string };
}

// DYNAMIC METADATA GENERATOR (The WhatsApp Magic)
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
          url: product.images[0] || '/placeholder.png', 
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

// THE PAGE UI (Server Component)
export default async function ProductDetailsPage({ params }: PageProps) {
  const [product, store] = await Promise.all([
    getProductBySlug(params.storeSlug, params.productSlug),
    getStoreConfig(params.storeSlug)
  ]);

  if (!product || !store) {
    notFound();
  }

  const { theme, storeName, whatsappNumber } = store;

  // Description Logic: Split by breaks. If > 1 line, convert to bullets.
  const descriptionLines = product.description.split('\n').filter(line => line.trim() !== '');
  const hasBreaks = descriptionLines.length > 1;

  // Generate WhatsApp Link payload
  let waLink = '#';
  if (whatsappNumber) {
    let cleanNum = whatsappNumber.replace(/\D/g, ''); 
    if (cleanNum.startsWith('0')) cleanNum = '256' + cleanNum.substring(1);
    else if (!cleanNum.startsWith('256')) cleanNum = '256' + cleanNum;
    
    // Auto-fill message with product details
    const textParams = encodeURIComponent(`Hi ${storeName}, I'm asking about this item:\n\n*${product.title}*\nPrice: UGX ${product.price.toLocaleString()}\n\nLink: https://kabaleonline.com/s/${params.storeSlug}/p/${params.productSlug}`);
    waLink = `https://wa.me/${cleanNum}?text=${textParams}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">

      {/* 🚨 Floating Cart integrated into the Product Detail Page too */}
      <FloatingCart storeSlug={params.storeSlug} />

      {/* Micro-Header */}
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

          {/* New Lightbox Image Gallery */}
          <ProductGallery images={product.images} alt={product.title} />

          {/* Product Info */}
          <div className="p-6 md:p-8 flex flex-col justify-center">

            <div className="mb-4">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {product.storeCategory}
              </span>
            </div>

            {/* Title is Base Color and Massive */}
            <h1 
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black mb-6 leading-[1.05] tracking-tight"
              style={{ color: theme?.primaryColor || '#0f172a' }}
            >
              {product.title}
            </h1>

            {/* Price is Highlight Color */}
            <div 
              className="text-3xl sm:text-4xl font-black mb-8 tracking-tight" 
              style={{ color: theme?.accentColor || '#10b981' }}
            >
              UGX {product.price.toLocaleString()}
            </div>

            {/* Smart Description (Bullets if linebreaks exist) */}
            <div className="prose prose-sm sm:prose-base text-slate-600 mb-10 flex-1 leading-relaxed">
              {hasBreaks ? (
                <ul className="list-disc pl-5 space-y-2 font-medium">
                  {descriptionLines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="whitespace-pre-wrap font-medium">{product.description}</p>
              )}
            </div>

            {/* Integrated Quantity + Add to Cart + WhatsApp Button */}
            <ProductActionCenter 
              product={product}
              storeSlug={params.storeSlug}
              accentColor={theme?.accentColor || '#10b981'}
              waLink={waLink}
            />

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

      {/* More from this shop */}
      <MoreFromShop 
        storeSlug={params.storeSlug} 
        currentProductId={product.id!} 
        accentColor={theme?.accentColor || '#10b981'}
      />
    </div>
  );
}