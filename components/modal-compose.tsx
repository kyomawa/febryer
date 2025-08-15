'use client'
import React from 'react'
import PricingBuilder, { Quote, PackId } from './pricing-builder'
import ModalCheckout from './modal-checkout'

export default function ModalCompose({
  open,
  initialPack,
  onClose,
  onPay,
  payLoading = false,
}: {
  open: boolean
  initialPack: PackId
  onClose: () => void
  onPay: (q: Quote) => Promise<void> | void
  payLoading?: boolean
}) {
  const [quote, setQuote] = React.useState<Quote | null>(null)
  const [step, setStep] = React.useState<'compose' | 'checkout'>('compose')
  const [resetKey, setResetKey] = React.useState(0) // Pour forcer le reset du PricingBuilder
  const prevOpen = React.useRef(open)

  // reset du devis seulement à l'ouverture
  React.useEffect(() => {
    if (open && !prevOpen.current) {
      setQuote(null)
      setStep('compose')
      setResetKey(prev => prev + 1) // Incrémenter pour forcer le remount du PricingBuilder
    }
    prevOpen.current = open
  }, [open, initialPack])

  if (!open) return null

  // Si on est dans l'étape checkout, afficher ModalCheckout
  if (step === 'checkout') {
    return (
      <ModalCheckout
        open={true}
        onClose={onClose}
        onBack={() => setStep('compose')}
        quote={quote}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Composer votre prestation</h3>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
              aria-label="Fermer"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3 10.6 10.6 16.9 4.3l1.4 1.4Z"/>
              </svg>
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto">
            <PricingBuilder
              key={`pb-${initialPack}-${resetKey}`}
              initialPack={initialPack}
              onQuoteChange={setQuote}
            />
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex items-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                setStep('checkout')
              }}
              disabled={!quote || payLoading}
              className="inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
