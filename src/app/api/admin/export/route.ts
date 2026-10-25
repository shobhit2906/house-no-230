import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';

    const categories = await prisma.menuCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (format === 'csv') {
      const headers = ['Category', 'Item Name', 'Slug', 'Price (INR)', 'Dietary Type', 'Is Available', 'Is Featured', 'Notes'];
      const rows = [headers.join(',')];

      for (const cat of categories) {
        for (const item of cat.items) {
          const row = [
            `"${cat.name.replace(/"/g, '""')}"`,
            `"${item.name.replace(/"/g, '""')}"`,
            `"${item.slug}"`,
            item.price !== null ? item.price : '',
            item.dietaryType,
            item.isAvailable ? 'Yes' : 'No',
            item.isFeatured ? 'Yes' : 'No',
            `"${(item.notes || '').replace(/"/g, '""')}"`,
          ];
          rows.push(row.join(','));
        }
      }

      const csvContent = rows.join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="house-no-230-menu.csv"',
        },
      });
    }

    return NextResponse.json({
      exportDate: new Date().toISOString(),
      restaurant: 'House No. 230',
      categories,
    });
  } catch (error) {
    console.error('Menu export error:', error);
    return NextResponse.json({ error: 'Failed to export menu data' }, { status: 500 });
  }
}
