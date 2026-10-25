import React, { Suspense } from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import MenuExplorer from '@/components/menu/MenuExplorer';
import { CategoryWithCount, MenuItemData } from '@/types';

export const metadata: Metadata = {
  title: 'Full Menu — Artisanal Dishes, Platters & Bar',
  description:
    'Explore the complete dining and bar menu of House No. 230 — The Gourmet Kitchen & Bar. Discover stone-baked pizzas, royal paneer dishes, Chinese sizzlers, salads, desserts, and signature drinks.',
};

export const revalidate = 60;

async function getMenuData() {
  const [categories, items] = await Promise.all([
    prisma.menuCategory.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    }),
    prisma.menuItem.findMany({
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  return {
    categories: categories as unknown as CategoryWithCount[],
    items: items as unknown as MenuItemData[],
  };
}

export default async function MenuPage() {
  const { categories, items } = await getMenuData();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Gastronomic Inventory
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-warm-ivory">
            The Complete Menu
          </h1>
          <p className="text-sm sm:text-base text-secondary-gray leading-relaxed">
            Crafted with thoughtful care, our kitchen presents an expansive selection of traditional recipes, sizzling comfort dishes, and refined multicuisine creations.
          </p>
        </div>

        {/* Interactive Explorer with Suspense */}
        <Suspense
          fallback={
            <div className="text-center py-20 text-gold animate-pulse text-sm">
              Loading Gourmet Selections...
            </div>
          }
        >
          <MenuExplorer categories={categories} initialItems={items} />
        </Suspense>
      </div>
    </div>
  );
}
