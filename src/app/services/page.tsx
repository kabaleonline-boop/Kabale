'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { 
  Wrench, Phone, MessageSquare, Clock, MapPin, 
  ShieldCheck, Loader2, Search, Filter 
} from 'lucide-react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  name?: string;
  title?: string;
  category: string;
  description: string;
  price: number;
  priceType?: 'fixed' | 'starting' | 'per_hour';
  coverImage?: string;
  images?: string[];
  location?: string;
  duration?: string;
  phone: string;
  whatsappNumber?: string;
  sellerId: string;
  sellerName?: string;
  createdAt?: any;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Tech & Repairs',
    'Salon & Beauty',
    'Cleaning & Laundry',
    'Catering & Bakes',
    'Electrical & Plumbing',
    'Photography & Video',
    'Transport & Logistics',
    'Other Services',
  ];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'products'),
          where('type', '==', 'service')
        );

        const snap = await getDocs(q);
        const fetchedServices = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ServiceItem[];

        // Sort locally by creation date (newest first)
        fetchedServices.sort((a, b) => {
          const tA = a.createdAt?.seconds || 0;
          const tB = b.createdAt?.seconds || 0;
          return tB - tA;
        });

        setServices(fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatUGX = (val: number) => 'UGX ' + Number(val || 0).toLocaleString('en-UG');

  const formatPriceType = (type?: string) => {
    switch (type) {
      case 'starting':
        return 'Starting from';
      case 'per_hour':
        return 'Per Hour';
      default:
        return 'Fixed Price';
    }
  };

  const handleWhatsApp = (service: ServiceItem) => {
    const num = service.whatsappNumber || service.phone;
    const cleanNum = num.replace(/[^0-9]/g, '');
    const title = service.title || service.name || 'Service';
    const message = encodeURIComponent(
      `Hello ${service.sellerName || 'there'}, I found your service "${title}" on Kabale Online and would like to make an inquiry/booking.`
    );
    window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank');
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const title = (service.title || service.name || '').toLowerCase();
    const desc = (service.description || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || title.includes(q) || desc.includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#0b79bf] text-white py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            <Wrench className="h-4 w-4" /> Local Skills & Bookings
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Services in Kabale</h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Connect directly with skilled technicians, professionals, and service providers across Kabale town and the Kigezi region.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6">

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. laptop repair, salon, catering)..."
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium shadow-sm focus:outline-none focus:border-[#0b79bf] transition"
            />
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-[#0b79bf] text-white border-[#0b79bf] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Feed (Full Edge-to-Edge Cards) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin mb-2 text-[#0b79bf]" />
            <p className="text-xs font-bold">Loading available services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
            <Wrench className="h-12 w-12 text-gray-300 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-gray-900">No services found</h3>
              <p className="text-xs text-gray-500 mt-1">Try clearing your search or category filter.</p>
            </div>
            <Link
              href="/vendor/products/new"
              className="inline-block bg-[#0b79bf] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              List Your Service First
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredServices.map((service) => {
              const displayImage = service.coverImage || service.images?.[0];
              const displayTitle = service.title || service.name || 'Service Listing';

              return (
                <div 
                  key={service.id} 
                  className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition hover:shadow-md"
                >
                  {/* Full Width Cover Banner */}
                  <div className="relative w-full h-52 sm:h-64 md:h-72 bg-gray-100 overflow-hidden">
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt={displayTitle} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-sm">
                        No Banner Provided
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {service.category}
                    </span>

                    {/* Price Overlay */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-gray-100 px-3.5 py-1.5 rounded-xl shadow-md text-right">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
                        {formatPriceType(service.priceType)}
                      </span>
                      <span className="text-base sm:text-lg font-black text-[#0b79bf]">
                        {formatUGX(service.price)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4">
                    
                    {/* Provider Info & Location */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 text-[#0b79bf] rounded-lg">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-800">
                          {service.sellerName || 'Verified Provider'}
                        </span>
                      </div>

                      {service.location && (
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" /> {service.location}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight mb-2">
                        {displayTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {service.description}
                      </p>
                    </div>

                    {/* Duration Badge */}
                    {service.duration && (
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-blue-50/60 border border-blue-100 p-2.5 rounded-xl w-max">
                        <Clock className="h-4 w-4 text-[#0b79bf]" />
                        <span>Estimated Duration: {service.duration}</span>
                      </div>
                    )}

                    {/* Edge-to-Edge Booking Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => handleWhatsApp(service)}
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition"
                      >
                        <MessageSquare className="h-4 w-4 fill-white" /> WhatsApp
                      </button>

                      <a 
                        href={`tel:${service.phone}`}
                        className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition"
                      >
                        <Phone className="h-4 w-4" /> Call Now
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
