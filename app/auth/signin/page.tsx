'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PixelIcon } from '@/components/PixelIcon';

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const justRegistered = searchParams.get('registered') === 'true';

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
  const [showPassword, setShowPassword] = useState(false);

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
          <div className="flex flex-col items-center text-center mb-8">
            <Image
              src="/icons/chest-closed-48.png"
              alt=""
              aria-hidden="true"
              width={48}
              height={48}
              unoptimized
              className="w-12 h-12 mb-3 [image-rendering:pixelated]"
            />
            <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
              Bienvenue
            </h1>
            <p className="text-text-secondary">
              Connectez-vous pour continuer
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {justRegistered && !error && (
              <div className="flex items-center gap-2 bg-success-surface border-[3px] border-success text-success px-4 py-3 text-sm">
                <PixelIcon name="CheckCircle2" className="w-4 h-4 flex-shrink-0" />
                Compte créé ! Connecte-toi pour rejoindre la Division Bronze.
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-error-surface border-[3px] border-error text-error px-4 py-3 text-sm">
                <PixelIcon name="AlertCircle" className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                <PixelIcon name="Mail" className="w-4 h-4" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-surface-dimmed border-[3px] border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                <PixelIcon name="Lock" className="w-4 h-4" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 bg-surface-dimmed border-[3px] border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary hover:text-text-primary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  <PixelIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent border-[3px] border-accent-border text-on-accent font-semibold py-3 px-4 shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all focus:outline-none focus:ring-[3px] focus:ring-focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0"
            >
              {isLoading ? (
                'Connexion...'
              ) : (
                <>
                  Se connecter
                  <PixelIcon name="LogIn" className="w-4 h-4" />
                </>
              )}
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
