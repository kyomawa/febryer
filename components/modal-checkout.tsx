// components/modal-checkout.tsx
'use client'
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import type { Quote } from './pricing-builder'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function ModalCheckout({
  open, onClose, onBack, quote,
}: {
  open: boolean
  onClose: () => void
  onBack: () => void
  quote: Quote | null
}) {
  const [loading, setLoading] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState<'online' | 'onsite' | null>(null)
  const [form, setForm] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine: '',
    postcode: '',
    city: '',
    when: '',
    note: '',
  })

  if (!open) return null

  // Handler pour le paiement Stripe
  const handleStripePayment = async () => {
    if (!quote) return
    setLoading(true)
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur serveur')

      if (json.url) {
        window.location.href = json.url
        return
      }
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe non initialisé')
      const { error } = await stripe.redirectToCheckout({ sessionId: json.id })
      if (error) throw error
    } catch (err: any) {
      alert(err.message || 'Paiement indisponible')
      setLoading(false)
    }
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quote) return
    setLoading(true)
    
    try {
      // Paiement sur place - créer juste la demande sans Stripe
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quote, 
          customer: form, 
          paymentMethod: 'onsite' 
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur serveur')
      
      alert('Demande enregistrée ! Nous vous recontacterons pour confirmer le créneau et le paiement sur place.')
      onClose()
      return
    } catch (err: any) {
      alert(err.message || 'Erreur serveur')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 dark:bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Vos informations</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400">✕</button>
        </div>

        {/* Résumé rapide */}
        {quote && (
          <div className="mt-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 p-4 ring-1 ring-neutral-200 dark:ring-neutral-600">
            <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-300">
              <span>Pack</span><span className="font-medium text-neutral-900 dark:text-white">{quote.pack.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-300">
              <span>Taille</span><span className="font-medium text-neutral-900 dark:text-white">{quote.size}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-bold">
              <span className="text-neutral-900 dark:text-white">Total</span><span className="text-red-600 dark:text-red-400">{quote.total}€</span>
            </div>
          </div>
        )}

        {/* Choix de paiement direct */}
        {paymentMethod === 'onsite' ? (
          // Formulaire pour paiement sur place
          <form onSubmit={handlePay} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              required 
              placeholder="Nom complet" 
              className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" 
              value={form.fullName} 
              onChange={e=>setForm(f=>({...f, fullName:e.target.value}))}
            />
            <input 
              required 
              type="email" 
              placeholder="Email" 
              className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" 
              value={form.email} 
              onChange={e=>setForm(f=>({...f, email:e.target.value}))}
            />
            <input 
              placeholder="Téléphone" 
              className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" 
              value={form.phone} 
              onChange={e=>setForm(f=>({...f, phone:e.target.value}))}
            />
            <input 
              className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none md:col-span-2" 
              placeholder="Adresse d'intervention" 
              value={form.addressLine} 
              onChange={e=>setForm(f=>({...f, addressLine:e.target.value}))}
            />
            <input 
              placeholder="Code postal" 
              className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" 
              value={form.postcode} 
              onChange={e=>setForm(f=>({...f, postcode:e.target.value}))}
            />
            <input 
              placeholder="Ville" 
              className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" 
              value={form.city} 
              onChange={e=>setForm(f=>({...f, city:e.target.value}))}
            />
            <input 
              placeholder="Préférence de créneau" 
              className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none md:col-span-2" 
              value={form.when} 
              onChange={e=>setForm(f=>({...f, when:e.target.value}))}
            />
            <input 
              placeholder="Infos accès / parking (optionnel)" 
              className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none md:col-span-2" 
              value={form.note} 
              onChange={e=>setForm(f=>({...f, note:e.target.value}))}
            />

            <div className="mt-2 md:col-span-2 flex items-center justify-between gap-3">
              <button 
                type="button" 
                onClick={onBack} 
                className="rounded-xl border border-neutral-200 dark:border-neutral-600 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                Retour
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="rounded-xl bg-red-500 px-5 py-2.5 text-white font-medium hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? 'En cours…' : 'Envoyer la demande'}
              </button>
            </div>
          </form>
        ) : (
          // Sélection du mode de paiement
          <div className="mt-4 space-y-4">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">Choisissez votre mode de paiement</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setPaymentMethod('online')
                  handleStripePayment()
                }}
                disabled={loading}
                className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-600 hover:border-red-300 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-white">
                    {loading ? 'Redirection en cours...' : 'Paiement en ligne'}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Sécurisé avec Stripe</div>
                </div>
              </button>
              
              <button 
                onClick={() => setPaymentMethod('onsite')}
                className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-600 hover:border-red-300 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 000 4h12a2 2 0 100-4H4zm0 6a2 2 0 000 4h12a2 2 0 100-4H4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-neutral-900 dark:text-white">Paiement sur place</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Espèces ou CB</div>
                </div>
              </button>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <button 
                type="button" 
                onClick={onBack} 
                className="rounded-xl border border-neutral-200 dark:border-neutral-600 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
