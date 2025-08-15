import React from 'react';

type StepProps = {
  icon: React.ReactNode
  title: string
  text: string
}

export function Step({ icon, title, text }: StepProps){
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-red-500 text-white flex items-center justify-center">
          <div className="h-5 w-5" aria-hidden>{icon}</div>
        </div>
        <h3 className="font-semibold text-neutral-900 dark:text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{text}</p>
    </div>
  );
}
