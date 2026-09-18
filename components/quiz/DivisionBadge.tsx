import { Division } from '@prisma/client';
import { Award, Trophy, Gem, Crown, Star } from 'lucide-react';

interface DivisionBadgeProps {
  division: Division;
  size?: 'sm' | 'md' | 'lg';
}

const divisionConfig: Record<
  Division,
  { bgColor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  BRONZE: {
    bgColor: 'bg-amber-700',
    icon: Award,
  },
  SILVER: {
    bgColor: 'bg-gray-400',
    icon: Award,
  },
  GOLD: {
    bgColor: 'bg-yellow-500',
    icon: Trophy,
  },
  PLATINE: {
    bgColor: 'bg-cyan-400',
    icon: Gem,
  },
  DIAMOND: {
    bgColor: 'bg-blue-500',
    icon: Gem,
  },
  MASTER: {
    bgColor: 'bg-purple-600',
    icon: Crown,
  },
  CHALLENGER: {
    bgColor: 'bg-red-600',
    icon: Star,
  },
};

export function DivisionBadge({ division, size = 'md' }: DivisionBadgeProps) {
  const config = divisionConfig[division];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`${config.bgColor} text-on-ink border-[3px] border-ink px-3 py-1.5 flex items-center gap-2 shadow-hard font-semibold uppercase tracking-wide ${sizeClasses[size]}`}
    >
      <Icon className={iconSizes[size]} />
      <span>{division}</span>
    </div>
  );
}
