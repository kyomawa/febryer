import Image from "next/image";

import { Gallery } from "../components/gallery";
import { ContactForm } from "../components/contact-form";

import { Star, Clock, Calendar, Pin, Shield, IconX, IconIG, IconFB } from "../components/icons";
import { ServiceCard } from "@/components/card"
import { Testimonial } from "@/components/testimonial"
import { Step } from "@/components/step"
import {  FeatureRow } from "@/components/feature"
import { Social } from "@/components/social"
import TariffsSection from "@/components/tarrif-section"
import { Tariff, Photo } from '@prisma/client';
import GoogleReviews from "@/components/google-reviews";

async function getTariffs(): Promise<Tariff[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tariffs`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch tariffs');
  }
  return res.json();
}

async function getPhotos(context: string): Promise<Photo[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/photos?context=${context}`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`Failed to fetch photos for context: ${context}`);
    }
    return res.json();
}

export default async function FeBryerLanding() {
  const tariffs = await getTariffs().catch(() => []);
  const heroPhotos = await getPhotos('hero').catch(() => []);
  const galleryPhotos = await getPhotos('gallery').catch(() => []);
  // Photo par défaut si aucune n'existe
  const heroPhoto = heroPhotos[0] || {
    url: '/images/placeholder.jpg',
    altText: 'Default hero image'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900"/>
          <svg className="absolute -top-24 -right-24 h-[480px] w-[480px] opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path fill="#ef4444" d="M42.6,-44.2C56.7,-28.6,69.2,-14.3,69.7,-0.3C70.2,13.8,58.8,27.7,44.7,41.2C30.7,54.7,15.3,67.8,0.1,67.7C-15.1,67.6,-30.2,54.2,-44.4,40.8C-58.6,27.3,-72,13.6,-73.8,-1.1C-75.7,-15.8,-66,-31.5,-52.4,-47C-38.9,-62.5,-21.5,-77.8,-5.1,-73.5C11.3,-69.2,22.6,-45,42.6,-44.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-950/30 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-100 dark:ring-red-900/30">Réservation en ligne • Devis gratuit</span>
              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white">
                Brillez sur la route avec <span className="text-red-600 dark:text-red-400">Fé Bryer</span>
              </h1>
              <p className="mt-4 text-neutral-600 dark:text-neutral-300 max-w-xl">Intérieur & extérieur, rénovation, protection céramique. Nous venons à vous avec du matériel pro, éco-responsable et ultra-efficace.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#tarifs" className="inline-flex items-center rounded-xl bg-red-500 px-5 py-3 text-white font-medium shadow-sm hover:bg-red-600 transition">Réserver maintenant</a>
                <a href="#contact" className="inline-flex items-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-5 py-3 font-medium text-neutral-900 dark:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition">Devis gratuit</a>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2"><Star/> 4,9/5 par 200+ clients</div>
                <div className="flex items-center gap-2"><Clock/> Interventions 7j/7</div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-neutral-100 dark:ring-neutral-800">
                {heroPhoto && <img src={heroPhoto.url} alt={heroPhoto.alt || 'Hero image'} className="h-full w-full object-cover"/>}
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-neutral-100 dark:ring-neutral-700 p-4 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white font-bold">FB</span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">Séchage sans traces</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Microfibres premium & air pulsé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages (liste compacte, pas de cards répétées) */}
      <section id="avantages" className="py-20 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Pourquoi nous choisir</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300">Qualité, commodité et transparence — le tout sans compromis.</p>
          </div>

          <div className="mt-10 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
              <FeatureRow
                icon={<div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/30"><Star/></div>}
                title="4,9/5 sur 200+ avis"
                desc="Finitions soignées, suivi après-prestation et satisfaction garantie."
              />
              <FeatureRow
                icon={<div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/30"><Clock/></div>}
                title="Interventions 7j/7"
                desc="Créneaux tôt le matin ou en soirée, on s'adapte à votre emploi du temps."
              />
              <FeatureRow
                icon={<div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/30"><Pin/></div>}
                title="On vient à vous"
                desc="À domicile ou au bureau, matériel autonome (eau/électricité non requis)."
              />
              <FeatureRow
                icon={<div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/30"><Shield/></div>}
                title="Produits sûrs"
                desc="Éco-responsables, microfibres haut de gamme, respect des surfaces."
              />
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20 bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Comment ça marche</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300">Simple, rapide et flexible — on s'adapte à votre emploi du temps.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Step icon={<Calendar/>} title="Choisissez un créneau" text="Réservation en ligne en 60 secondes."/>
            <Step icon={<Pin/>} title="On vient à vous" text="À domicile ou sur votre lieu de travail."/>
            <Step icon={<Shield/>} title="Qualité garantie" text="Satisfaction ou on revient gratuitement."/>
          </div>
        </div>
      </section>

      {/* Tarifs + À la carte */}
      <section id="tarifs" className="py-20 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Nos prestations</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300">Réservez votre pack ou composez votre prestation sur mesure. Paiement sécurisé en ligne ou sur place.</p>
          </div>

          <TariffsSection tariffs={tariffs} />

          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">* Supplément possible selon l'état et la taille du véhicule.</p>
        </div>
      </section>

      {/* Avis */}
      <section id="avis" className="py-20 bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Ils nous recommandent</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300">Extraits d'avis Google (actualisés automatiquement).</p>
          </div>
          <div className="mt-10">
            <GoogleReviews />
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section id="galerie" className="py-20 bg-neutral-50 dark:bg-neutral-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Gallery photos={galleryPhotos} />
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
