import React from 'react';
import { Check, Star } from './icons';

type ServiceCardProps = {
  title: string
  desc: string
  time: string
  price: string
  featured?: boolean
}

export function ServiceCard({ title, desc, time, price, featured }: ServiceCardProps){
  return (
    <div className={`rounded-2xl border ${featured ? 'border-red-200 dark:border-red-800 bg-white dark:bg-neutral-900' : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'} p-6 shadow-sm relative`}>
      {featured && (
        <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white shadow-sm">Populaire</span>
      )}
      <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 ring-1 ring-inset ring-neutral-200 dark:ring-neutral-700">{time}</span>
        <span className={`text-base font-semibold ${featured ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-white'}`}>{price}</span>
      </div>
    </div>
  );
}

type PriceCardProps = {
  name: string
  price: string
  features?: string[]
  popular?: boolean
  cta?: string
}

export function PriceCard({ name, price, features = [], popular = false, cta = 'Choisir' }: PriceCardProps){
  return (
    <div className={`rounded-2xl p-6 shadow-sm border ${popular ? 'border-red-300 dark:border-red-700 bg-white dark:bg-neutral-900 relative ring-1 ring-red-100 dark:ring-red-900/20' : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'}`}>
      {popular && (
        <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white shadow-sm">Meilleur choix</span>
      )}
      <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">{name}</h3>
      <p className={`mt-2 text-3xl font-bold ${popular ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-white'}`}>{price}</p>
      <ul className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2"><Check/> <span>{f}</span></li>
        ))}
      </ul>
      <button className={`mt-6 w-full rounded-xl px-4 py-2.5 font-medium transition ${popular ? 'bg-red-500 text-white hover:bg-red-600' : 'border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}>{cta}</button>
    </div>
  );
}
