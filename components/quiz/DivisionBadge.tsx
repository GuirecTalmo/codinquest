import { Division } from '@prisma/client';
import { DivisionIcon } from './DivisionIcon';

interface DivisionBadgeProps {
  division: Division;
  size?: 'sm' | 'md' | 'lg';
}

export function DivisionBadge({ division, size = 'md' }: DivisionBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`bg-surface text-text-primary border-[3px] border-border px-3 py-1.5 flex items-center gap-2 shadow-hard font-semibold uppercase tracking-wide ${sizeClasses[size]}`}
    >
      <DivisionIcon division={division} className={iconSizes[size]} />
      <span>{division}</span>
    </div>
  );
}
