import React from 'react';

type SocialProps = {
  icon: React.ReactNode
  label: string
}

export function Social({ icon, label }: SocialProps){
  return (
    <a href="#" aria-label={label} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors">
      <span className="h-5 w-5" aria-hidden>{icon}</span>
    </a>
  );
}
