import { Division } from '@prisma/client';
import { getDivisionColor } from '@/lib/quiz/divisions';

interface ProgressBarProps {
  current: number; // 0-2 (divisionPoints)
  total: number; // 3 (quiz réussis nécessaires)
  division: Division;
}

export function ProgressBar({ current, total, division }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  const color = getDivisionColor(division);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300">
          Progression vers la prochaine division
        </span>
        <span className="text-sm font-semibold text-white">
          {current}/{total} quiz réussis
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        {current < total
          ? `${total - current} réussite${total - current > 1 ? 's' : ''} restante${total - current > 1 ? 's' : ''} pour la promotion`
          : 'Promotion disponible !'}
      </p>
    </div>
  );
}

