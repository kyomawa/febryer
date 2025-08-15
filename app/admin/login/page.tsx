'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', { redirect: false, email, password });
    if (result?.error) setError('Identifiants invalides.');
    else if (result?.ok) router.push('/admin');
  };

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-50 dark:bg-neutral-900">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-white text-xs font-semibold">fé</span>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Espace admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input id="email" label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
          <Input id="password" label="Mot de passe" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required />

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <Button type="submit" className="w-full">Connexion</Button>
        </form>
      </div>
    </div>
  );
}
