import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const searchQuery = searchParams.get('q')?.trim();
    const featuredOnly = searchParams.get('featured') === 'true';

    // Fetch categories with published state
    const categories = await prisma.menuCategory.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        displayOrder: true,
      },
    });

    // Build MenuItem where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemWhere: any = {
      isAvailable: true,
      category: {
        isPublished: true,
      },
    };

    if (categorySlug && categorySlug !== 'all') {
      itemWhere.category = {
        ...itemWhere.category,
        slug: categorySlug,
      };
    }

    if (featuredOnly) {
      itemWhere.isFeatured = true;
    }

    if (searchQuery) {
      itemWhere.OR = [
        { name: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { notes: { contains: searchQuery } },
      ];
    }

    const items = await prisma.menuItem.findMany({
      where: itemWhere,
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      categories,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve menu data' },
      { status: 500 }
    );
  }
}
