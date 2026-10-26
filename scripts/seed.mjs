import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding House No. 230 database with business details & expansion models...');

  // 1. Seed Verified Business Details & Settings
  const initialDailyHours = JSON.stringify({
    monday: { lunch: '12:30 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM', open: true },
    tuesday: { lunch: '12:30 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM', open: true },
    wednesday: { lunch: '12:30 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM', open: true },
    thursday: { lunch: '12:30 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM', open: true },
    friday: { lunch: '12:30 PM – 03:30 PM', dinner: '07:00 PM – 11:30 PM', open: true },
    saturday: { lunch: '12:30 PM – 04:00 PM', dinner: '07:00 PM – 12:00 AM', open: true },
    sunday: { lunch: '12:30 PM – 04:00 PM', dinner: '07:00 PM – 12:00 AM', open: true },
  });

  await prisma.siteSettings.upsert({
    where: { id: 'global' },
    update: {}, // Preserve existing owner modifications across routine deployments
    create: {
      id: 'global',
      restaurantName: 'House No. 230 - The Gourmet Kitchen & Bar',
      tagline: 'The Gourmet Kitchen & Bar',
      announcementActive: false,
      announcementText: 'Welcome to House No. 230 Bhopal. Reservations and private event bookings now open.',
      phone: '+91 89898 88988',
      secondaryPhone: '+91 91312 45032',
      secondaryPhoneVerified: false,
      email: 'contact@houseno230.com',
      whatsappNumber: '+91 89898 88988',
      address: '230, Kerwa Dam Road, opposite Bull Mother Farm, near N.L.I.U., National Law Institute University, Bhopal, Madhya Pradesh 462044, India.',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=House+No+230+The+Gourmet+Kitchen+Bar+Bhopal',
      districtUrl: 'https://www.district.in/dining/bhopal/house-no-230-the-gourmet-kitchen-mendori',
      linktreeUrl: 'https://linktr.ee/Houseno230',
      openingHours: 'Mon – Fri: 12:30 PM – 11:30 PM | Sat – Sun: 12:30 PM – Midnight',
      openingHoursJson: initialDailyHours,
      reservationLeadHours: 2,
      maxPartySize: 30,
      reservationPolicies: 'Reserved tables are held for 15 minutes past scheduled time.',
      eventPolicies: 'Celebrations require advance notice for custom setups.',
      aboutStory: 'Located along Kerwa Dam Road in Bhopal near N.L.I.U., House No. 230 — The Gourmet Kitchen & Bar blends scenic tranquility with refined multicuisine dining and vibrant bar hospitality.',
    },
  });
  console.log('Site settings initialized/preserved.');

  // 2. Provision Initial Administrator (Without changing existing admin password)
  const existingAdmin = await prisma.adminUser.findFirst();
  if (!existingAdmin) {
    const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@houseno230.com';
    const isProd = process.env.NODE_ENV === 'production';
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

    if (isProd && !adminPassword) {
      throw new Error(
        'FATAL: ADMIN_INITIAL_PASSWORD must be provided via environment variables for initial production provisioning.'
      );
    }

    const finalPassword = adminPassword || 'Admin@House230'; // development/local fallback only
    const passwordHash = await bcrypt.hash(finalPassword, 12);

    const admin = await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: 'Restaurant Admin',
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log(`Initial administrator provisioned: ${admin.email}`);
  } else {
    console.log(`Existing administrator preserved (${existingAdmin.email}); no credential changes made.`);
  }

  // 3. Seed Loyalty Rewards (Configurable by Owner)
  const rewards = [
    { title: "Chef's Artisanal Dessert", pointsRequired: 100, description: 'Complimentary choice of Hot Sizzling Brownie or Chef Special' },
    { title: 'Gourmet Platter On The House', pointsRequired: 250, description: 'Choice of Kebab Platter, Veg Platter, or Chinese Platter' },
    { title: 'Exclusive Chef Tasting for Two', pointsRequired: 500, description: 'Curated 4-course bespoke dinner experience with welcome coolers' },
  ];

  for (const reward of rewards) {
    const existing = await prisma.loyaltyReward.findFirst({ where: { title: reward.title } });
    if (!existing) {
      await prisma.loyaltyReward.create({ data: reward });
    }
  }
  console.log('Loyalty rewards initialized.');

  // 4. Load Menu Data (145 dishes across 17 categories)
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
          price: null,
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
