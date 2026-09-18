'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface QuizTimerProps {
  timeLimit: number; // En secondes
  onTimeUp: () => void;
  onTick?: (timeLeft: number) => void;
}

export function QuizTimer({ timeLimit, onTimeUp, onTick }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (onTick) {
          onTick(newTime);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, onTick]);

  // Formater le temps en MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Déterminer la couleur selon le temps restant
  const getColorClass = (): string => {
    if (timeLeft <= 10) {
      return 'text-error bg-error-surface border-error';
    }
    if (timeLeft <= 30) {
      return 'text-accent bg-surface-dimmed border-accent-border';
    }
    return 'text-text-primary bg-surface border-border';
  };

  const percentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`border-[3px] p-4 shadow-hard transition-all duration-300 ${getColorClass()}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {timeLeft <= 30 ? (
              <AlertCircle className="w-5 h-5 animate-pulse" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold uppercase tracking-wide">Temps restant</span>
          </div>
          <span className="text-2xl font-display font-bold tabular-nums">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-surface-dimmed border-[3px] border-border h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft <= 10
                ? 'bg-error'
                : timeLeft <= 30
                ? 'bg-accent'
                : 'bg-text-secondary'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {timeLeft <= 10 && (
          <p className="text-xs text-error mt-2 font-semibold uppercase tracking-wide animate-pulse">
            Temps critique !
          </p>
        )}
      </div>
    </div>
  );
}
