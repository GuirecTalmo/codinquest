'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0].toString()] = issue.message;
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
              Créer un compte
            </h1>
            <p className="text-text-secondary">
              Rejoignez-nous et commencez votre parcours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="bg-error-surface border-[3px] border-error text-error px-4 py-3 text-sm">
                {apiError}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                Nom (optionnel)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
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
                className="block text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
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
                className="block text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface-dimmed border-[3px] border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-all"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium uppercase tracking-wide text-text-secondary mb-2"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface-dimmed border-[3px] border-border text-text-primary placeholder-text-secondary focus:outline-none focus:ring-[3px] focus:ring-focus-ring transition-all"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent border-[3px] border-accent-border text-on-accent font-semibold py-3 px-4 shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0"
            >
              {isLoading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Déjà un compte ?{' '}
              <Link
                href="/auth/signin"
                className="text-accent hover:text-accent-border font-medium transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
