'use client';

import React from 'react';
import { Search, X, LayoutGrid, List, Printer, Sparkles } from 'lucide-react';
import { CategoryWithCount } from '@/types';

interface MenuFiltersProps {
  categories: CategoryWithCount[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  featuredOnly: boolean;
  onToggleFeatured: () => void;
  viewMode: 'grid' | 'compact';
  onToggleViewMode: (mode: 'grid' | 'compact') => void;
  totalFilteredCount: number;
}

export default function MenuFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  featuredOnly,
  onToggleFeatured,
  viewMode,
  onToggleViewMode,
  totalFilteredCount,
}: MenuFiltersProps) {
  const hasActiveFilters = selectedCategory !== 'all' || searchQuery.length > 0 || featuredOnly;

  const handleClearFilters = () => {
    onSelectCategory('all');
    onSearchChange('');
    if (featuredOnly) onToggleFeatured();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 no-print">
      {/* Top Bar: Search + View Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dishes, flavours, or ingredients..."
            className="w-full bg-card-dark border border-border-dark pl-10 pr-10 py-2.5 text-sm text-warm-ivory placeholder-secondary-gray focus:border-gold focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-gray hover:text-warm-ivory"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View toggles & Print */}
        <div className="flex items-center space-x-2">
          {/* Featured items toggle */}
          <button
            onClick={onToggleFeatured}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 text-xs uppercase tracking-wider font-medium border transition-colors ${
              featuredOnly
                ? 'bg-gold/20 border-gold text-gold'
                : 'bg-card-dark border-border-dark text-warm-ivory/80 hover:border-gold/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured</span>
          </button>

          {/* Grid vs Compact toggle */}
          <div className="flex items-center border border-border-dark bg-card-dark">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-gold/20 text-gold' : 'text-secondary-gray hover:text-warm-ivory'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('compact')}
              className={`p-2 transition-colors ${
                viewMode === 'compact' ? 'bg-gold/20 text-gold' : 'text-secondary-gray hover:text-warm-ivory'
              }`}
              title="Compact List View"
              aria-label="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Print Menu */}
          <button
            onClick={handlePrint}
            className="p-2 border border-border-dark bg-card-dark text-secondary-gray hover:text-gold hover:border-gold/40 transition-colors"
            title="Print Menu"
            aria-label="Print Menu"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills / Horizontal Scrolling Bar */}
      <div className="border-b border-border-dark pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border-dark">
          <button
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-gold text-deep-black font-semibold'
                : 'bg-card-dark border border-border-dark text-warm-ivory/80 hover:text-warm-ivory hover:border-gold/30'
            }`}
          >
            All Categories
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`whitespace-nowrap px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
                  isSelected
                    ? 'bg-gold text-deep-black font-semibold'
                    : 'bg-card-dark border border-border-dark text-warm-ivory/80 hover:text-warm-ivory hover:border-gold/30'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Summary & Clear Action */}
      <div className="flex items-center justify-between text-xs text-secondary-gray">
        <span>
          Showing <strong className="text-warm-ivory">{totalFilteredCount}</strong> {totalFilteredCount === 1 ? 'dish' : 'dishes'}
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-gold hover:underline flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
