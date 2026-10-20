import { Difficulty } from '@prisma/client';
import Link from 'next/link';
import { PixelIcon } from '@/components/PixelIcon';
import { DEFAULT_PASSING_SCORE, difficultyConfig } from '@/lib/quiz/difficulty';

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
}

export function QuizCard({ quiz, levelName }: QuizCardProps) {
  const difficulty = difficultyConfig[quiz.difficulty];

  const cardBody = (
      <div className="bg-surface border-[3px] border-border shadow-hard p-6 transition-all duration-200 hover:border-accent-border hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
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
            <PixelIcon name="CheckCircle2" className="w-6 h-6 text-success flex-shrink-0 ml-3" />
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
                <PixelIcon name="Clock" className="w-4 h-4" />
                <span>{Math.floor(quiz.timeLimit / 60)} min</span>
              </div>
            )}
            {levelName && (
              <span className="text-xs text-text-secondary">{levelName}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!quiz.attempted && !quiz.passed && (
              <span className="px-2 py-1 bg-accent text-on-accent text-xs font-semibold uppercase tracking-wide border-[3px] border-accent-border flex items-center gap-1">
                <PixelIcon name="Zap" className="w-3 h-3" />
                Nouveau
              </span>
            )}
            {quiz.passed && (
              <span className="px-2 py-1 bg-success-surface text-success text-xs font-semibold uppercase tracking-wide border-[3px] border-success flex items-center gap-1">
                <PixelIcon name="CheckCircle2" className="w-3 h-3" />
                Réussi
              </span>
            )}
          </div>
        </div>

        {quiz.passingScore != null && quiz.passingScore !== DEFAULT_PASSING_SCORE && (
          <div className="mt-3 text-xs text-text-secondary">
            Score minimum requis : {quiz.passingScore}%
          </div>
        )}
      </div>
  );

  return (
    <Link
      href={`/dashboard/quiz/${quiz.id}`}
      className="block group relative focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
    >
      {cardBody}
    </Link>
  );
}
