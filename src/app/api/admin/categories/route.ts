import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuthCheck';
import { MenuCategorySchema } from '@/lib/validations';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Admin categories fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = MenuCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid category data' }, { status: 400 });
    }

    const { name, slug, description, displayOrder, isPublished } = parsed.data;

    const existingSlug = await prisma.menuCategory.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 });
    }

    const category = await prisma.menuCategory.create({
      data: {
        name,
        slug,
        description: description || null,
        displayOrder,
        isPublished,
      },
    });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'CATEGORY_CREATE',
      entityType: 'MenuCategory',
      entityId: category.id,
      details: { name: category.name, slug: category.slug },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error('Admin category create error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, ...categoryData } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const parsed = MenuCategorySchema.safeParse(categoryData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || 'Invalid category data' }, { status: 400 });
    }

    const existing = await prisma.menuCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const { name, slug, description, displayOrder, isPublished } = parsed.data;

    // Check slug collision
    if (slug !== existing.slug) {
      const collision = await prisma.menuCategory.findUnique({ where: { slug } });
      if (collision) {
        return NextResponse.json({ error: 'Another category is already using this slug' }, { status: 400 });
      }
    }

    const updated = await prisma.menuCategory.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        displayOrder,
        isPublished,
      },
    });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'CATEGORY_UPDATE',
      entityType: 'MenuCategory',
      entityId: id,
      details: { name: updated.name },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error('Admin category update error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const existing = await prisma.menuCategory.findUnique({
      where: { id },
      include: { _count: { select: { items: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (existing._count.items > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category containing ${existing._count.items} dishes. Please reassign or delete items first.`,
        },
        { status: 400 }
      );
    }

    await prisma.menuCategory.delete({ where: { id } });

    await logAuditEvent({
      actorId: auth.session.userId,
      actorEmail: auth.session.email,
      action: 'CATEGORY_DELETE',
      entityType: 'MenuCategory',
      entityId: id,
      details: { name: existing.name },
    });

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Admin category delete error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
