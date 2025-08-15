'use client'

import { Input } from "./input";
import { Dot } from "./icons";

export function ContactForm() {
    return (
        <section id="contact" className="py-20 bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Réserver ou demander un devis</h2>
              <p className="mt-3 text-neutral-600 dark:text-neutral-300">Réservez directement nos prestations ou demandez un devis personnalisé. Réponse rapide (souvent sous 1h).</p>
              <ul className="mt-6 space-y-3 text-neutral-700 dark:text-neutral-300">
                <li className="flex items-center gap-3"><Dot/> Zones couvertes : Lyon & métropole (30 km)</li>
                <li className="flex items-center gap-3"><Dot/> 7j/7 de 8h à 20h</li>
                <li className="flex items-center gap-3"><Dot/> Produits éco-responsables</li>
              </ul>
              <div className="mt-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800 p-4 ring-1 ring-neutral-100 dark:ring-neutral-700">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">Professionnels ? <span className="font-medium text-neutral-900 dark:text-white">Faites baisser vos coûts</span> avec nos contrats flotte sur-mesure.</p>
              </div>
            </div>
            <form onSubmit={(e)=>e.preventDefault()} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Prénom" id="prenom" placeholder="Votre prénom"/>
                <Input label="Nom" id="nom" placeholder="Votre nom"/>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Email" id="email" type="email" placeholder="vous@domaine.fr"/>
                <Input label="Téléphone" id="tel" type="tel" placeholder="06 12 34 56 78"/>
              </div>
              <div className="mt-4">
                <Input label="Localisation" id="loc" placeholder="Adresse ou zone (ex: Villeurbanne)"/>
              </div>
              <div className="mt-4">
                <label htmlFor="service" className="mb-1 block text-sm font-medium text-neutral-900 dark:text-white">Service souhaité</label>
                <select id="service" className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800">
                  <option>Formule Confort</option>
                  <option>Lavage Express</option>
                  <option>Intérieur Soigné</option>
                  <option>Rénovation Carrosserie</option>
                  <option>Protection Céramique</option>
                  <option>Autre / Sur devis</option>
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="msg" className="mb-1 block text-sm font-medium text-neutral-900 dark:text-white">Détails</label>
                <textarea id="msg" rows={4} placeholder="Modèle du véhicule, état, contraintes horaires…" className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"/>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">En envoyant, vous acceptez notre <a href="#" className="underline decoration-neutral-300 dark:decoration-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300">politique de confidentialité</a>.</p>
                <button className="inline-flex items-center rounded-xl bg-red-500 px-5 py-2.5 text-white font-medium shadow-sm hover:bg-red-600 transition" type="submit">Envoyer</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
}