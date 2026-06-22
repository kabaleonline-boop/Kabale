'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, alt }: { images: string[], alt: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const displayImages = images.length > 0 ? images : ['/placeholder.png'];

  return (
    <>
      {/* Main Image View */}
      <div 
        className="relative aspect-square w-full bg-slate-50 md:rounded-[2rem] overflow-hidden cursor-pointer group border-b md:border-none border-slate-100"
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={displayImages[0]} 
          alt={alt} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-900 font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm transition-opacity text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            Tap to expand
          </span>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col">
          <div className="flex justify-between items-center p-4 sm:p-6 absolute top-0 left-0 right-0 z-10">
            <span className="text-white/50 font-bold text-sm tracking-widest uppercase">Gallery</span>
            <button onClick={() => setIsOpen(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          {/* Scrollable Gallery Container */}
          <div className="flex-1 overflow-x-auto flex snap-x snap-mandatory hide-scrollbar items-center">
            {displayImages.map((img, idx) => (
              <div key={idx} className="w-full shrink-0 h-full flex items-center justify-center snap-center p-4">
                <div className="relative w-full max-w-4xl max-h-[80vh] aspect-square sm:aspect-auto sm:h-[80vh]">
                  <Image src={img} alt={`${alt} - ${idx + 1}`} fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
          
          {displayImages.length > 1 && (
            <div className="text-center text-white/50 text-sm pb-8 font-medium">
              Swipe to see more ({displayImages.length} images)
            </div>
          )}
        </div>
      )}
    </>
  );
}
