'use client';

import { useState, useEffect } from 'react';
import { DivisionBadge } from '@/components/quiz/DivisionBadge';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { StatCard } from '@/components/quiz/StatCard';
import { QuizCard } from '@/components/quiz/QuizCard';
import { isDivisionAtLeast } from '@/lib/quiz/divisions';
import { Trophy, CheckCircle2, Target, Loader2, AlertCircle, Lock } from 'lucide-react';
import { Division } from '@prisma/client';

interface UserProfile {
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
  };
  stats: {
    division: Division;
    divisionPoints: number;
    totalScore: number;
    quizzesCompleted: number;
  };
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimit: number | null;
  passingScore: number;
  questionCount: number;
}

interface Level {
  id: string;
  name: string;
  description: string | null;
  order: number;
  minDivision: Division;
  quizzes: Quiz[];
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer le profil et les niveaux en parallèle
      const [profileRes, levelsRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/levels'),
      ]);

      if (!profileRes.ok || !levelsRes.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const profileData = await profileRes.json();
      const levelsData = await levelsRes.json();

      setProfile(profileData);
      setLevels(levelsData.levels || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Calculer le taux de réussite (basé sur les tentatives réussies)
  // Pour l'instant, on peut l'estimer ou le mettre à 0 si pas encore calculé
  const successRate = profile?.stats.quizzesCompleted
    ? Math.round((profile.stats.divisionPoints / profile.stats.quizzesCompleted) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement...</p>
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
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Section Profil */}
      <section className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Bienvenue, {profile.user.name || profile.user.email} !
            </h1>
            <p className="text-gray-400">
              Continuez à progresser et atteignez de nouvelles divisions
            </p>
          </div>
          <DivisionBadge division={profile.stats.division} size="lg" />
        </div>
        <ProgressBar
          current={profile.stats.divisionPoints}
          total={3}
          division={profile.stats.division}
        />
      </section>

      {/* Section Statistiques */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Score Total"
            value={profile.stats.totalScore.toLocaleString()}
            icon={Trophy}
            color="text-yellow-400"
          />
          <StatCard
            label="Quiz Complétés"
            value={profile.stats.quizzesCompleted}
            icon={CheckCircle2}
            color="text-green-400"
          />
          <StatCard
            label="Taux de Réussite"
            value={`${successRate}%`}
            icon={Target}
            color="text-blue-400"
          />
        </div>
      </section>

      {/* Section Niveaux */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Niveaux</h2>
        <div className="space-y-8">
          {levels.map((level) => {
            const locked = !isDivisionAtLeast(profile.stats.division, level.minDivision);

            return (
              <div key={level.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold text-white">{level.name}</h3>
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      Niveau {level.order}
                    </span>
                    {locked && (
                      <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/20 border border-red-500/50 px-2 py-1 rounded-full">
                        <Lock className="w-3 h-3" />
                        Division {level.minDivision} requise
                      </span>
                    )}
                  </div>
                  {level.description && (
                    <p className="text-gray-400 text-sm">{level.description}</p>
                  )}
                </div>

                {level.quizzes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {level.quizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={{
                          id: quiz.id,
                          title: quiz.title,
                          description: quiz.description,
                          difficulty: quiz.difficulty,
                          timeLimit: quiz.timeLimit,
                          passingScore: quiz.passingScore,
                          passed: false, // À déterminer depuis l'historique
                          attempted: false, // À déterminer depuis l'historique
                        }}
                        levelName={level.name}
                        locked={locked}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Aucun quiz disponible pour ce niveau
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

