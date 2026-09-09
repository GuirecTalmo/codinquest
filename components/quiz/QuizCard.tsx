import { Difficulty } from '@prisma/client';
import Link from 'next/link';
import { CheckCircle2, Clock, Zap } from 'lucide-react';

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

export function QuizCard({ quiz, levelName }: QuizCardProps) {
  const difficulty = difficultyConfig[quiz.difficulty];

  return (
    <Link
      href={`/dashboard/quiz/${quiz.id}`}
      className="block group"
    >
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {quiz.title}
            </h3>
            {quiz.description && (
              <p className="text-sm text-gray-400 line-clamp-2">
                {quiz.description}
              </p>
            )}
          </div>
          {quiz.passed && (
            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 ml-3" />
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficulty.bgColor} ${difficulty.color}`}
            >
              {difficulty.label}
            </span>
            {quiz.timeLimit && (
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(quiz.timeLimit / 60)} min</span>
              </div>
            )}
            {levelName && (
              <span className="text-xs text-gray-500">{levelName}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!quiz.attempted && !quiz.passed && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/50 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Nouveau
              </span>
            )}
            {quiz.passed && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/50">
                ✓ Réussi
              </span>
            )}
          </div>
        </div>

        {quiz.passingScore && (
          <div className="mt-3 text-xs text-gray-500">
            Score minimum requis : {quiz.passingScore}%
          </div>
        )}
      </div>
    </Link>
  );
}

