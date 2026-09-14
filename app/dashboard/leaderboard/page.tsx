'use client';

import { useState, useEffect } from 'react';
import { LeaderboardTable } from '@/components/quiz/LeaderboardTable';
import { DivisionBadge } from '@/components/quiz/DivisionBadge';
import {
  Loader2,
  AlertCircle,
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  User,
} from 'lucide-react';
import { Division } from '@prisma/client';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  division: string;
  totalScore: number;
  quizzesCompleted: number;
  isCurrentUser: boolean;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  total: number;
  limit: number;
  skip: number;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer le profil utilisateur pour connaître l'ID
      const profileRes = await fetch('/api/user/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setCurrentUserId(profileData.user.id);
      }

      // Récupérer le leaderboard
      const leaderboardRes = await fetch('/api/leaderboard?limit=100');
      if (!leaderboardRes.ok) {
        throw new Error('Erreur lors du chargement du classement');
      }

      const data: LeaderboardData = await leaderboardRes.json();
      setLeaderboardData(data);

      // Trouver la position de l'utilisateur
      const currentUserEntry = data.leaderboard.find((entry) => entry.isCurrentUser);
      if (currentUserEntry) {
        setUserPosition(currentUserEntry.rank);
      } else {
        // Si l'utilisateur n'est pas dans le top 100, récupérer toutes les entrées
        const allRes = await fetch('/api/leaderboard?limit=1000');
        if (allRes.ok) {
          const allData = await allRes.json();
          const userEntry = allData.leaderboard.find(
            (entry: LeaderboardEntry) => entry.id === currentUserId
          );
          if (userEntry) {
            setUserPosition(userEntry.rank);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement du classement...</p>
        </div>
      </div>
    );
  }

  if (error || !leaderboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error || 'Erreur de chargement'}</p>
          <button
            onClick={fetchLeaderboardData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const top3 = leaderboardData.leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboardData.leaderboard.slice(3);
  const currentUserEntry = leaderboardData.leaderboard.find(
    (entry) => entry.isCurrentUser
  );

  const podiumColors = [
    'from-yellow-500 to-amber-600', // Or (1er)
    'from-gray-400 to-gray-500', // Argent (2e)
    'from-amber-600 to-amber-800', // Bronze (3e)
  ];

  const podiumHeights = ['h-48', 'h-40', 'h-44']; // Plus haut, moyen, plus bas
  const medalEmojis = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Trophy className="w-10 h-10 text-yellow-500" />
          Classement Mondial
        </h1>
        <div className="flex items-center justify-center gap-6 text-gray-400">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{leaderboardData.total} joueur{leaderboardData.total > 1 ? 's' : ''}</span>
          </div>
          {userPosition && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Tu es classé #{userPosition}</span>
            </div>
          )}
        </div>
      </div>

      {/* Podium (Top 3) */}
      {top3.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border-2 border-yellow-500/30 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Top 3
          </h2>
          
          <div className="flex items-end justify-center gap-4 mb-6">
            {/* 2ème place */}
            {top3[1] && (
              <div className="flex-1 max-w-[280px]">
                <div className={`bg-gradient-to-b ${podiumColors[1]} rounded-t-lg p-6 text-center transform transition-all duration-300 hover:scale-105 shadow-xl border-2 border-gray-400/50`}>
                  <div className="text-6xl mb-3">{medalEmojis[1]}</div>
                  <div className="text-white font-bold text-lg mb-2">#{top3[1].rank}</div>
                  <div className="text-white font-semibold text-xl mb-2 truncate">
                    {top3[1].name}
                  </div>
                  <div className="mb-3">
                    <DivisionBadge
                      division={top3[1].division as Division}
                      size="sm"
                    />
                  </div>
                  <div className="text-white font-bold text-2xl mb-1">
                    {top3[1].totalScore.toLocaleString()}
                  </div>
                  <div className="text-gray-200 text-sm">
                    {top3[1].quizzesCompleted} quiz
                  </div>
                  {top3[1].isCurrentUser && (
                    <div className="mt-3 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      C'est toi !
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 1ère place */}
            {top3[0] && (
              <div className="flex-1 max-w-[300px]">
                <div className={`bg-gradient-to-b ${podiumColors[0]} rounded-t-lg p-8 text-center transform transition-all duration-300 hover:scale-105 shadow-2xl border-2 border-yellow-400/50 relative`}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Crown className="w-8 h-8 text-yellow-300" />
                  </div>
                  <div className="text-7xl mb-4">{medalEmojis[0]}</div>
                  <div className="text-white font-bold text-xl mb-3">#{top3[0].rank}</div>
                  <div className="text-white font-bold text-2xl mb-3 truncate">
                    {top3[0].name}
                  </div>
                  <div className="mb-4">
                    <DivisionBadge
                      division={top3[0].division as Division}
                      size="md"
                    />
                  </div>
                  <div className="text-white font-bold text-3xl mb-2">
                    {top3[0].totalScore.toLocaleString()}
                  </div>
                  <div className="text-gray-100 text-base font-semibold">
                    {top3[0].quizzesCompleted} quiz complétés
                  </div>
                  {top3[0].isCurrentUser && (
                    <div className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                      C'est toi !
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3ème place */}
            {top3[2] && (
              <div className="flex-1 max-w-[280px]">
                <div className={`bg-gradient-to-b ${podiumColors[2]} rounded-t-lg p-6 text-center transform transition-all duration-300 hover:scale-105 shadow-xl border-2 border-amber-600/50`}>
                  <div className="text-6xl mb-3">{medalEmojis[2]}</div>
                  <div className="text-white font-bold text-lg mb-2">#{top3[2].rank}</div>
                  <div className="text-white font-semibold text-xl mb-2 truncate">
                    {top3[2].name}
                  </div>
                  <div className="mb-3">
                    <DivisionBadge
                      division={top3[2].division as Division}
                      size="sm"
                    />
                  </div>
                  <div className="text-white font-bold text-2xl mb-1">
                    {top3[2].totalScore.toLocaleString()}
                  </div>
                  <div className="text-gray-200 text-sm">
                    {top3[2].quizzesCompleted} quiz
                  </div>
                  {top3[2].isCurrentUser && (
                    <div className="mt-3 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      C'est toi !
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tableau classement (rang 4+) */}
      {restOfLeaderboard.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Medal className="w-6 h-6 text-gray-400" />
            Classement complet
          </h2>
          <LeaderboardTable
            leaderboard={restOfLeaderboard}
            currentUserId={currentUserId}
          />
        </div>
      )}

      {/* Position actuelle si > 100 */}
      {userPosition && userPosition > 100 && !currentUserEntry && (
        <div className="sticky bottom-0 bg-gray-800 border-t-2 border-blue-500 rounded-t-lg p-4 shadow-xl z-10">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-white font-semibold">
              Tu es classé #{userPosition} sur {leaderboardData.total} joueurs
            </span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      )}
    </div>
  );
}

