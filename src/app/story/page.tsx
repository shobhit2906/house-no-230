import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, UtensilsCrossed, Wine, HeartHandshake, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Our Story & Culinary Ethos',
  description:
    'Discover the hospitality ethos and dining philosophy behind House No. 230 — The Gourmet Kitchen & Bar.',
};

export default async function StoryPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });

  return (
    <div className="py-12 sm:py-20 space-y-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
            Our Philosophy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-warm-ivory leading-tight">
            The Ethos of House No. 230
          </h1>
          <p className="text-sm sm:text-base text-secondary-gray leading-relaxed">
            Where thoughtful hospitality, distinct culinary flavors, and refined architecture converge.
          </p>
        </div>

        {/* Feature Image */}
        <div className="relative aspect-[16/9] bg-card-dark border border-border-dark overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1400&auto=format&fit=crop"
            alt="Interior dining atmosphere of House No. 230"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover"
          />
        </div>

        {/* Editorial Content */}
        <div className="prose prose-invert max-w-3xl mx-auto text-secondary-gray space-y-6 text-sm sm:text-base leading-relaxed">
          <p className="text-warm-ivory text-lg sm:text-xl font-serif leading-relaxed italic border-l-2 border-gold pl-6 my-8">
            &ldquo;We created House No. 230 with a clear aspiration: to craft a dining destination where quality food, handcrafted beverages, and comfortable luxury coexist harmoniously.&rdquo;
          </p>

          <p>
            {settings?.aboutStory ||
              'House No. 230 — The Gourmet Kitchen & Bar brings together contemporary culinary artistry and classic hospitality. Offering curated multicuisine dishes, artisanal beverages, and a refined social ambiance designed for memorable gatherings.'}
          </p>

          <p>
            Our kitchen draws inspiration from diverse traditions — from rich North Indian gravies and fragrant dum biryanis to wok-tossed oriental specialties, stone-baked pizzas, and artisanal sizzlers. Each recipe is executed with fresh produce, authentic spices, and meticulous attention to balance and presentation.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border-dark">
          <div className="p-6 bg-card-dark border border-border-dark space-y-3">
            <UtensilsCrossed className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-lg font-bold text-warm-ivory">Honest Ingredients</h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              We source uncompromised fresh ingredients and authentic whole spices, avoiding artificial shortcuts to let genuine culinary flavor speak for itself.
            </p>
          </div>

          <div className="p-6 bg-card-dark border border-border-dark space-y-3">
            <Wine className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-lg font-bold text-warm-ivory">Artisanal Sips</h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Our beverage repertoire pairs refreshing handcrafted coolers and mocktails with a curated selection of international brews and bar specialties.
            </p>
          </div>

          <div className="p-6 bg-card-dark border border-border-dark space-y-3">
            <HeartHandshake className="w-6 h-6 text-gold" />
            <h3 className="font-serif text-lg font-bold text-warm-ivory">Attentive Hospitality</h3>
            <p className="text-xs text-secondary-gray leading-relaxed">
              Every guest is welcomed into an ambiance engineered for comfort, whether joining us for a lively family gathering or a relaxed evening drink.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-10">
          <Link
            href="/reservations"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gold hover:bg-gold-light text-deep-black text-xs uppercase tracking-widest font-bold transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Reserve a Table With Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
