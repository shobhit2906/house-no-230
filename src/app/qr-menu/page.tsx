import React, { Suspense } from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import QrMenuClient from '@/components/menu/QrMenuClient';
import { CategoryWithCount, MenuItemData } from '@/types';

export const metadata: Metadata = {
  title: 'Digital Table Menu — Scan & Browse',
  description:
    'Mobile-first contactless digital menu for guests dining at House No. 230 — The Gourmet Kitchen & Bar, Bhopal.',
};

export const revalidate = 60;

async function getQrMenuData() {
  const [categories, items, settings] = await Promise.all([
    prisma.menuCategory.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: { select: { items: true } },
      },
    }),
    prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    }),
    prisma.siteSettings.findUnique({
      where: { id: 'global' },
      select: {
        restaurantName: true,
        phone: true,
        whatsappNumber: true,
      },
    }),
  ]);

  return {
    categories: categories as unknown as CategoryWithCount[],
    items: items as unknown as MenuItemData[],
    settings,
  };
}

export default async function QrMenuPage() {
  const { categories, items, settings } = await getQrMenuData();

  return (
    <div className="py-6 sm:py-10 bg-deep-black min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-6">
        <Suspense
          fallback={
            <div className="text-center py-20 text-gold animate-pulse text-sm">
              Loading Digital Table Menu...
            </div>
          }
        >
          <QrMenuClient
            categories={categories}
            items={items}
            restaurantName={settings?.restaurantName || 'House No. 230'}
            phone={settings?.phone || '+91 89898 88988'}
          />
        </Suspense>
      </div>
    </div>
  );
}
