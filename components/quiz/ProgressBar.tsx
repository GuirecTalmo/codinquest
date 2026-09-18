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
        <span className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          Progression vers la prochaine division
        </span>
        <span className="text-sm font-semibold text-text-primary">
          {current}/{total} quiz réussis
        </span>
      </div>
      <div className="w-full bg-surface-dimmed border-[3px] border-border h-3 overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <p className="text-xs text-text-secondary mt-1">
        {current < total
          ? `${total - current} réussite${total - current > 1 ? 's' : ''} restante${total - current > 1 ? 's' : ''} pour la promotion`
          : 'Promotion disponible !'}
      </p>
    </div>
  );
}
