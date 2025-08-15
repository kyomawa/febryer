'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import PricingBuilder, { PackId, Quote } from './pricing-builder'

export default function PricingModal({ open, initialPack, onClose }:{
  open:boolean; initialPack:PackId; onClose:()=>void
}) {
  const backdropRef=useRef<HTMLDivElement>(null)
  const [quote,setQuote]=useState<Quote|null>(null)

  useEffect(()=>{ if(!open) return
    const onKey=(e:KeyboardEvent)=>e.key==='Escape'&&onClose()
    document.addEventListener('keydown',onKey)
    const prev=document.body.style.overflow; document.body.style.overflow='hidden'
    return ()=>{ document.removeEventListener('keydown',onKey); document.body.style.overflow=prev }
  },[open,onClose])

  if(!open) return null

  const pay=useCallback(()=>{
    const url=new URL('/devis',window.location.origin)
    if(quote){ 
      url.searchParams.set('pack',quote.pack)
      url.searchParams.set('size',quote.size)
      url.searchParams.set('total',String(quote.total))
      url.searchParams.set('items',quote.items.map(i=>i.id).join(','))
    }
    window.location.href=url.toString()
  },[quote])

  return (
    <div ref={backdropRef} onMouseDown={e=>{ if(e.target===backdropRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/60 p-2 sm:p-4" role="dialog" aria-modal="true">
      
      <div className="w-full max-w-6xl rounded-t-2xl sm:rounded-2xl bg-white dark:bg-neutral-800 shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-700 overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header fixe */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-100 dark:border-neutral-700">
          <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100">Composer & payer</h3>
          <div className="flex gap-2">
            <button onClick={pay} disabled={!quote}
              className="rounded-xl bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Payer maintenant
            </button>
            <button onClick={onClose} 
              className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors">
              Fermer
            </button>
          </div>
        </div>
        
        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <PricingBuilder initialPack={initialPack} onQuoteChange={(q: Quote | null) => setQuote(q)}/>
        </div>
      </div>
    </div>
  )
}
