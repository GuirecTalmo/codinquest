'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  ArrowRight,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { Difficulty } from '@prisma/client';

interface Attempt {
  id: string;
  score: number;
  pointsEarned: number;
  totalPoints: number;
  isPassed: boolean;
  timeSpent: number | null;
  startedAt: string;
  completedAt: string;
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

export default function HistoryPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const status = filter === 'all' ? null : filter;
      const url = status
        ? `/api/user/history?status=${status}`
        : '/api/user/history';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'historique');
      }

      const data = await response.json();
      setAttempts(data.attempts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatTimeSpent = (seconds: number | null): string => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'HARD':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'EASY':
        return 'Facile';
      case 'MEDIUM':
        return 'Moyen';
      case 'HARD':
        return 'Difficile';
      default:
        return difficulty;
    }
  };

  const filteredAttempts = attempts;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mon Historique</h1>
          <p className="text-gray-400">
            {filteredAttempts.length} tentative{filteredAttempts.length > 1 ? 's' : ''}
            {filter === 'passed' && ' réussie' + (filteredAttempts.length > 1 ? 's' : '')}
            {filter === 'failed' && ' échouée' + (filteredAttempts.length > 1 ? 's' : '')}
          </p>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('passed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'passed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Réussis
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'failed'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Échoués
          </button>
        </div>
      </div>

      {/* Liste des tentatives */}
      {filteredAttempts.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Aucun quiz complété pour le moment
          </h2>
          <p className="text-gray-400 mb-6">
            Commencez votre parcours en passant votre premier quiz !
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Commencer un quiz
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAttempts.map((attempt) => (
            <div
              key={attempt.id}
              className={`bg-gray-800 rounded-lg p-6 border-2 transition-all hover:shadow-lg ${
                attempt.isPassed
                  ? 'border-green-500/50 hover:border-green-500'
                  : 'border-red-500/50 hover:border-red-500'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    {attempt.isPassed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {attempt.quiz.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          {attempt.quiz.level.name}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                            attempt.quiz.difficulty
                          )}`}
                        >
                          {getDifficultyLabel(attempt.quiz.difficulty)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 ml-9">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(attempt.completedAt)}
                    </span>
                    {attempt.timeSpent && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimeSpent(attempt.timeSpent)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score et points */}
                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`px-4 py-2 rounded-lg font-bold text-lg ${
                      attempt.isPassed
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {attempt.score}%
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      {attempt.pointsEarned}/{attempt.totalPoints} points
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Score min: {attempt.quiz.passingScore}%
                  </div>
                </div>
              </div>

              {/* Barre de progression du score */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Score</span>
                  <span className="text-xs text-gray-400">
                    {attempt.score >= attempt.quiz.passingScore ? '✓ Réussi' : '✗ Échoué'}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      attempt.isPassed ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(attempt.score, 100)}%`,
                    }}
                  />
                  {/* Ligne de score minimum */}
                  <div
                    className="h-full w-0.5 bg-yellow-400 absolute top-0"
                    style={{
                      marginLeft: `${attempt.quiz.passingScore}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

