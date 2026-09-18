'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { PixelIcon } from '@/components/PixelIcon';
import { DivisionIcon } from '@/components/quiz/DivisionIcon';
import { DIVISIONS_ORDER } from '@/lib/quiz/divisions';

const LADDER_ORDER = [...DIVISIONS_ORDER].reverse();

export default function Home() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

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
        <Link href="/" className="flex items-center gap-3">
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
        </Link>
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-accent border-[3px] border-accent-border text-on-accent font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            <PixelIcon name="User" className="w-4 h-4" />
            Mon compte
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className="flex items-center gap-2 px-4 py-2 bg-accent border-[3px] border-accent-border text-on-accent font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            <PixelIcon name="LogIn" className="w-4 h-4" />
            Se connecter
          </Link>
        )}
      </nav>

      {/* Hero Section -- deux colonnes : accroche + CTA à gauche, échelle
          des 7 divisions à droite (Challenger en haut) comme visuel
          principal, à la place de la mascotte. */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center mb-16">
          <div>
            <p className="text-accent text-sm font-semibold uppercase tracking-wide mb-4">
              App de quiz front-end
            </p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6 leading-tight">
              Progressez en quiz,
              <br />
              <span className="text-accent">grimpez les divisions.</span>
            </h1>
            <p className="text-lg text-text-secondary mb-8 max-w-xl">
              Relevez des défis, montez en divisions et devenez un maître du quiz.
              De Bronze à Challenger, chaque réussite compte !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

            <div className="flex flex-wrap gap-6">
              <div>
                <span className="font-display font-bold text-xl text-text-primary">7</span>{' '}
                <span className="text-text-secondary text-sm uppercase tracking-wide">divisions</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-text-primary">6+</span>{' '}
                <span className="text-text-secondary text-sm uppercase tracking-wide">quiz</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-text-primary">30+</span>{' '}
                <span className="text-text-secondary text-sm uppercase tracking-wide">questions</span>
              </div>
            </div>
          </div>

          {/* Échelle des divisions */}
          <div className="bg-surface border-[3px] border-border shadow-hard p-5">
            <p className="text-text-secondary text-xs uppercase tracking-wide text-center mb-3">
              Ton objectif
            </p>
            <div className="flex flex-col gap-1.5">
              {LADDER_ORDER.map((division, index) => {
                const isTop = index === 0;
                return (
                  <div
                    key={division}
                    className={`flex items-center gap-3 px-3 py-2 border-[3px] ${
                      isTop
                        ? 'bg-ink border-accent-border'
                        : 'bg-surface-dimmed border-border'
                    }`}
                  >
                    <DivisionIcon division={division} className="w-8 h-8" />
                    <span
                      className={`font-display font-bold text-sm ${
                        isTop ? 'text-accent' : 'text-text-primary'
                      }`}
                    >
                      {division}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Features -- 2 colonnes : le système de divisions a déjà son
            propre visuel dans le hero. */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-surface border-[3px] border-border shadow-hard p-7 flex gap-5 items-start">
            <div className="w-12 h-12 flex-shrink-0 bg-surface-dimmed border-[3px] border-border flex items-center justify-center">
              <PixelIcon name="Target" className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-text-primary mb-2">Quiz Variés</h3>
              <p className="text-text-secondary">
                HTML, CSS, JavaScript, React, Vue.js, Web Perf, IA — de quoi
                préparer vos entretiens techniques front-end.
              </p>
            </div>
          </div>

          <div className="bg-surface border-[3px] border-border shadow-hard p-7 flex gap-5 items-start">
            <div className="w-12 h-12 flex-shrink-0 bg-surface-dimmed border-[3px] border-border flex items-center justify-center">
              <PixelIcon name="TrendingUp" className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-text-primary mb-2">Suivi de Progression</h3>
              <p className="text-text-secondary">
                Consultez votre historique, vos statistiques et votre classement.
                Visualisez vos progrès en temps réel !
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto pt-12 border-t-[3px] border-border">
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
      </main>
    </div>
  );
}
