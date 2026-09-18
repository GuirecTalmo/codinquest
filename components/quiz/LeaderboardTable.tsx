import { Division } from '@prisma/client';
import { DivisionBadge } from './DivisionBadge';
import { RankMedal } from './RankMedal';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  division: Division;
  totalScore: number;
  quizzesCompleted: number;
  isCurrentUser: boolean;
}

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
}

export function LeaderboardTable({
  leaderboard,
}: LeaderboardTableProps) {
  const getMedalRank = (rank: number): 1 | 2 | 3 | null => {
    if (rank === 1 || rank === 2 || rank === 3) return rank;
    return null;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border-[3px] border-border shadow-hard">
          <table className="min-w-full divide-y-[3px] divide-border">
            <thead className="bg-ink">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-ink uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-ink uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-on-ink uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-on-ink uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-on-ink uppercase tracking-wider">
                  Quiz complétés
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y-[3px] divide-border">
              {leaderboard.map((entry, index) => {
                const medalRank = getMedalRank(entry.rank);
                const isEven = index % 2 === 0;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-accent/10 border-l-[3px] border-l-accent'
                        : isEven
                        ? 'bg-surface'
                        : 'bg-surface-dimmed'
                    } ${
                      entry.isCurrentUser
                        ? 'hover:bg-accent/20'
                        : 'hover:bg-border/10'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {medalRank ? (
                          <RankMedal rank={medalRank} className="w-8 h-8" />
                        ) : (
                          <span className="text-sm font-medium text-text-secondary">
                            #{entry.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">
                          {entry.name}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="text-xs text-accent font-semibold mt-1 uppercase tracking-wide">
                            (Vous)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DivisionBadge
                        division={entry.division}
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold text-text-primary">
                        {entry.totalScore.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm text-text-secondary">
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
        <div className="text-center py-12 bg-surface border-[3px] border-border">
          <p className="text-text-secondary">Aucun joueur dans le classement</p>
        </div>
      )}
    </div>
  );
}
