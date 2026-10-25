import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding House No. 230 database...');

  // 1. Seed Site Settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      restaurantName: 'House No. 230',
      tagline: 'The Gourmet Kitchen & Bar',
      announcementActive: false,
      announcementText: 'Welcome to House No. 230. Table reservations now open for dinner service.',
      address: null, // Left null until confirmed by owner
      phone: null,
      email: 'reservations@houseno230.com',
      whatsappNumber: null,
      openingHours: null,
      googleMapsUrl: null,
      instagramUrl: null,
      facebookUrl: null,
      aboutStory: 'House No. 230 — The Gourmet Kitchen & Bar brings together contemporary culinary artistry and classic hospitality. Offering curated multicuisine dishes, artisanal beverages, and a refined social ambiance designed for memorable gatherings.',
    },
  });
  console.log('Site settings initialized.');

  // 2. Seed Administrator
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@houseno230.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@House230';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Restaurant Admin',
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log(`Administrator provisioned: ${admin.email}`);

  // 3. Load Menu Data
  const dataPath = path.join(__dirname, '../src/data/initialMenuData.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const { categories } = JSON.parse(rawData);

  let totalItems = 0;

  for (const cat of categories) {
    const category = await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        displayOrder: cat.displayOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isPublished: true,
      },
    });

    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i];
      const itemSlug = `${cat.slug}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

      await prisma.menuItem.upsert({
        where: { slug: itemSlug },
        update: {
          name: item.name,
          categoryId: category.id,
          isFeatured: item.isFeatured || false,
          notes: item.notes || null,
          displayOrder: i + 1,
        },
        create: {
          categoryId: category.id,
          name: item.name,
          slug: itemSlug,
          description: item.notes || null,
          price: null, // Honest: no fake ₹0
          currency: 'INR',
          isAvailable: true,
          isFeatured: item.isFeatured || false,
          dietaryType: 'UNSPECIFIED',
          displayOrder: i + 1,
          notes: item.notes || null,
        },
      });
      totalItems++;
    }
  }

  console.log(`Seeded ${categories.length} categories and ${totalItems} menu items.`);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
