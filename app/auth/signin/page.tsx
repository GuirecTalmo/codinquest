'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Rediriger vers le dashboard si déjà connecté
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border-[3px] border-border shadow-hard p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
              Bienvenue
            </h1>
            <p className="text-text-secondary">
              Connectez-vous pour continuer
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-surface border-[3px] border-error text-error px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-dimmed border-[3px] border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-dimmed border-[3px] border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent border-[3px] border-accent-border text-on-accent font-semibold py-3 px-4 shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Pas encore de compte ?{' '}
              <Link
                href="/auth/signup"
                className="text-accent hover:text-accent-border font-medium transition-colors"
              >
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
