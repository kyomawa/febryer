'use client'
import React from 'react'

export default function TariffCard({
  name,
  price,
  features = [],
  popular = false,
  onSelect,
}: {
  name: string
  price: string
  features?: string[]
  popular?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full h-full flex flex-col text-left rounded-2xl p-6 shadow-sm border transition
        ${popular ? 'border-red-300 dark:border-red-700 bg-white dark:bg-neutral-800 relative ring-1 ring-red-100 dark:ring-red-800' : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white shadow-sm">
          Meilleur choix
        </span>
      )}
        <div className="h-24 flex flex-col justify-end">
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">{name}</h3>
          <p className={`mt-2 text-3xl font-bold ${popular ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-neutral-100'}`}>{price}</p>
        </div>
      <ul className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-red-500 dark:text-red-400" aria-hidden>
              <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4Z"/>
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-sm font-medium text-white w-full rounded-md p-2 transition-colors">
        Choisir <span aria-hidden>→</span>
      </div>
    </button>
  )
}
