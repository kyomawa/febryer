'use client'
import React from 'react'
import useSWR from 'swr'

export type PackId = string
export type SizeId = string

export type Quote = {
  pack: PackId
  size: SizeId
  items: { id: string; name: string; price: number }[]
  subtotal: number
  multiplier: number
  total: number
}

type Service = { id: string; name: string; price: number; group: string }
type GroupedServices = Record<string, Service[]>
type Pack = { id: string; slug: string; name: string; desc?: string | null; items: string[] }
type Size = { id: SizeId; label: string; mult: number }

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json())

// 👉 ordre UI unique
// Configuration et ordre d'affichage des éléments UI
const PACK_ORDER: PackId[] = ['essentiel', 'confort', 'pro']

export default function PricingBuilder({
  initialPack,
  onQuoteChange,
}: {
  initialPack?: PackId
  onQuoteChange?: (q: Quote | null) => void
}) {
  // --- data ---
  const { data: servicesRes } = useSWR<{ groups: GroupedServices }>('/api/catalog/services', fetcher)
  const { data: packsRes }     = useSWR<{ packs: Pack[] }>('/api/catalog/packs', fetcher)
  const { data: sizesRes }     = useSWR<{ sizes: Size[] }>('/api/catalog/sizes', fetcher)

  const grouped: GroupedServices = servicesRes?.groups ?? {}
  const packs: Pack[] = packsRes?.packs ?? []
  const sizes: Size[] = sizesRes?.sizes ?? []

  const packsOrdered = React.useMemo(() => {
    const rank = (slug: string) => {
      const i = PACK_ORDER.indexOf(slug)
      return i === -1 ? 999 : i
    }
    return [...packs].sort((a,b) => rank(a.slug) - rank(b.slug))
  }, [packs])

  // Tailles par défaut si configuration vide
  const safeSizes = React.useMemo<Size[]>(
    () => sizes.length ? sizes : [
      { id: 'city',    label: 'Citadine',         mult: 1 },
      { id: 'berline', label: 'Berline/Compacte', mult: 1.1 },
      { id: 'suv',     label: 'SUV/Monospace',    mult: 1.2 },
      { id: 'van',     label: 'Utilitaire/VAN',   mult: 1.3 },
    ],
    [sizes]
  )

  const allServices: Service[] = React.useMemo(
    () => Object.values(grouped).flat(),
    [grouped]
  )

  const defaultPack = React.useMemo<Pack | undefined>(() => {
    if (!packsOrdered.length) return undefined
    if (initialPack) {
      const bySlug = packsOrdered.find(p => p.slug === initialPack || p.id === initialPack)
      if (bySlug) return bySlug
    }
    return packsOrdered[0]
  }, [packsOrdered, initialPack])

  // --- state ---
  const [activePack, setActivePack] = React.useState<PackId | undefined>(defaultPack?.slug)
  const [selected, setSelected]     = React.useState<Set<string>>(new Set(defaultPack?.items ?? []))
  const [size, setSize]             = React.useState<SizeId>(safeSizes[0]?.id ?? 'city')

  // Resync une seule fois par slug (évite boucles si SWR revalide)
  const syncedSlugRef = React.useRef<string | undefined>(undefined)
  React.useEffect(() => {
    if (!defaultPack?.slug) return
    if (syncedSlugRef.current === defaultPack.slug) return
    syncedSlugRef.current = defaultPack.slug
    setActivePack(defaultPack.slug)
    setSelected(new Set(defaultPack.items))
  }, [defaultPack?.slug, defaultPack?.items])

  const multiplier = React.useMemo(
    () => safeSizes.find(s => s.id === size)?.mult ?? 1,
    [size, safeSizes]
  )
  const subtotal = React.useMemo(
    () => [...selected].reduce((sum, id) => {
      const s = allServices.find(x => x.id === id)
      return sum + (s?.price ?? 0)
    }, 0),
    [selected, allServices]
  )
  const total = React.useMemo(() => Math.round(subtotal * multiplier), [subtotal, multiplier])

  const applyPack = (slugOrId: string) => {
    const p = packsOrdered.find(x => x.slug === slugOrId || x.id === slugOrId)
    if (!p) return
    setActivePack(p.slug)
    setSelected(new Set(p.items))
    syncedSlugRef.current = p.slug // on note la sync manuelle
  }

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Remonter le devis uniquement si ça change réellement
  const quote = React.useMemo<Quote | null>(() => {
    // Attendre que les données soient chargées
    if (allServices.length === 0) return null
    
    // Utiliser activePack ou defaultPack par défaut
    const packSlug = activePack ?? defaultPack?.slug
    if (!packSlug) return null
    
    const items = [...selected].map(id => {
      const s = allServices.find(x => x.id === id)
      if (!s) {
        console.warn(`Service with id "${id}" not found in allServices`)
        return null
      }
      return { id: s.id, name: s.name, price: s.price }
    }).filter((item): item is { id: string; name: string; price: number } => item !== null)
    
    return {
      pack: packSlug as PackId,
      size,
      items,
      subtotal,
      multiplier,
      total,
    }
  }, [activePack, defaultPack?.slug, size, selected, subtotal, multiplier, total, allServices])

  const lastQuoteRef = React.useRef<string>('')
  React.useEffect(() => {
    if (!onQuoteChange) return
    const s = JSON.stringify(quote)
    if (s === lastQuoteRef.current) return
    lastQuoteRef.current = s
    onQuoteChange(quote)
  }, [onQuoteChange, quote])

  const groupOrder = React.useMemo(() => Object.keys(grouped), [grouped])

  return (
    <div className="space-y-6">
      {/* Section principale avec 2 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale : Packs + Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Packs */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Forfaits</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {packsOrdered.map(p => {
                const active = activePack === p.slug
                return (
                  <button
                    key={p.slug}
                    onClick={() => applyPack(p.slug)}
                    className={[
                      'rounded-full transition outline-none px-4 py-2 text-sm font-medium',
                      active 
                        ? 'bg-red-500 text-white shadow-sm' 
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                    ].join(' ')}
                    title={p.desc ?? ''}
                  >
                    {p.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Services */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
            <div className="space-y-6">
              {groupOrder.map(group => (
                <div key={group}>
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{group}</h4>
                    <div className="h-px bg-neutral-200 dark:bg-neutral-700 flex-1" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(grouped[group] ?? []).map(item => (
                      <ServiceChip
                        key={item.id}
                        title={item.name}
                        price={item.price}
                        selected={selected.has(item.id)}
                        onToggle={() => toggle(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite : Tailles + Total */}
        <div className="space-y-6">
          {/* Taille du véhicule */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Taille du véhicule</h3>
            <div className="space-y-2">
              {safeSizes.map(s => {
                const active = size === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    className={[
                      'w-full rounded-lg transition outline-none p-3 text-left',
                      active 
                        ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 shadow-sm' 
                        : 'bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-transparent'
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{s.label}</span>
                      <span className="text-sm opacity-75">×{s.mult}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Total */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-700 p-4 ring-1 ring-neutral-100 dark:ring-neutral-600">
              <Line label="Sous-total" value={`${subtotal}€`} />
              <Line label={`Multiplicateur (${safeSizes.find(s=>s.id===size)?.label ?? ''})`} value={`× ${multiplier}`} />
              <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-600 flex items-center justify-between text-base font-bold">
                <span className="text-neutral-900 dark:text-neutral-100">Total estimé</span>
                <span className="text-red-600 dark:text-red-400">{total}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* UI chip simple et propre */
function ServiceChip({
  title, price, selected, onToggle
}: { title: string; price: number; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`group flex items-center justify-between rounded-lg border p-3 text-left transition
        ${selected
          ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/50 ring-1 ring-red-100 dark:ring-red-800'
          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
        }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full flex-shrink-0 ${selected ? 'bg-red-500 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 group-hover:text-red-500 dark:group-hover:text-red-400'}`}>
          <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4Z"/></svg>
        </span>
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{title}</span>
      </div>
      <span className={`text-sm font-semibold ${selected ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-neutral-100'}`}>{price}€</span>
    </button>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-700 dark:text-neutral-300">{label}</span>
      <span className="font-medium text-neutral-900 dark:text-neutral-100">{value}</span>
    </div>
  )
}
