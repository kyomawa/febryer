import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-neutral-200 bg-white p-5 md:block dark:border-neutral-700 dark:bg-neutral-800">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-white font-semibold">fé</span>
            <div className="leading-tight">
              <p className="font-semibold">fé bryer</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Back-office</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-6 space-y-1">
            <NavItem href="/admin" label="Tableau de bord" />
            <NavItem href="/admin/tariffs" label="Tarifs" />
            <NavItem href="/admin/photos" label="Photos" />
            <NavItem href="/admin/appointments" label="Rendez-vous" />
          </nav>

          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-400">
            Gérez vos contenus (tarifs, médias, demandes) dans une interface
            cohérente avec le site public.
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 md:p-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 border border-transparent hover:border-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 dark:hover:border-neutral-600"
    >
      {label}
    </Link>
  );
}
