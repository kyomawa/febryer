import React from 'react';
import { Star } from './icons';

type TestimonialProps = {
  name: string
  text: string
}

export function Testimonial({ name, text }: TestimonialProps){
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center ring-1 ring-neutral-200">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7 9a7 7 0 0 1 14 0Z" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <div className="flex items-center gap-1 text-red-500"><Star/><Star/><Star/><Star/><Star half={true}/></div>
        </div>
      </div>
      <p className="mt-4 text-sm text-neutral-700">“{text}”</p>
    </div>
  );
}
