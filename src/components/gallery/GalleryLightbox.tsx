'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

interface GalleryLightboxProps {
  items: GalleryItem[];
}

export default function GalleryLightbox({ items }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = ['all', 'Ambience', 'Culinary Art', 'Bar & Sips'];

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter((item) => item.category === activeFilter);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems.length]);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center justify-center space-x-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              activeFilter === cat
                ? 'bg-gold text-deep-black font-semibold'
                : 'bg-card-dark border border-border-dark text-warm-ivory/80 hover:text-warm-ivory hover:border-gold/40'
            }`}
          >
            {cat === 'all' ? 'All Gallery' : cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-[4/3] bg-card-dark border border-border-dark overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
            tabIndex={0}
            role="button"
            aria-label={`View photo: ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedIndex(index);
              }
            }}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-deep-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                {item.category}
              </span>
              <h3 className="font-serif text-lg font-bold text-warm-ivory mt-1">
                {item.title}
              </h3>
              <p className="text-xs text-secondary-gray line-clamp-1 mt-0.5">
                {item.description}
              </p>
              <div className="mt-2 flex items-center space-x-1 text-gold text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Enlarge</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && filteredItems[selectedIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={filteredItems[selectedIndex].title}
          className="fixed inset-0 z-50 bg-deep-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 p-2 text-warm-ivory/80 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold z-10"
            aria-label="Close photo preview"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(
                (selectedIndex - 1 + filteredItems.length) % filteredItems.length
              );
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 bg-card-dark/80 text-warm-ivory hover:text-gold border border-border-dark hover:border-gold/50 rounded-full focus:outline-none z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((selectedIndex + 1) % filteredItems.length);
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 bg-card-dark/80 text-warm-ivory hover:text-gold border border-border-dark hover:border-gold/50 rounded-full focus:outline-none z-10"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Content container */}
          <div
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[60vh] max-h-[500px]">
              <Image
                src={filteredItems[selectedIndex].imageUrl}
                alt={filteredItems[selectedIndex].title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-contain"
              />
            </div>
            <div className="text-center mt-4 space-y-1 px-4">
              <span className="text-[11px] uppercase tracking-widest text-gold">
                {filteredItems[selectedIndex].category} &bull; Photo {selectedIndex + 1} of{' '}
                {filteredItems.length}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-warm-ivory">
                {filteredItems[selectedIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-secondary-gray max-w-xl mx-auto">
                {filteredItems[selectedIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
