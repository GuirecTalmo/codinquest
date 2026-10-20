'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PixelIcon } from '@/components/PixelIcon';
import { Difficulty } from '@prisma/client';
import { difficultyConfig } from '@/lib/quiz/difficulty';

interface Attempt {
  id: string;
  score: number;
  pointsEarned: number;
  totalPoints: number;
  isPassed: boolean;
  timeSpent: number | null;
  startedAt: Date;
  completedAt: Date;
  quiz: {
    id: string;
    title: string;
    description: string | null;
    difficulty: Difficulty;
    passingScore: number;
    level: {
      id: string;
      name: string;
      order: number;
    };
  };
}

type FilterStatus = 'all' | 'passed' | 'failed';

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatTimeSpent = (seconds: number | null): string => {
  if (seconds === null) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

function AttemptCard({ attempt, isCounting }: { attempt: Attempt; isCounting: boolean }) {
  return (
    <div
      className={`bg-surface border-[3px] shadow-hard p-6 transition-all ${
        attempt.isPassed
          ? 'border-success'
          : 'border-error'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Informations principales */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            {attempt.isPassed ? (
              <PixelIcon name="CheckCircle2" className="w-6 h-6 text-success flex-shrink-0 mt-1" />
            ) : (
              <PixelIcon name="XCircle" className="w-6 h-6 text-error flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-display font-bold text-text-primary mb-1">
                {attempt.quiz.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <PixelIcon name="Trophy" className="w-4 h-4" />
                  {attempt.quiz.level.name}
                </span>
                <span
                  className={`px-2 py-1 border-[3px] text-xs font-semibold uppercase tracking-wide ${difficultyConfig[attempt.quiz.difficulty].bgColor} ${difficultyConfig[attempt.quiz.difficulty].color}`}
                >
                  {difficultyConfig[attempt.quiz.difficulty].label}
                </span>
                {/* Seule la première réussite compte pour le score global
                    (voir PRODUCT.md) -- ce badge indique laquelle, pour
                    qu'un joueur qui rejoue un quiz déjà maîtrisé comprenne
                    pourquoi son score total ne bouge pas. */}
                {isCounting && (
                  <span className="px-2 py-1 bg-accent/10 border-[3px] border-accent-border text-accent text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                    <PixelIcon name="Zap" className="w-3 h-3" />
                    Comptabilisé
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary ml-9">
            <span className="flex items-center gap-1">
              <PixelIcon name="Calendar" className="w-4 h-4" />
              {formatDate(attempt.completedAt)}
            </span>
            {attempt.timeSpent !== null && (
              <span className="flex items-center gap-1">
                <PixelIcon name="Clock" className="w-4 h-4" />
                {formatTimeSpent(attempt.timeSpent)}
              </span>
            )}
          </div>
        </div>

        {/* Score et points */}
        <div className="flex flex-col items-end gap-2">
          <div
            className={`px-4 py-2 border-[3px] font-bold text-lg ${
              attempt.isPassed
                ? 'bg-success-surface text-success border-success'
                : 'bg-error-surface text-error border-error'
            }`}
          >
            {attempt.score}%
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <PixelIcon name="TrendingUp" className="w-4 h-4" />
            <span>
              {attempt.pointsEarned}/{attempt.totalPoints} points
            </span>
          </div>
          <div className="text-xs text-text-secondary">
            Score min: {attempt.quiz.passingScore}%
          </div>
        </div>
      </div>

      {/* Barre de progression du score */}
      <div className="mt-4 pt-4 border-t-[3px] border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary">Score</span>
          <span className="text-xs text-text-secondary flex items-center gap-1">
            {attempt.score >= attempt.quiz.passingScore ? (
              <>
                <PixelIcon name="CheckCircle2" className="w-3 h-3" />
                Réussi
              </>
            ) : (
              <>
                <PixelIcon name="XCircle" className="w-3 h-3" />
                Échoué
              </>
            )}
          </span>
        </div>
        <div className="relative w-full bg-surface-dimmed border-[3px] border-border h-2 overflow-hidden">
          <div
            className={`h-full ${
              attempt.isPassed ? 'bg-success' : 'bg-error'
            }`}
            style={{
              width: `${Math.min(attempt.score, 100)}%`,
            }}
          />
          {/* Ligne de score minimum */}
          <div
            className="absolute top-0 h-full w-0.5 bg-accent"
            style={{
              marginLeft: `${attempt.quiz.passingScore}%`,
            }}
          />
        </div>
      </div>

      {/* Retenter le quiz -- action la plus naturelle après avoir vu une
          tentative, surtout un échec, et qui n'existait auparavant nulle
          part sur cette page. */}
      <div className="mt-4 pt-4 border-t-[3px] border-border flex justify-end">
        <Link
          href={`/dashboard/quiz/${attempt.quiz.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-[3px] border-accent-border text-on-accent text-sm font-semibold uppercase tracking-wide shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
        >
          <PixelIcon name="RotateCcw" className="w-4 h-4" />
          Retenter
        </Link>
      </div>
    </div>
  );
}

export function HistoryList({ attempts }: { attempts: Attempt[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [expandedQuizIds, setExpandedQuizIds] = useState<Set<string>>(new Set());

  // Filtrage en mémoire sur les tentatives déjà chargées : pas de nouvel
  // aller-retour serveur à chaque changement de filtre.
  const filteredAttempts = attempts.filter((attempt) => {
    if (filter === 'passed') return attempt.isPassed;
    if (filter === 'failed') return !attempt.isPassed;
    return true;
  });

  // Seule la première réussite chronologique d'un quiz compte pour le score
  // global (voir PRODUCT.md -- règle anti-triche) : calculé sur la liste
  // complète (non filtrée, donc indépendant du filtre actif) pour que le
  // badge reste correct même en vue "Échoués" ou "Réussis". Best-effort sur
  // la fenêtre des 100 tentatives les plus récentes chargées par la page --
  // pas une nouvelle requête serveur.
  const countingAttemptIds = new Set<string>();
  {
    const earliestPassByQuiz = new Map<string, Attempt>();
    for (const attempt of attempts) {
      if (!attempt.isPassed) continue;
      const current = earliestPassByQuiz.get(attempt.quiz.id);
      if (!current || attempt.completedAt < current.completedAt) {
        earliestPassByQuiz.set(attempt.quiz.id, attempt);
      }
    }
    for (const attempt of earliestPassByQuiz.values()) {
      countingAttemptIds.add(attempt.id);
    }
  }

  // Regroupe les tentatives filtrées par quiz (la plus récente en tête,
  // puisque filteredAttempts est déjà triée par date décroissante) pour ne
  // pas noyer la page sous des dizaines de cartes quasi identiques quand un
  // même quiz a été tenté plusieurs fois.
  const groupedAttempts: { latest: Attempt; older: Attempt[] }[] = [];
  {
    const groupIndexByQuizId = new Map<string, number>();
    for (const attempt of filteredAttempts) {
      const existingIndex = groupIndexByQuizId.get(attempt.quiz.id);
      if (existingIndex === undefined) {
        groupIndexByQuizId.set(attempt.quiz.id, groupedAttempts.length);
        groupedAttempts.push({ latest: attempt, older: [] });
      } else {
        groupedAttempts[existingIndex].older.push(attempt);
      }
    }
  }

  const toggleExpanded = (quizId: string) => {
    setExpandedQuizIds((prev) => {
      const next = new Set(prev);
      if (next.has(quizId)) {
        next.delete(quizId);
      } else {
        next.add(quizId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Mon Historique</h1>
          <p className="text-text-secondary">
            {filteredAttempts.length} tentative{filteredAttempts.length > 1 ? 's' : ''}
            {filter === 'passed' && ' réussie' + (filteredAttempts.length > 1 ? 's' : '')}
            {filter === 'failed' && ' échouée' + (filteredAttempts.length > 1 ? 's' : '')}
          </p>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            className={`px-4 py-2 border-[3px] text-sm font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring ${
              filter === 'all'
                ? 'bg-accent border-accent-border text-on-accent'
                : 'bg-surface border-border text-text-secondary hover:border-accent-border'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('passed')}
            aria-pressed={filter === 'passed'}
            className={`px-4 py-2 border-[3px] text-sm font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring ${
              filter === 'passed'
                ? 'bg-success border-success text-on-state'
                : 'bg-surface border-border text-text-secondary hover:border-accent-border'
            }`}
          >
            Réussis
          </button>
          <button
            onClick={() => setFilter('failed')}
            aria-pressed={filter === 'failed'}
            className={`px-4 py-2 border-[3px] text-sm font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring ${
              filter === 'failed'
                ? 'bg-error border-error text-on-state'
                : 'bg-surface border-border text-text-secondary hover:border-accent-border'
            }`}
          >
            Échoués
          </button>
        </div>
      </div>

      {/* Liste des tentatives */}
      {filteredAttempts.length === 0 ? (
        <div className="bg-surface border-[3px] border-border shadow-hard p-12 text-center">
          <PixelIcon name="Trophy" className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-text-primary mb-2">
            {attempts.length === 0
              ? 'Aucun quiz complété pour le moment'
              : 'Aucune tentative pour ce filtre'}
          </h2>
          <p className="text-text-secondary mb-6">
            {attempts.length === 0
              ? 'Commencez votre parcours en passant votre premier quiz !'
              : 'Essayez un autre filtre pour voir vos tentatives.'}
          </p>
          {attempts.length === 0 && (
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent border-[3px] border-accent-border text-on-accent font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
            >
              Commencer un quiz
              <PixelIcon name="ArrowRight" className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedAttempts.map(({ latest, older }) => (
            <div key={latest.id}>
              <AttemptCard
                attempt={latest}
                isCounting={countingAttemptIds.has(latest.id)}
              />
              {older.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => toggleExpanded(latest.quiz.id)}
                    aria-expanded={expandedQuizIds.has(latest.quiz.id)}
                    className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
                  >
                    <PixelIcon
                      name={expandedQuizIds.has(latest.quiz.id) ? 'ArrowLeft' : 'ChevronRight'}
                      className="w-3 h-3"
                    />
                    {expandedQuizIds.has(latest.quiz.id)
                      ? 'Masquer les tentatives précédentes'
                      : `+${older.length} tentative${older.length > 1 ? 's' : ''} précédente${older.length > 1 ? 's' : ''}`}
                  </button>
                  {expandedQuizIds.has(latest.quiz.id) && (
                    <div className="space-y-4 mt-4">
                      {older.map((attempt) => (
                        <AttemptCard
                          key={attempt.id}
                          attempt={attempt}
                          isCounting={countingAttemptIds.has(attempt.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
