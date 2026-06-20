// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import AuthModal from '@/components/ui/AuthModal';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kabale Online V2 | Digital Mall',
  description: 'Fast, trusted, mobile-first marketplace in Kigezi Region.',
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
            
            {/* Page Content */}
            {children}
            
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
