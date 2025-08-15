'use client'

import React from 'react'
import ModalCompose from './modal-compose'
import type { PackId, Quote } from './pricing-builder'
import { Tariff } from '@prisma/client'

// Ordre d'affichage des packs dans l'interface
const PACK_ORDER = ['essentiel','confort','pro']

function guessSlugFromTariff(t: Tariff): PackId {
  const slug = (t as any).packSlug as string | undefined
  if (slug) return slug as PackId
  const key = t.name.toLowerCase()
  if (key.includes('confort')) return 'confort'
  if (key.includes('pro')) return 'pro'
  return 'essentiel'
}

export default function TariffsSection({ tariffs }: { tariffs: Tariff[] }) {
  const [composeOpen, setComposeOpen] = React.useState(false)
  const [pack, setPack] = React.useState<PackId>('essentiel')
  const [loading, setLoading] = React.useState(false)

  // Écoute l'événement d'ouverture de modale depuis le header
  React.useEffect(() => {
    const handleOpenBookingModal = (event: CustomEvent) => {
      const defaultPack = event.detail?.pack || 'confort'
      setPack(defaultPack)
      setComposeOpen(true)
    }

    window.addEventListener('openBookingModal', handleOpenBookingModal as EventListener)
    
    return () => {
      window.removeEventListener('openBookingModal', handleOpenBookingModal as EventListener)
    }
  }, [])

  // Trie les cartes par ordre de priorité défini
  const orderedTariffs = React.useMemo(() => {
    const rank = (t: Tariff) => {
      const s = guessSlugFromTariff(t)
      const i = PACK_ORDER.indexOf(s)
      return i === -1 ? 999 : i
    }
    return [...tariffs].sort((a,b) => rank(a) - rank(b))
  }, [tariffs])

  const openPack = (t: Tariff) => {
    const slug = guessSlugFromTariff(t)
    setPack(slug)
    setComposeOpen(true)
  }

  async function startCheckout(quote: Quote) {
    try {
      setLoading(true)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ quote }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.url) throw new Error(data?.error || 'Création de session Stripe impossible')
      window.location.href = data.url
    } catch (e: any) {
      alert(e.message || 'Erreur lors du passage au paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {orderedTariffs.map((tariff, index) => (
          <TariffCard
            key={tariff.id || tariff.name || index}
            name={tariff.name}
            price={`${(tariff.price/100).toFixed(0)}€`}
            popular={index === 1} // la carte du milieu (Confort) = "Meilleur choix"
            features={(() => { try { return JSON.parse(tariff.features || '[]') } catch { return [] } })()}
            onSelect={() => openPack(tariff)}
          />
        ))}
      </div>

      <ModalCompose
        open={composeOpen}
        initialPack={pack}
        onClose={() => setComposeOpen(false)}
        onPay={startCheckout}
        payLoading={loading}
      />
    </>
  )
}

function TariffCard({
  name, price, features = [], popular = false, onSelect,
}: {
  name: string; price: string; features?: string[]; popular?: boolean; onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full h-full flex flex-col text-left rounded-2xl p-6 shadow-sm border transition
        ${popular 
          ? 'border-red-300 bg-white relative ring-1 ring-red-100 dark:border-red-600 dark:bg-neutral-900 dark:ring-red-900/20' 
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800'
        }`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white shadow-sm">
          Meilleur choix
        </span>
      )}
      <div className="h-20 flex flex-col justify-end">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">{name}</h3>
        <p className={`mt-2 text-3xl font-bold ${popular ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-white'}`}>{price}</p>
      </div>
      <ul className="mt-4 flex-1 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-red-500 dark:text-red-400 flex-shrink-0" aria-hidden>
              <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4Z"/>
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
        Réserver dès {price} <span aria-hidden>→</span>
      </div>
    </button>
  )
}
