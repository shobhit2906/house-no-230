'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  X,
  Table,
  Phone,
  MessageSquare,
  QrCode as QrIcon,
  Sparkles,
  UtensilsCrossed,
  Info,
} from 'lucide-react';
import { CategoryWithCount, MenuItemData } from '@/types';
import QrCodeGenerator from './QrCodeGenerator';
import { buildWhatsAppLink } from '@/lib/whatsapp';

interface QrMenuClientProps {
  categories: CategoryWithCount[];
  items: MenuItemData[];
  restaurantName: string;
  phone: string;
}

export default function QrMenuClient({
  categories,
  items,
  restaurantName,
  phone,
}: QrMenuClientProps) {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | 'VEGETARIAN' | 'NON_VEGETARIAN'>('ALL');
  const [showQrModal, setShowQrModal] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category?.slug !== selectedCategory) {
        return false;
      }
      // Dietary match
      if (dietaryFilter === 'VEGETARIAN' && item.dietaryType !== 'VEGETARIAN') {
        return false;
      }
      if (dietaryFilter === 'NON_VEGETARIAN' && item.dietaryType !== 'NON_VEGETARIAN') {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const catMatch = (item.category?.name || '').toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }
      return true;
    });
  }, [items, selectedCategory, dietaryFilter, searchQuery]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, { name: string; items: MenuItemData[] }>();
    filteredItems.forEach((item) => {
      const cId = item.category?.id || 'other';
      const cName = item.category?.name || 'General';
      if (!map.has(cId)) {
        map.set(cId, { name: cName, items: [] });
      }
      map.get(cId)!.items.push(item);
    });
    return Array.from(map.entries());
  }, [filteredItems]);

  const whatsAppUrl = buildWhatsAppLink({
    phone,
    type: 'general',
  });

  return (
    <div className="space-y-6">
      {/* Table Badge Header */}
      <div className="bg-gradient-to-r from-card-dark via-charcoal to-card-dark border border-gold/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <UtensilsCrossed className="w-4 h-4 text-gold" />
            <span className="font-serif text-base font-bold text-warm-ivory tracking-wider">
              {restaurantName.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            {tableParam ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-gold text-deep-black font-mono font-bold uppercase tracking-wider">
                <Table className="w-3 h-3" />
                <span>Table {tableParam}</span>
              </span>
            ) : (
              <span className="text-secondary-gray">Dine-In Digital Table Menu</span>
            )}
            <span className="text-secondary-gray">&bull; Kerwa Dam Road, Bhopal</span>
          </div>
        </div>

        <button
          onClick={() => setShowQrModal(true)}
          className="self-end sm:self-auto px-3 py-1.5 bg-deep-black border border-border-dark hover:border-gold text-xs text-gold font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <QrIcon className="w-3.5 h-3.5" />
          <span>Print / Save QR Stand</span>
        </button>
      </div>

      {/* Search and Dietary Filter Bar */}
      <div className="space-y-3 sticky top-[60px] z-20 bg-deep-black/95 backdrop-blur-md pt-2 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search dishes or ingredients..."
            className="w-full bg-card-dark border border-border-dark pl-9 pr-8 py-2.5 text-xs text-warm-ivory focus:border-gold focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary-gray hover:text-warm-ivory"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills & Dietary Switcher */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex items-center space-x-1.5 flex-nowrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gold text-deep-black font-bold'
                  : 'bg-card-dark border border-border-dark text-secondary-gray hover:text-warm-ivory'
              }`}
            >
              All ({items.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.slug
                    ? 'bg-gold text-deep-black font-bold'
                    : 'bg-card-dark border border-border-dark text-secondary-gray hover:text-warm-ivory'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Dietary toggle */}
          <div className="flex items-center space-x-1 border border-border-dark bg-card-dark p-0.5 flex-shrink-0">
            <button
              onClick={() => setDietaryFilter('ALL')}
              className={`px-2 py-1 text-[10px] uppercase font-bold ${
                dietaryFilter === 'ALL' ? 'bg-gold text-deep-black' : 'text-secondary-gray'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietaryFilter('VEGETARIAN')}
              className={`px-2 py-1 text-[10px] uppercase font-bold ${
                dietaryFilter === 'VEGETARIAN' ? 'bg-green-700 text-white' : 'text-secondary-gray'
              }`}
              title="Vegetarian only"
            >
              Veg
            </button>
            <button
              onClick={() => setDietaryFilter('NON_VEGETARIAN')}
              className={`px-2 py-1 text-[10px] uppercase font-bold ${
                dietaryFilter === 'NON_VEGETARIAN' ? 'bg-red-700 text-white' : 'text-secondary-gray'
              }`}
              title="Non-Vegetarian only"
            >
              Non-Veg
            </button>
          </div>
        </div>
      </div>

      {/* Menu Listing */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-card-dark border border-border-dark text-secondary-gray text-xs space-y-2">
          <p className="text-warm-ivory font-medium">No dishes match your filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setDietaryFilter('ALL');
            }}
            className="text-gold underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([catId, g]) => (
            <div key={catId} className="space-y-3">
              <div className="border-b border-border-dark pb-2 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-warm-ivory">{g.name}</h3>
                <span className="text-[11px] text-secondary-gray font-mono">
                  {g.items.length} {g.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="bg-card-dark border border-border-dark divide-y divide-border-dark/60">
                {g.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 flex items-start justify-between gap-3 hover:bg-deep-black/30 transition-colors"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center space-x-2">
                        {item.dietaryType === 'VEGETARIAN' && (
                          <span
                            className="inline-flex items-center justify-center w-3.5 h-3.5 border border-green-600 p-0.5 rounded-sm flex-shrink-0"
                            title="Vegetarian"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          </span>
                        )}
                        {item.dietaryType === 'NON_VEGETARIAN' && (
                          <span
                            className="inline-flex items-center justify-center w-3.5 h-3.5 border border-red-600 p-0.5 rounded-sm flex-shrink-0"
                            title="Non-Vegetarian"
                          >
                            <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-600"></span>
                          </span>
                        )}
                        <h4 className="text-sm font-semibold text-warm-ivory">{item.name}</h4>
                        {item.isFeatured && (
                          <span className="inline-flex items-center space-x-1 text-[9px] uppercase tracking-wider bg-gold/15 text-gold border border-gold/30 px-1.5 py-0.2">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Special</span>
                          </span>
                        )}
                      </div>

                      {(item.description || item.notes) && (
                        <p className="text-xs text-secondary-gray leading-relaxed pl-5 line-clamp-2">
                          {item.description || item.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      {item.price !== null ? (
                        <span className="font-serif text-gold font-bold text-sm sm:text-base">
                          ₹{item.price}
                        </span>
                      ) : (
                        <span className="text-secondary-gray text-[10px] uppercase tracking-wider block">
                          Enquire
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attendant Notice & Action Strip */}
      <div className="p-4 bg-card-dark border border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-gray">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-gold flex-shrink-0" />
          <span>
            Please place your orders directly with your table attendant. Prices are subject to applicable taxes.
          </span>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="px-3 py-1.5 bg-deep-black border border-border-dark hover:border-gold text-warm-ivory text-xs font-semibold flex items-center space-x-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-gold" />
            <span>Call Server</span>
          </a>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* QR Code Stand Generator Modal */}
      {showQrModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-deep-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-card-dark border border-border-dark max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end pb-2">
              <button
                onClick={() => setShowQrModal(false)}
                className="text-secondary-gray hover:text-warm-ivory"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <QrCodeGenerator />
          </div>
        </div>
      )}
    </div>
  );
}
