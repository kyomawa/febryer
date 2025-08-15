import React from 'react';

export function Star({ half = false }) {
  if (half) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <defs>
          <linearGradient id="half" x1="0" x2="1">
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
        <path fill="url(#half)" d="M12 17.3 6.18 20l1.11-6.49L2 9.24l6.55-.95L12 2l3.45 6.29 6.55.95-4.73 4.27L17.82 20 12 17.3z"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-500" aria-hidden>
      <path fill="currentColor" d="M12 17.3 6.18 20l1.11-6.49L2 9.24l6.55-.95L12 2l3.45 6.29 6.55.95-4.73 4.27L17.82 20 12 17.3z"/>
    </svg>
  );
}

export function Clock() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-500" aria-hidden>
      <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 11h4v-2h-3V6h-2v7Z"/>
    </svg>
  );
}

export function Calendar() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v3H2V6a2 2 0 0 1 2-2h3V2Zm15 9v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9h20Z"/>
    </svg>
  );
}

export function Pin() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"/>
    </svg>
  );
}

export function Shield() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="currentColor" d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Z"/>
    </svg>
  );
}

export function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-red-500" aria-hidden>
      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4Z"/>
    </svg>
  );
}

export function Dot() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-500" aria-hidden>
      <circle cx="12" cy="12" r="6" fill="currentColor"/>
    </svg>
  );
}

export function IconX(){
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="currentColor" d="M17.5 3H21l-7.5 8.5L22 21h-6l-4.7-5.5L5.8 21H2l8.2-9.3L2 3h6l4.3 5 5.2-5Z"/>
    </svg>
  );
}
export function IconIG(){
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm6.5-.75a1.25 1.25 0 1 0 1.25 1.25 1.25 1.25 0 0 0-1.25-1.25Z"/>
    </svg>
  );
}
export function IconFB(){
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="currentColor" d="M13 9h3V6h-3c-1.66 0-3 1.34-3 3v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.55.45-1 1-1Z"/>
    </svg>
  );
}
