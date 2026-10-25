import React from 'react';
import { MenuItemData } from '@/types';
import { Sparkles } from 'lucide-react';

interface MenuCardProps {
  item: MenuItemData;
  compact?: boolean;
}

export default function MenuCard({ item, compact = false }: MenuCardProps) {
  // Format dietary badge
  const renderDietaryBadge = () => {
    if (item.dietaryType === 'VEGETARIAN') {
      return (
        <span
          className="inline-flex items-center justify-center w-4 h-4 border border-green-600 p-0.5 rounded-sm"
          title="Vegetarian"
        >
          <span className="w-2 h-2 rounded-full bg-green-600"></span>
        </span>
      );
    }
    if (item.dietaryType === 'NON_VEGETARIAN') {
      return (
        <span
          className="inline-flex items-center justify-center w-4 h-4 border border-red-600 p-0.5 rounded-sm"
          title="Non-Vegetarian"
        >
          <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-red-600"></span>
        </span>
      );
    }
    return null;
  };

  // Honest price formatting
  const renderPrice = () => {
    if (item.price !== null && typeof item.price === 'number') {
      return (
        <span className="font-serif text-gold font-semibold text-base sm:text-lg">
          ₹{item.price.toFixed(0)}
        </span>
      );
    }
    return (
      <span className="text-secondary-gray text-xs uppercase tracking-wider font-medium">
        Price on enquiry
      </span>
    );
  };

  if (compact) {
    return (
      <div className="py-3 px-4 border-b border-border-dark flex items-center justify-between hover:bg-card-dark/40 transition-colors menu-print-item">
        <div className="flex items-center space-x-3 pr-4">
          {renderDietaryBadge()}
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-warm-ivory">{item.name}</h4>
              {item.isFeatured && (
                <span className="text-[10px] bg-gold/20 text-gold border border-gold/40 px-1.5 py-0.2 rounded-full">
                  Featured
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-secondary-gray line-clamp-1 mt-0.5">{item.description}</p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">{renderPrice()}</div>
      </div>
    );
  }

  return (
    <article
      className="group relative bg-card-dark/60 border border-border-dark hover:border-gold/40 transition-all duration-300 p-5 flex flex-col justify-between rounded-none shadow-sm hover:shadow-md menu-print-item"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2">
            {renderDietaryBadge()}
            <h3 className="font-serif text-base sm:text-lg font-semibold text-warm-ivory group-hover:text-gold transition-colors">
              {item.name}
            </h3>
          </div>
          {item.isFeatured && (
            <span className="flex-shrink-0 inline-flex items-center space-x-1 text-[10px] uppercase tracking-wider bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 font-medium">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Special</span>
            </span>
          )}
        </div>

        {item.category && (
          <span className="text-[11px] uppercase tracking-wider text-secondary-gray mt-1 block">
            {item.category.name}
          </span>
        )}

        {(item.description || item.notes) && (
          <p className="text-xs text-warm-ivory/70 mt-2.5 leading-relaxed line-clamp-2">
            {item.description || item.notes}
          </p>
        )}
      </div>

      <div className="pt-4 mt-3 border-t border-border-dark/60 flex items-center justify-between">
        {renderPrice()}
        {!item.isAvailable && (
          <span className="text-[10px] text-red-400 uppercase tracking-widest font-semibold bg-red-950/40 px-2 py-0.5 border border-red-800/40">
            Currently Unavailable
          </span>
        )}
      </div>
    </article>
  );
}
