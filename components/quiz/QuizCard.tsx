import { Difficulty } from '@prisma/client';
import Link from 'next/link';
import { CheckCircle2, Clock, Lock, Zap } from 'lucide-react';

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    difficulty: Difficulty;
    timeLimit?: number | null;
    passingScore?: number;
    passed?: boolean;
    attempted?: boolean;
  };
  levelName?: string;
  locked?: boolean;
}

const difficultyConfig: Record<
  Difficulty,
  { color: string; label: string; bgColor: string }
> = {
  EASY: {
    color: 'text-green-400',
    label: 'Facile',
    bgColor: 'bg-green-500/20 border-green-500/50',
  },
  MEDIUM: {
    color: 'text-yellow-400',
    label: 'Moyen',
    bgColor: 'bg-yellow-500/20 border-yellow-500/50',
  },
  HARD: {
    color: 'text-red-400',
    label: 'Difficile',
    bgColor: 'bg-red-500/20 border-red-500/50',
  },
};

export function QuizCard({ quiz, levelName, locked = false }: QuizCardProps) {
  const difficulty = difficultyConfig[quiz.difficulty];

  const cardBody = (
      <div
        className={`bg-surface border-[3px] border-border shadow-hard p-6 transition-all duration-200 ${
          locked
            ? 'opacity-60'
            : 'hover:border-accent-border'
        }`}
      >
        {locked && (
          <div className="absolute inset-0 bg-ink/80 flex items-center justify-center z-10">
            <Lock className="w-10 h-10 text-text-secondary" />
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-display font-bold text-text-primary mb-2">
              {quiz.title}
            </h3>
            {quiz.description && (
              <p className="text-sm text-text-secondary line-clamp-2">
                {quiz.description}
              </p>
            )}
          </div>
          {quiz.passed && (
            <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 ml-3" />
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 border-[3px] text-xs font-semibold uppercase tracking-wide ${difficulty.bgColor} ${difficulty.color}`}
            >
              {difficulty.label}
            </span>
            {quiz.timeLimit && (
              <div className="flex items-center gap-1 text-text-secondary text-xs">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(quiz.timeLimit / 60)} min</span>
              </div>
            )}
            {levelName && (
              <span className="text-xs text-text-secondary">{levelName}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {locked && (
              <span className="px-2 py-1 bg-surface-dimmed text-text-secondary text-xs font-semibold uppercase tracking-wide border-[3px] border-border-dimmed flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Verrouillé
              </span>
            )}
            {!locked && !quiz.attempted && !quiz.passed && (
              <span className="px-2 py-1 bg-accent text-on-accent text-xs font-semibold uppercase tracking-wide border-[3px] border-accent-border flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Nouveau
              </span>
            )}
            {!locked && quiz.passed && (
              <span className="px-2 py-1 bg-success-surface text-success text-xs font-semibold uppercase tracking-wide border-[3px] border-success">
                ✓ Réussi
              </span>
            )}
          </div>
        </div>

        {quiz.passingScore && (
          <div className="mt-3 text-xs text-text-secondary">
            Score minimum requis : {quiz.passingScore}%
          </div>
        )}
      </div>
  );

  // Verrouillé : pas de Link du tout (plutôt qu'un onClick qui intercepte la
  // navigation) pour que ce composant reste un Server Component, y compris
  // rendu depuis une page serveur.
  if (locked) {
    return (
      <div className="block group relative cursor-not-allowed">{cardBody}</div>
    );
  }

  return (
    <Link href={`/dashboard/quiz/${quiz.id}`} className="block group relative">
      {cardBody}
    </Link>
  );
}
