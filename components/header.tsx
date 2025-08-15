'use client'

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { useState } from 'react'

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    
    const openBookingModal = () => {
        // Déclenche un event custom que le composant TariffsSection peut écouter
        window.dispatchEvent(new CustomEvent('openBookingModal', { detail: { pack: 'confort' } }))
        setMobileMenuOpen(false) // Ferme le menu mobile après clic
    }

    const closeMobileMenu = () => {
        setMobileMenuOpen(false)
    }

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b border-neutral-200 dark:bg-neutral-950/95 dark:supports-[backdrop-filter]:bg-neutral-950/75 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
         
              <Link href="/" className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-red-500 flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" aria-hidden>
                    <path d="M4 12c0-4.418 3.582-8 8-8 2.761 0 5.2 1.4 6.681 3.524a1 1 0 0 1-.316 1.43l-2.01 1.206A6 6 0 1 0 18 16.5h2A8 8 0 0 1 4 12Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="font-semibold tracking-tight text-lg text-neutral-900 dark:text-white">Fé Bryer</span>
              </Link>
            
            
            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center gap-6 text-sm">
              <a href="#avantages" className="text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Pourquoi nous choisir</a>
              <a href="#process" className="text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Comment ça marche</a>
              <a href="#tarifs" className="text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Nos prestations</a>
              <a href="#avis" className="text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Ils nous recommandent</a>
              <a href="#galerie" className="text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Réalisations</a>
              <a href="#contact" className="text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Devis</a>
            </nav>

            {/* CTA Desktop + Theme Toggle */}
            <div className="hidden lg:flex items-center gap-3">
              
              <button onClick={openBookingModal} className="inline-flex items-center rounded-xl bg-red-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-red-600 transition">Réserver</button>
            </div>

            {/* Mobile: Theme + CTA + Hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              
              <button onClick={openBookingModal} className="inline-flex items-center rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 transition">Réserver</button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-neutral-700 hover:text-red-600 dark:text-neutral-300 dark:hover:text-red-400"
                aria-label="Menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
              <nav className="px-4 py-4 space-y-3">
                <a href="#avantages" onClick={closeMobileMenu} className="block py-2 text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Pourquoi nous choisir</a>
                <a href="#process" onClick={closeMobileMenu} className="block py-2 text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Comment ça marche</a>
                <a href="#tarifs" onClick={closeMobileMenu} className="block py-2 text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Nos prestations</a>
                <a href="#avis" onClick={closeMobileMenu} className="block py-2 text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Ils nous recommandent</a>
                <a href="#galerie" onClick={closeMobileMenu} className="block py-2 text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Réalisations</a>
                <a href="#contact" onClick={closeMobileMenu} className="block py-2 text-neutral-700 hover:text-red-600 transition dark:text-neutral-300 dark:hover:text-red-400">Devis</a>
              </nav>
            </div>
          )}
        </div>
      </header>
    )
}
