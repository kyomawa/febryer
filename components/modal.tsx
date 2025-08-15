'use client'
import React from 'react'

export default function Modal({
  title, onClose, children,
}: { title: string; onClose: () => void; children: React.ReactNode }) {
  const backdropRef = React.useRef<HTMLDivElement>(null)
  const closeOnEsc = React.useCallback((e: KeyboardEvent) => (e.key === 'Escape') && onClose(), [onClose])

  React.useEffect(() => {
    document.addEventListener('keydown', closeOnEsc)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', closeOnEsc); document.body.style.overflow = prev }
  }, [closeOnEsc])

  return (
    <div
      ref={backdropRef}
      onMouseDown={(e) => { if (e.target === backdropRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/60"
      role="dialog" aria-modal="true"
    >
      <div className="w-full sm:max-w-4xl lg:max-w-5xl rounded-t-2xl sm:rounded-2xl bg-white dark:bg-neutral-800 shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-neutral-700">
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition">Fermer</button>
        </div>
        {children}
      </div>
    </div>
  )
}
