// @vitest-environment node
import { describe, it, expect } from 'vitest';
import prisma from '@/lib/prisma';

describe('Database Persistence & Menu Inventory', () => {
  it('has seeded all categories', async () => {
    const categories = await prisma.menuCategory.findMany();
    expect(categories.length).toBeGreaterThanOrEqual(16);

    const salads = categories.find((c) => c.slug === 'salads');
    expect(salads).toBeDefined();

    const platters = categories.find((c) => c.slug === 'platters-starters-specialties');
    expect(platters).toBeDefined();
  });

  it('contains signature featured dishes', async () => {
    const featuredItems = await prisma.menuItem.findMany({
      where: { isFeatured: true },
    });

    const names = featuredItems.map((i) => i.name);
    expect(names).toContain('Crispy Corn');
    expect(names).toContain('Kebab Platter');
    expect(names).toContain('Veg Platter');
    expect(names).toContain('Paneer Tikka');
    expect(names).toContain('Hakka Noodles');
    expect(names).toContain('Chinese Sizzler');
    expect(names).toContain('Jhol Momos');
    expect(names).toContain('Hot Sizzling Brownie');
  });

  it('deduplicates dishes properly without duplicate records', async () => {
    const crispyCornCount = await prisma.menuItem.count({
      where: { name: 'Crispy Corn' },
    });
    expect(crispyCornCount).toBe(1);

    const hakkaNoodlesCount = await prisma.menuItem.count({
      where: { name: 'Hakka Noodles' },
    });
    expect(hakkaNoodlesCount).toBe(1);
  });

  it('creates and retrieves a reservation request with unique reference', async () => {
    const ref = `HN230-TEST${Math.floor(Math.random() * 10000)}`;

    const reservation = await prisma.reservation.create({
      data: {
        reference: ref,
        customerName: 'Rohit Verma',
        phone: '9811223344',
        email: 'rohit@example.com',
        reservationDate: '2030-05-20',
        reservationTime: '20:00',
        guestCount: 4,
        specialRequest: 'Corner booth',
        status: 'PENDING',
      },
    });

    expect(reservation.id).toBeDefined();
    expect(reservation.reference).toBe(ref);
    expect(reservation.status).toBe('PENDING');

    // Update status to CONFIRMED
    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'CONFIRMED',
        internalNotes: 'Table 7 reserved. Confirmed via phone.',
      },
    });

    expect(updated.status).toBe('CONFIRMED');
    expect(updated.internalNotes).toContain('Table 7');

    // Clean up test reservation
    await prisma.reservation.delete({ where: { id: reservation.id } });
  });
});
