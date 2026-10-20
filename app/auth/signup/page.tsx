'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PixelIcon } from '@/components/PixelIcon';
import { signupSchema, type SignupInput } from '@/lib/quiz/validations';

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignupInput & { confirmPassword: string }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validation avec Zod
    const validationResult = signupSchema.safeParse({
      email: formData.email,
      password: formData.password,
      name: formData.name || undefined,
    });

    if (!validationResult.success) {
      // Un mot de passe peut échouer plusieurs règles à la fois (longueur,
      // majuscule, minuscule, chiffre -- voir lib/quiz/validations.ts) :
      // Zod renvoie un `issue` par règle en échec pour le même champ. Les
      // accumuler (au lieu d'écraser) pour ne pas faire découvrir les
      // règles une par une à chaque nouvelle soumission.
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString();
        if (field) {
          newErrors[field] = newErrors[field]
            ? `${newErrors[field]} ${issue.message}.`
            : `${issue.message}.`;
        }
      });
    }

    // Vérifier la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || 'Une erreur est survenue lors de l\'inscription');
        setIsLoading(false);
        return;
      }

      // Rediriger vers la page de connexion après inscription réussie
      router.push('/auth/signin?registered=true');
    } catch {
      setApiError('Une erreur est survenue lors de l\'inscription');
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
              Créer un compte
            </h1>
            <p className="text-text-secondary">
              Rejoignez-nous et commencez votre parcours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="flex items-center gap-2 bg-error-surface border-[3px] border-error text-error px-4 py-3 text-sm">
                <PixelIcon name="AlertCircle" className="w-4 h-4 flex-shrink-0" />
                {apiError}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                <PixelIcon name="User" className="w-4 h-4" />
                Nom (optionnel)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className="w-full px-4 py-3 bg-surface-dimmed border-[3px] border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-all"
                placeholder="Votre nom"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error">{errors.name}</p>
              )}
            </div>

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
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-surface-dimmed border-[3px] border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-all"
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email}</p>
              )}
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
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
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                <PixelIcon name="Lock" className="w-4 h-4" />
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 bg-surface-dimmed border-[3px] border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary hover:text-text-primary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-colors"
                  aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  <PixelIcon name={showConfirmPassword ? 'EyeOff' : 'Eye'} className="w-4 h-4" />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent border-[3px] border-accent-border text-on-accent font-semibold py-3 px-4 shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all focus:outline-none focus:ring-[3px] focus:ring-focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0"
            >
              {isLoading ? (
                'Inscription...'
              ) : (
                <>
                  S&apos;inscrire
                  <PixelIcon name="ArrowRight" className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-text-secondary text-sm">
              Déjà un compte ?{' '}
              <Link
                href="/auth/signin"
                className="text-accent hover:text-accent-border font-medium transition-colors"
              >
                Se connecter
              </Link>
            </p>
            <p className="text-text-secondary text-xs">
              En créant un compte, vous acceptez nos{' '}
              <Link
                href="/cgu"
                className="text-accent hover:text-accent-border transition-colors"
              >
                CGU
              </Link>{' '}
              et notre{' '}
              <Link
                href="/confidentialite"
                className="text-accent hover:text-accent-border transition-colors"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
