'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MenuFilters from './MenuFilters';
import MenuCard from './MenuCard';
import { CategoryWithCount, MenuItemData } from '@/types';
import { Utensils, AlertCircle } from 'lucide-react';

interface MenuExplorerProps {
  categories: CategoryWithCount[];
  initialItems: MenuItemData[];
}

export default function MenuExplorer({ categories, initialItems }: MenuExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get('category') || 'all';
  const urlQuery = searchParams.get('q') || '';
  const urlFeatured = searchParams.get('featured') === 'true';

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery);
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(urlFeatured);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Sync state with URL query parameters for shareable URLs
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (featuredOnly) {
      params.set('featured', 'true');
    }

    const newQueryString = params.toString();
    const targetUrl = newQueryString ? `/menu?${newQueryString}` : '/menu';
    router.replace(targetUrl, { scroll: false });
  }, [selectedCategory, searchQuery, featuredOnly, router]);

  // Client-side filtering for instantaneous responsiveness
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // Category match
      if (selectedCategory !== 'all') {
        const itemCatSlug = item.category?.slug;
        if (itemCatSlug !== selectedCategory) {
          return false;
        }
      }

      // Featured match
      if (featuredOnly && !item.isFeatured) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = item.name.toLowerCase().includes(query);
        const descMatch = (item.description || '').toLowerCase().includes(query);
        const notesMatch = (item.notes || '').toLowerCase().includes(query);
        const catMatch = (item.category?.name || '').toLowerCase().includes(query);
        if (!nameMatch && !descMatch && !notesMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [initialItems, selectedCategory, featuredOnly, searchQuery]);

  // Group items by category for structured reading
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, { categoryName: string; description: string | null; items: MenuItemData[] }>();

    filteredItems.forEach((item) => {
      const catKey = item.category?.id || 'other';
      const catName = item.category?.name || 'General Selection';
      const catDesc = item.category ? categories.find((c) => c.id === item.category?.id)?.description || null : null;

      if (!map.has(catKey)) {
        map.set(catKey, {
          categoryName: catName,
          description: catDesc,
          items: [],
        });
      }
      map.get(catKey)!.items.push(item);
    });

    return Array.from(map.entries());
  }, [filteredItems, categories]);

  return (
    <div className="space-y-10">
      {/* Filters & Navigation Controls */}
      <MenuFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        featuredOnly={featuredOnly}
        onToggleFeatured={() => setFeaturedOnly(!featuredOnly)}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        totalFilteredCount={filteredItems.length}
      />

      {/* Menu Listing */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 px-4 bg-card-dark border border-border-dark space-y-4">
          <Utensils className="w-12 h-12 text-gold/40 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-warm-ivory">No Matching Dishes Found</h3>
          <p className="text-sm text-secondary-gray max-w-md mx-auto">
            We couldn&apos;t find any menu items matching your search or active filters. Try searching for a different term or clearing your selection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setFeaturedOnly(false);
            }}
            className="px-5 py-2.5 bg-gold text-deep-black text-xs uppercase tracking-widest font-bold hover:bg-gold-light transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {groupedByCategory.map(([catKey, group]) => (
            <section key={catKey} className="space-y-6">
              <div className="border-b border-border-dark pb-3">
                <h2 className="font-serif text-2xl font-bold text-warm-ivory flex items-center space-x-3">
                  <span>{group.categoryName}</span>
                  <span className="text-xs font-mono font-normal text-gold bg-gold/10 border border-gold/30 px-2 py-0.5">
                    {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>
                {group.description && (
                  <p className="text-xs text-secondary-gray mt-1 leading-relaxed max-w-2xl">
                    {group.description}
                  </p>
                )}
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.items.map((item) => (
                    <MenuCard key={item.id} item={item} compact={false} />
                  ))}
                </div>
              ) : (
                <div className="bg-card-dark border border-border-dark divide-y divide-border-dark/60">
                  {group.items.map((item) => (
                    <MenuCard key={item.id} item={item} compact={true} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Honest pricing note */}
      <div className="border-t border-border-dark pt-8 flex items-start space-x-3 text-xs text-secondary-gray no-print">
        <AlertCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-warm-ivory">Notice on Menu & Pricing:</strong> All items are prepared fresh to order. Disclosed prices and seasonal dish availability are subject to verification upon dining. Please inform your server of any food sensitivities or allergies before placing your order.
        </p>
      </div>
    </div>
  );
}
