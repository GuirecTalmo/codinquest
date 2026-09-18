'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PixelIcon } from '@/components/PixelIcon';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers le dashboard si l'utilisateur est déjà connecté
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <p className="text-text-secondary font-display uppercase tracking-wide">
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/chest-closed-48.png"
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            unoptimized
            className="w-10 h-10 [image-rendering:pixelated]"
          />
          <span className="text-2xl font-display font-bold text-text-primary">CodeInQuest</span>
        </div>
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 px-4 py-2 bg-accent border-[3px] border-accent-border text-on-accent font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
        >
          <PixelIcon name="LogIn" className="w-4 h-4" />
          Se connecter
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-text-primary mb-6 leading-tight">
              Testez vos connaissances,
              <br />
              <span className="text-accent">progressez en quiz !</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Relevez des défis, montez en divisions et devenez un maître du quiz.
              De Bronze à Challenger, chaque réussite compte !
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/auth/signup"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-accent border-[3px] border-accent-border text-on-accent font-semibold text-lg shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Commencer
              <PixelIcon name="ArrowRight" className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signin"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-surface border-[3px] border-border text-text-primary font-semibold text-lg shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              J&apos;ai déjà un compte
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-surface border-[3px] border-border shadow-hard p-6">
              <div className="w-12 h-12 bg-surface-dimmed border-[3px] border-border flex items-center justify-center mb-4 mx-auto">
                <PixelIcon name="Trophy" className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-text-primary mb-2">Système de Divisions</h3>
              <p className="text-text-secondary">
                Montez de Bronze à Challenger en réussissant les quiz.
                Chaque division ouvre de nouveaux défis !
              </p>
            </div>

            <div className="bg-surface border-[3px] border-border shadow-hard p-6">
              <div className="w-12 h-12 bg-surface-dimmed border-[3px] border-border flex items-center justify-center mb-4 mx-auto">
                <PixelIcon name="Target" className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-text-primary mb-2">Quiz Variés</h3>
              <p className="text-text-secondary">
                Des quiz de difficulté progressive sur différents thèmes.
                Culture générale, sciences, histoire et plus encore !
              </p>
            </div>

            <div className="bg-surface border-[3px] border-border shadow-hard p-6">
              <div className="w-12 h-12 bg-surface-dimmed border-[3px] border-border flex items-center justify-center mb-4 mx-auto">
                <PixelIcon name="TrendingUp" className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-text-primary mb-2">Suivi de Progression</h3>
              <p className="text-text-secondary">
                Consultez votre historique, vos statistiques et votre classement.
                Visualisez vos progrès en temps réel !
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 pt-12 border-t-[3px] border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-display font-bold text-text-primary mb-2">7</div>
                <div className="text-text-secondary text-sm uppercase tracking-wide">Divisions</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-text-primary mb-2">3</div>
                <div className="text-text-secondary text-sm uppercase tracking-wide">Niveaux</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-text-primary mb-2">6+</div>
                <div className="text-text-secondary text-sm uppercase tracking-wide">Quiz</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-text-primary mb-2">30+</div>
                <div className="text-text-secondary text-sm uppercase tracking-wide">Questions</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
