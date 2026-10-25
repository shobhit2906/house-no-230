import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Sparkles, MapPin, Clock, Phone, Utensils, Award } from 'lucide-react';
import prisma from '@/lib/prisma';
import MenuCard from '@/components/menu/MenuCard';
import { MenuItemData } from '@/types';

export const revalidate = 60; // ISR cache revalidation every minute

async function getHomePageData() {
  const [featuredItems, categories, settings] = await Promise.all([
    prisma.menuItem.findMany({
      where: {
        isFeatured: true,
        isAvailable: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      take: 8,
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.menuCategory.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: { select: { items: true } },
      },
    }),
    prisma.siteSettings.findUnique({
      where: { id: 'global' },
    }),
  ]);

  return { featuredItems, categories, settings };
}

export default async function HomePage() {
  const { featuredItems, categories, settings } = await getHomePageData();

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border-dark">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop"
            alt="House No. 230 restaurant atmosphere"
            fill
            priority
            className="object-cover object-center opacity-35 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/70 to-deep-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(16,16,15,0.85)_100%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-gold/40 bg-gold/10 text-gold text-xs uppercase tracking-[0.25em] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Gourmet Kitchen & Bar</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-warm-ivory leading-[1.15]">
            HOUSE NO. 230
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-warm-ivory/80 font-light leading-relaxed">
            Where culinary passion meets sophisticated ambience. Discover an elevated dining experience crafted with authentic spices, global techniques, and signature mixology.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/menu"
              className="w-full sm:w-auto px-8 py-3.5 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-gold/20 flex items-center justify-center space-x-2"
            >
              <span>Explore Our Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/reservations"
              className="w-full sm:w-auto px-8 py-3.5 border border-gold/60 text-gold hover:bg-gold/10 text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve a Table</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE DISHES (FEATURED SELECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Chef&apos;s Highlights
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warm-ivory">
            Signature Specialties
          </h2>
          <p className="text-sm text-secondary-gray">
            A curated selection of our most cherished dishes, prepared fresh to order with artisan ingredients and distinct seasonings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <MenuCard key={item.id} item={item as unknown as MenuItemData} />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-gold hover:text-gold-light border-b border-gold/40 hover:border-gold pb-1 transition-all"
          >
            <span>View Complete Menu (140+ Selections)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. RESTAURANT INTRODUCTION (OUR STORY TEASER) */}
      <section className="bg-charcoal/80 border-y border-border-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              The Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warm-ivory leading-snug">
              An Architectural Blend of Flavor, Ambience & Warmth
            </h2>
            <p className="text-sm sm:text-base text-secondary-gray leading-relaxed">
              {settings?.aboutStory ||
                'House No. 230 — The Gourmet Kitchen & Bar brings together contemporary culinary artistry and classic hospitality. Offering curated multicuisine dishes, artisanal beverages, and a refined social ambiance designed for memorable gatherings.'}
            </p>
            <p className="text-sm text-secondary-gray leading-relaxed">
              Whether you are planning an intimate dinner, celebrating a milestone, or seeking handcrafted cocktails in an elevated setting, our kitchen and bar are dedicated to providing genuine comfort and taste.
            </p>
            <div className="pt-2">
              <Link
                href="/story"
                className="inline-flex items-center space-x-2 px-6 py-3 border border-border-dark bg-card-dark text-warm-ivory hover:text-gold hover:border-gold/40 text-xs uppercase tracking-widest font-semibold transition-all"
              >
                <span>Discover Our Ethos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] bg-card-dark border border-border-dark overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
              alt="House No. 230 gourmet kitchen dining room"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. MENU PREVIEW (CATEGORY EXPLORATION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Culinary Repertoire
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warm-ivory">
            Explore By Category
          </h2>
          <p className="text-sm text-secondary-gray">
            From sizzlers and wok-tossed noodles to royal paneer delicacies, stone-baked pizzas, and craft bar sips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.slug}`}
              className="group bg-card-dark/80 border border-border-dark hover:border-gold/50 p-6 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3">
                  <span className="text-[11px] uppercase tracking-widest text-gold font-mono">
                    Category {cat.displayOrder}
                  </span>
                  <span className="text-xs text-secondary-gray">
                    {cat._count.items} dishes
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-warm-ivory group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-secondary-gray mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>
              <div className="pt-6 flex items-center space-x-1.5 text-xs text-gold font-semibold">
                <span>Browse Category</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. GALLERY PREVIEW */}
      <section className="bg-charcoal/40 border-y border-border-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                Visual Journey
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warm-ivory">
                Ambience & Culinary Craft
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs uppercase tracking-widest font-bold text-gold hover:text-gold-light flex items-center space-x-1.5"
            >
              <span>View Full Lightbox Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative aspect-[4/3] bg-card-dark border border-border-dark overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
                alt="Platters and gourmet starters"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 to-transparent flex items-end p-5">
                <span className="font-serif text-sm font-semibold text-warm-ivory">Gourmet Platters</span>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-card-dark border border-border-dark overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"
                alt="Bar cocktails and mixology"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 to-transparent flex items-end p-5">
                <span className="font-serif text-sm font-semibold text-warm-ivory">Artisanal Mixology</span>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-card-dark border border-border-dark overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop"
                alt="Dining room mood lighting"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 to-transparent flex items-end p-5">
                <span className="font-serif text-sm font-semibold text-warm-ivory">Warm Ambience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RESERVATION CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-card-dark via-charcoal to-card-dark border border-gold/40 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Table Booking
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warm-ivory max-w-xl mx-auto">
            Reserve Your Experience at House No. 230
          </h2>

          <p className="text-sm text-secondary-gray max-w-lg mx-auto">
            Submit your table reservation request online. Our team promptly reviews requests and confirms your booking details for a seamless dining experience.
          </p>

          <div className="pt-2">
            <Link
              href="/reservations"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Request a Table Online</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CONTACT PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card-dark border border-border-dark flex items-start space-x-4">
            <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="font-serif text-base font-semibold text-warm-ivory">Location</h3>
              <p className="text-xs text-secondary-gray leading-relaxed">
                {settings?.address || 'India (Official address will be updated shortly upon launch)'}
              </p>
            </div>
          </div>

          <div className="p-6 bg-card-dark border border-border-dark flex items-start space-x-4">
            <Clock className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="font-serif text-base font-semibold text-warm-ivory">Dining Hours</h3>
              <p className="text-xs text-secondary-gray leading-relaxed">
                {settings?.openingHours || 'Lunch: 12:30 PM – 3:30 PM\nDinner: 7:00 PM – 11:30 PM'}
              </p>
            </div>
          </div>

          <div className="p-6 bg-card-dark border border-border-dark flex items-start space-x-4">
            <Phone className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="font-serif text-base font-semibold text-warm-ivory">Direct Inquiries</h3>
              <p className="text-xs text-secondary-gray leading-relaxed">
                {settings?.phone || 'Direct phone reservations available once line is connected'}
              </p>
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="text-xs text-gold hover:underline block pt-1">
                  Call Restaurant
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
