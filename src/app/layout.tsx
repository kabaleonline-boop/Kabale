// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/ui/AuthModal';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// 🚨 GLOBAL PRODUCTION SEO METADATA
export const metadata: Metadata = {
  // Sets the base domain so relative image paths work in WhatsApp/Twitter previews
  metadataBase: new URL('https://kabaleonline.com'),
  
  title: {
    default: 'Kabale Online | Digital Mall',
    // Automatically appends your brand to sub-pages (e.g., "Sneakers | Kabale Online")
    template: '%s | Kabale Online',
  },
  description: 'Kabale Online is the premier e-commerce marketplace in the Kigezi Region. Shop a wide selection of products from trusted local stores with fast delivery, secure checkout, and cash on delivery.',
  keywords: ['Kabale', 'Online Shopping', 'E-commerce', 'Kigezi', 'Uganda', 'Delivery', 'Buy Local', 'Digital Mall', 'Marketplace'],
  authors: [{ name: 'Kabale Online' }],
  openGraph: {
    type: 'website',
    locale: 'en_UG',
    url: 'https://kabaleonline.com',
    siteName: 'Kabale Online',
    title: 'Kabale Online | Digital Mall',
    description: 'The premier e-commerce marketplace in the Kigezi Region. Shop trusted local stores with fast delivery and secure checkout.',
    // Make sure to add an 'og-banner.jpg' (1200x630) to your /public folder!
    images: [
      {
        url: '/og-banner.jpg', 
        width: 1200,
        height: 630,
        alt: 'Kabale Online Shopping Mall',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kabale Online | Digital Mall',
    description: 'The premier e-commerce marketplace in the Kigezi Region. Shop trusted local stores with fast delivery and secure checkout.',
    images: ['/og-banner.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 dynamic-rendering-viewport`}>
        <AuthProvider>
          <CartProvider>
            {/* The new wrapper UI */}
            <Header />
            <AuthModal />
            
            {/* Page Content wrapped in a flex-grow container to push footer to the bottom */}
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}