'use client'

import useSWR, { mutate } from 'swr'
import React from 'react'

type Svc = { id: string; name: string; price: number }
type AdminAppt = {
  id: string
  createdAt: string
  name?: string | null
  email?: string | null
  phone?: string | null
  packSlug?: string | null
  packName?: string | null
  sizeId?: string | null
  sizeLabel?: string | null
  isCustom?: boolean
  services?: Svc[]
  servicesCount?: number | null
  stripePaymentIntentId?: string | null
  stripeSessionId?: string | null
  paymentStatus?: string | null
  amountTotal?: number | null
  when?: string | null
  note?: string | null
  interventionAddress?: string | null
}

const safeJson = async (res: Response) => {
  const text = await res.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}
const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: 'no-store' })
  if (!r.ok) {
    const j = await safeJson(r)
    throw new Error(j?.error || `HTTP ${r.status}`)
  }
  const data = await safeJson(r)
  return Array.isArray(data) ? (data as AdminAppt[]) : []
}

export default function AppointmentsPage() {
  const { data, error, isLoading } = useSWR<AdminAppt[]>('/api/admin/appointments', fetcher, {
    revalidateOnFocus: true,
  })
  const [expandedServices, setExpandedServices] = React.useState<Set<string>>(new Set())

  const onGlobalRefresh = async () => {
    // ping le backend pour re-synchroniser Stripe puis revalider SWR
    await fetch('/api/admin/appointments/refresh-all', { method: 'POST' }).catch(() => {})
    mutate('/api/admin/appointments')
  }

  const onDelete = async (id: string) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return
    await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' }).catch(() => {})
    mutate('/api/admin/appointments')
  }

  const act = async (id: string, action: 'capture'|'cancel'|'accept_onsite'|'reject_onsite') => {
    const res = await fetch(`/api/admin/appointments/${id}/${action}`, { method: 'POST' })
    const j = await safeJson(res)
    if (!res.ok) {
      alert(j?.error || `Action impossible (${action})`)
      return
    }
    mutate('/api/admin/appointments')
  }

  if (error) return <div className="text-sm text-red-600 dark:text-red-400">Impossible de charger les rendez-vous.</div>

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Rendez-vous</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Paiements & demandes clients.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onGlobalRefresh}
            className="inline-flex items-center rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            Rafraîchir tout
          </button>
        </div>
      </header>

      {isLoading && <div className="text-sm text-neutral-600 dark:text-neutral-400">Chargement…</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(data ?? []).map((a) => {
          const services: Svc[] = Array.isArray(a.services) ? a.services : []
          const servicesCount = typeof a.servicesCount === 'number' ? a.servicesCount : services.length
          const isCustom = Boolean(a.isCustom)
          const isExpanded = expandedServices.has(a.id)
          const visibleServices = isExpanded ? services : services.slice(0, 6)

          return (
            <Card key={a.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{a.name ?? 'Client'}</p>
                    {isCustom && (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 ring-1 ring-red-100 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800/30">
                        CUSTOM
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{a.email ?? '—'}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={a.paymentStatus ?? null} />
                  <p className="mt-1 text-sm font-semibold">
                    {a.amountTotal != null ? `${a.amountTotal}€` : '—'}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                {a.packName && (
                  <Badge>
                    {a.packName}
                    {isCustom && <span className="ml-1 text-red-600 dark:text-red-400">(Modifié)</span>}
                  </Badge>
                )}
                {!a.packName && isCustom && <Badge>Pack personnalisé</Badge>}
                {a.sizeLabel && <Badge>{a.sizeLabel}</Badge>}
                {a.when && <Badge>📅 {a.when}</Badge>}
              </div>

              <div className="mt-3">
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Prestations ({servicesCount} service{servicesCount > 1 ? 's' : ''})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleServices.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-[11px] text-blue-700 ring-1 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800/30"
                      title={`${s.price}€`}
                    >
                      {s.name}
                    </span>
                  ))}
                  {servicesCount > 6 && (
                    <button
                      onClick={() => {
                        const newExpanded = new Set(expandedServices)
                        if (isExpanded) {
                          newExpanded.delete(a.id)
                        } else {
                          newExpanded.add(a.id)
                        }
                        setExpandedServices(newExpanded)
                      }}
                      className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-200 transition-colors dark:bg-neutral-700 dark:text-neutral-300 dark:ring-neutral-600 dark:hover:bg-neutral-600"
                    >
                      {isExpanded ? 'Voir moins' : `+${servicesCount - 6} autres`}
                    </button>
                  )}
                  {servicesCount === 0 && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 italic">Aucune prestation</span>
                  )}
                </div>
              </div>

              {(a.interventionAddress || a.note) && (
                <div className="mt-3 space-y-1">
                  {a.interventionAddress && (
                    <p className="text-xs text-neutral-700 dark:text-neutral-300">
                      <span className="font-medium">Adresse:</span> {a.interventionAddress}
                    </p>
                  )}
                  {a.note && (
                    <p className="text-xs text-neutral-700 dark:text-neutral-300">
                      <span className="font-medium">Note:</span> {a.note}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                  {a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {a.paymentStatus === 'pending_onsite' && (
                    <>
                      <button
                        onClick={() => act(a.id, 'accept_onsite')}
                        className="inline-flex items-center rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-800 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                      >
                        ✓ Accepter
                      </button>
                      <button
                        onClick={() => act(a.id, 'reject_onsite')}
                        className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        ✕ Refuser
                      </button>
                    </>
                  )}
                  {a.paymentStatus === 'requires_capture' && (
                    <button
                      onClick={() => act(a.id, 'capture')}
                      className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Capturer
                    </button>
                  )}
                  {a.paymentStatus && a.paymentStatus !== 'canceled' && a.paymentStatus !== 'succeeded' && a.paymentStatus !== 'accepted_onsite' && a.paymentStatus !== 'rejected_onsite' && (
                    <button
                      onClick={() => act(a.id, 'cancel')}
                      className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
                    >
                      Annuler
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(a.id)}
                    className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* UI helpers */
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">{children}</div>
}
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-1 text-[11px] ring-1 ring-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:ring-neutral-600">
      {children}
    </span>
  )
}
function StatusBadge({ status }: { status: string | null }) {
  if (!status)
    return (
      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-1 text-[11px] ring-1 ring-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:ring-neutral-600">
        inconnu
      </span>
    )
  const map: Record<string, string> = {
    requires_payment_method: 'à payer',
    requires_confirmation: 'à confirmer',
    requires_capture: 'à capturer',
    processing: 'en cours',
    canceled: 'annulé',
    succeeded: 'payé',
    pending_onsite: 'paiement sur place',
    accepted_onsite: 'accepté sur place',
    rejected_onsite: 'refusé',
  }
  const label = map[status] ?? status
  const cls =
    status === 'succeeded' || status === 'accepted_onsite'
      ? 'bg-green-50 text-green-700 ring-green-100 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-800/30'
      : status === 'pending_onsite'
      ? 'bg-orange-50 text-orange-700 ring-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:ring-orange-800/30'
      : status === 'requires_capture'
      ? 'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/30'
      : status === 'canceled' || status === 'rejected_onsite'
      ? 'bg-red-50 text-red-700 ring-red-100 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800/30'
      : 'bg-neutral-100 text-neutral-700 ring-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:ring-neutral-600'
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] ring-1 ${cls}`}>{label}</span>
}
