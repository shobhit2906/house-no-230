import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';
import { logAuditEvent } from '@/lib/audit';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.categories)) {
      return NextResponse.json(
        { error: 'Invalid payload structure. Expected an object with a "categories" array.' },
        { status: 400 }
      );
    }

    let importedCategories = 0;
    let importedItems = 0;

    for (const cat of body.categories) {
      if (!cat.name || !cat.slug) continue;

      const category = await prisma.menuCategory.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          description: cat.description || null,
          displayOrder: cat.displayOrder || 0,
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description || null,
          displayOrder: cat.displayOrder || 0,
          isPublished: true,
        },
      });
      importedCategories++;

      if (Array.isArray(cat.items)) {
        for (let i = 0; i < cat.items.length; i++) {
          const item = cat.items[i];
          if (!item.name) continue;

          const itemSlug = item.slug || `${cat.slug}-${slugify(item.name)}`;

          await prisma.menuItem.upsert({
            where: { slug: itemSlug },
            update: {
              name: item.name,
              categoryId: category.id,
              description: item.description || item.notes || null,
              price: typeof item.price === 'number' ? item.price : null,
              currency: item.currency || 'INR',
              isAvailable: item.isAvailable !== undefined ? Boolean(item.isAvailable) : true,
              isFeatured: item.isFeatured !== undefined ? Boolean(item.isFeatured) : false,
              dietaryType: item.dietaryType || 'UNSPECIFIED',
              displayOrder: item.displayOrder || i + 1,
              notes: item.notes || null,
            },
            create: {
              categoryId: category.id,
              name: item.name,
              slug: itemSlug,
              description: item.description || item.notes || null,
              price: typeof item.price === 'number' ? item.price : null,
              currency: item.currency || 'INR',
              isAvailable: item.isAvailable !== undefined ? Boolean(item.isAvailable) : true,
              isFeatured: item.isFeatured !== undefined ? Boolean(item.isFeatured) : false,
              dietaryType: item.dietaryType || 'UNSPECIFIED',
              displayOrder: item.displayOrder || i + 1,
              notes: item.notes || null,
            },
          });
          importedItems++;
        }
      }
    }

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'MENU_DATA_IMPORT',
      entityType: 'MenuSystem',
      details: { categoriesCount: importedCategories, itemsCount: importedItems },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedCategories} categories and ${importedItems} items.`,
    });
  } catch (error) {
    console.error('Menu import error:', error);
    return NextResponse.json({ error: 'Failed to process imported menu data.' }, { status: 500 });
  }
}
