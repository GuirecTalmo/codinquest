import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getLeaderboard, getUserRank } from '@/lib/data/leaderboard';
import { LeaderboardTable } from '@/components/quiz/LeaderboardTable';
import { DivisionBadge } from '@/components/quiz/DivisionBadge';
import { Trophy, Medal, Crown, TrendingUp, User } from 'lucide-react';

export default async function LeaderboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const currentUserId = session.user.id as string;

  const [{ leaderboard, total }, userPosition] = await Promise.all([
    getLeaderboard({ skip: 0, limit: 100, currentUserId }),
    getUserRank(currentUserId),
  ]);

  const top3 = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);
  const currentUserEntry = leaderboard.find((entry) => entry.isCurrentUser);

  const podiumColors = [
    'from-yellow-500 to-amber-600', // Or (1er)
    'from-gray-400 to-gray-500', // Argent (2e)
    'from-amber-600 to-amber-800', // Bronze (3e)
  ];

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
            <span>{total} joueur{total > 1 ? 's' : ''}</span>
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
                      division={top3[1].division}
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
                      division={top3[0].division}
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
                      division={top3[2].division}
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

      {/* Position actuelle si hors du top affiché (au-delà de la première page) */}
      {userPosition && !currentUserEntry && (
        <div className="sticky bottom-0 bg-gray-800 border-t-2 border-blue-500 rounded-t-lg p-4 shadow-xl z-10">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-white font-semibold">
              Tu es classé #{userPosition} sur {total} joueurs
            </span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      )}
    </div>
  );
}
