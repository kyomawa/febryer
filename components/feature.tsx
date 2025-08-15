{/* Composant local */}
export function FeatureRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-4 p-5 sm:p-6">
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <h3 className="text-base font-semibold leading-6 text-neutral-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
      </div>
    </li>
  )
}