'use client'
import React from 'react'
import { Star } from './icons'

type Review = { author:string; rating:number|null; text:string; time:string|null }
type Payload = { rating:number|null; total:number|null; mapsUrl:string|null; reviews:Review[] }

export default function GoogleReviews() {
  const [data, setData] = React.useState<Payload | null>(null)

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      const res = await fetch('/api/reviews', { cache: 'no-store' })
      const json = await res.json()
      if (alive) setData(json)
    })()
    return () => { alive = false }
  }, [])

  if (!data) return <div className="h-40 animate-pulse rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800" />

  const { rating, total, mapsUrl, reviews } = data
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-neutral-800 px-4 py-2 ring-1 ring-neutral-200 dark:ring-neutral-700">
          <div className="flex items-center gap-1 text-red-500"><Star/><Star/><Star/><Star/></div>
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">{typeof rating==='number' ? rating.toFixed(1) : '—'} / 5</span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">{total ?? '—'} avis Google</span>
        </div>
        {mapsUrl && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline">Voir sur Google →</a>}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch [grid-auto-rows:1fr]">
        {reviews.slice(0,3).map((r, i) => (
          <article key={i} className="h-full rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm flex flex-col">
            <header className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center ring-1 ring-neutral-200 dark:ring-neutral-600 text-neutral-600 dark:text-neutral-300">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 9a7 7 0 0 1 14 0Z" fill="currentColor"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{r.author}</p>
                <div className="flex items-center gap-1 text-red-500">
                  {Array.from({ length: Math.round(r.rating ?? 0) }).map((_, k) => <Star key={k}/>)}
                </div>
              </div>
            </header>
            <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300" style={{ display:'-webkit-box', WebkitLineClamp:6, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
              "{r.text}"
            </p>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{r.time ?? ''}</p>
          </article>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400">Avis fournis par Google (3 derniers, mis à jour automatiquement).</p>
    </div>
  )
}
