import React from 'react';
import { Metadata } from 'next';
import GalleryLightbox, { GalleryItem } from '@/components/gallery/GalleryLightbox';
import { Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ambience & Culinary Gallery — House No. 230',
  description:
    'Browse the photography gallery of House No. 230 — The Gourmet Kitchen & Bar, featuring our dining spaces, signature gourmet dishes, and bar artistry.',
};

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Gourmet Tandoori & Kebab Platter',
    category: 'Culinary Art',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    description: 'Freshly roasted paneer and vegetable kebabs seasoned with authentic ground whole spices.',
  },
  {
    id: '2',
    title: 'Warm Social Ambience',
    category: 'Ambience',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    description: 'Sophisticated architectural lighting and comfortable seating designed for memorable social gatherings.',
  },
  {
    id: '3',
    title: 'Handcrafted Mojito & Mixology',
    category: 'Bar & Sips',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop',
    description: 'Refreshing muddled mint, citrus botanicals, and handcrafted artisan coolers.',
  },
  {
    id: '4',
    title: 'Artisanal Stone-Baked Pizza',
    category: 'Culinary Art',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
    description: 'Thin crust gourmet pizza topped with fresh garden bell peppers, sweet corn, and mozzarella.',
  },
  {
    id: '5',
    title: 'Private Dining & Booth Seating',
    category: 'Ambience',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    description: 'Intimate dining arrangements suited for both private dinner dates and celebratory family reunions.',
  },
  {
    id: '6',
    title: 'Hot Sizzling Brownie with Vanilla Cream',
    category: 'Culinary Art',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop',
    description: 'Cast-iron sizzled warm chocolate brownie topped with chocolate fudge and vanilla scoop.',
  },
  {
    id: '7',
    title: 'Curated Brews & International Bottles',
    category: 'Bar & Sips',
    imageUrl: 'https://images.unsplash.com/photo-1608270199042-32a8ba7e704b?q=80&w=1200&auto=format&fit=crop',
    description: 'Chilled premium lagers and selected international bar labels.',
  },
  {
    id: '8',
    title: 'Wok-Tossed Hakka Noodles & Sizzler',
    category: 'Culinary Art',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1200&auto=format&fit=crop',
    description: 'High-heat wok tossed noodles with scallions, crisp vegetables, and Indo-Chinese spices.',
  },
  {
    id: '9',
    title: 'Bar Counter & Evening Illumination',
    category: 'Ambience',
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop',
    description: 'Backlit champagne gold accents and brass textures framing our central bar counter.',
  },
];

export default function GalleryPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Visual Story
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-warm-ivory">
            Ambience & Culinary Gallery
          </h1>
          <p className="text-sm sm:text-base text-secondary-gray leading-relaxed">
            Take a visual tour through our warm dining hall, crafted dishes, and vibrant bar atmosphere. Click any photograph to open the interactive lightbox.
          </p>
        </div>

        {/* Gallery Lightbox */}
        <GalleryLightbox items={galleryItems} />

        {/* Photography Notice */}
        <div className="p-4 bg-card-dark border border-border-dark flex items-start space-x-3 text-xs text-secondary-gray max-w-2xl mx-auto">
          <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-warm-ivory">Asset Note:</strong> Representative high-resolution imagery shown reflects our culinary style and ambience. Official restaurant photography can be managed and updated directly by staff via the administration dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
