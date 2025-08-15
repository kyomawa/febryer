import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

export function Input({ label, id, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-neutral-900 dark:text-white">{label}</label>
      <input 
        id={id} 
        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800" 
        {...props} 
      />
    </div>
  );
}
