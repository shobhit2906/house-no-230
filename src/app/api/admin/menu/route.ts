import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';
import { MenuItemSchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const searchQuery = searchParams.get('q')?.trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { notes: { contains: searchQuery } },
      ];
    }

    const items = await prisma.menuItem.findMany({
      where,
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
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Admin menu fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve menu items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = MenuItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid item data' }, { status: 400 });
    }

    const data = parsed.data;

    // Verify category exists
    const category = await prisma.menuCategory.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 400 });
    }

    let slug = `${category.slug}-${slugify(data.name)}`;
    const existing = await prisma.menuItem.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const item = await prisma.menuItem.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug,
        description: data.description || null,
        price: data.price !== undefined ? data.price : null,
        currency: data.currency || 'INR',
        imageUrl: data.imageUrl || null,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        dietaryType: data.dietaryType,
        displayOrder: data.displayOrder,
        notes: data.notes || null,
      },
      include: {
        category: true,
      },
    });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'MENU_ITEM_CREATE',
      entityType: 'MenuItem',
      entityId: item.id,
      details: { name: item.name, category: category.name },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error('Admin menu item create error:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, ...itemData } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const parsed = MenuItemSchema.safeParse(itemData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid item data' }, { status: 400 });
    }

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const data = parsed.data;
    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description || null,
        price: data.price !== undefined ? data.price : null,
        currency: data.currency,
        imageUrl: data.imageUrl || null,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        dietaryType: data.dietaryType,
        displayOrder: data.displayOrder,
        notes: data.notes || null,
      },
      include: {
        category: true,
      },
    });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'MENU_ITEM_UPDATE',
      entityType: 'MenuItem',
      entityId: id,
      details: { name: updated.name },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Admin menu update error:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    await prisma.menuItem.delete({ where: { id } });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'MENU_ITEM_DELETE',
      entityType: 'MenuItem',
      entityId: id,
      details: { name: existing.name },
    });

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Admin menu delete error:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
