'use client';

import { signOut, useSession } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Bonjour, {session?.user?.name ?? 'Admin'}</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Gérez tarifs, photos et demandes clients.</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600"
        >
          Se déconnecter
        </button>
      </header>

      {/* Quick cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CardStat title="Tarifs" value="Configurer" href="/admin/tariffs" />
        <CardStat title="Photos" value="Gérer" href="/admin/photos" />
        <CardStat title="Rendez-vous" value="Consulter" href="/admin/appointments" />
      </section>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Bienvenue sur le back-office</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Utilisez la barre latérale pour naviguer. Les pages ont été harmonisées avec la
          charte de la landing : cartes blanches, bords arrondis, accents rouges.
        </p>
      </div>
    </div>
  );
}

function CardStat({ title, value, href }: { title: string; value: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-sm transition hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700"
    >
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{title}</p>
      <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">{value}</p>
    </a>
  );
}
