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
      return 'text-red-500 bg-red-500/20 border-red-500/50';
    }
    if (timeLeft <= 30) {
      return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
    }
    return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
  };

  const percentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`rounded-lg border-2 p-4 transition-all duration-300 ${getColorClass()}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {timeLeft <= 30 ? (
              <AlertCircle className="w-5 h-5 animate-pulse" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold">Temps restant</span>
          </div>
          <span className="text-2xl font-bold tabular-nums">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft <= 10
                ? 'bg-red-500'
                : timeLeft <= 30
                ? 'bg-orange-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {timeLeft <= 10 && (
          <p className="text-xs text-red-400 mt-2 font-semibold animate-pulse">
            ⚠️ Temps critique !
          </p>
        )}
      </div>
    </div>
  );
}

