'use client';

import { DivisionBadge } from './DivisionBadge';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  division: string;
  totalScore: number;
  quizzesCompleted: number;
  isCurrentUser: boolean;
}

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string | null;
}

export function LeaderboardTable({
  leaderboard,
  currentUserId,
}: LeaderboardTableProps) {
  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-lg border border-gray-700 shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Quiz complétés
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {leaderboard.map((entry, index) => {
                const medal = getMedal(entry.rank);
                const isEven = index % 2 === 0;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-blue-900/30 border-l-4 border-l-blue-500'
                        : isEven
                        ? 'bg-gray-800'
                        : 'bg-gray-800/50'
                    } ${
                      entry.isCurrentUser
                        ? 'hover:bg-blue-900/40'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {medal ? (
                          <span className="text-2xl">{medal}</span>
                        ) : (
                          <span className="text-sm font-medium text-gray-300">
                            #{entry.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {entry.name}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="text-xs text-blue-400 font-semibold mt-1">
                            (Vous)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DivisionBadge
                        division={entry.division as any}
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold text-white">
                        {entry.totalScore.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm text-gray-300">
                        {entry.quizzesCompleted}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400">Aucun joueur dans le classement</p>
        </div>
      )}
    </div>
  );
}

