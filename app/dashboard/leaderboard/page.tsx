import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getLeaderboard, getUserRank } from '@/lib/data/leaderboard';
import { LeaderboardTable } from '@/components/quiz/LeaderboardTable';
import { DivisionBadge } from '@/components/quiz/DivisionBadge';
import { RankMedal } from '@/components/quiz/RankMedal';
import { PixelIcon } from '@/components/PixelIcon';

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

  // Couleurs plates par rang (reprend les teintes déjà utilisées par
  // DivisionBadge -- bronze/argent/or -- plutôt qu'un dégradé).
  const podiumStyles = [
    'bg-accent border-accent-border text-on-accent', // Or (1er)
    'bg-gray-400 border-ink text-on-ink', // Argent (2e)
    'bg-amber-700 border-ink text-on-ink', // Bronze (3e)
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-text-primary mb-2 flex items-center justify-center gap-3">
          <PixelIcon name="Trophy" className="w-10 h-10 text-accent" />
          Classement Mondial
        </h1>
        <div className="flex items-center justify-center gap-6 text-text-secondary">
          <div className="flex items-center gap-2">
            <PixelIcon name="User" className="w-5 h-5" />
            <span>{total} joueur{total > 1 ? 's' : ''}</span>
          </div>
          {userPosition && (
            <div className="flex items-center gap-2">
              <PixelIcon name="TrendingUp" className="w-5 h-5" />
              <span>Tu es classé #{userPosition}</span>
            </div>
          )}
        </div>
      </div>

      {/* Podium (Top 3) */}
      {top3.length > 0 && (
        <div className="bg-surface border-[3px] border-accent-border shadow-hard p-8">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-6 text-center flex items-center justify-center gap-2">
            <PixelIcon name="Crown" className="w-6 h-6 text-accent" />
            Top 3
          </h2>

          <div className="flex items-end justify-center gap-4 mb-6">
            {/* 2ème place */}
            {top3[1] && (
              <div className="flex-1 max-w-[280px]">
                <div className={`border-[3px] shadow-hard p-6 text-center ${podiumStyles[1]}`}>
                  <RankMedal rank={2} className="w-16 h-16 mx-auto mb-3" />
                  <div className="font-bold text-lg mb-2">#{top3[1].rank}</div>
                  <div className="font-semibold text-xl mb-2 truncate">
                    {top3[1].name}
                  </div>
                  <div className="mb-3">
                    <DivisionBadge
                      division={top3[1].division}
                      size="sm"
                    />
                  </div>
                  <div className="font-bold text-2xl mb-1">
                    {top3[1].totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm">
                    {top3[1].quizzesCompleted} quiz
                  </div>
                  {top3[1].isCurrentUser && (
                    <div className="mt-3 px-3 py-1 bg-ink text-on-ink text-xs font-semibold uppercase tracking-wide border-[3px] border-ink inline-block">
                      C&apos;est toi !
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 1ère place */}
            {top3[0] && (
              <div className="flex-1 max-w-[300px]">
                <div className={`border-[3px] shadow-hard p-8 text-center relative ${podiumStyles[0]}`}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <PixelIcon name="Crown" className="w-8 h-8 text-accent" />
                  </div>
                  <RankMedal rank={1} className="w-20 h-20 mx-auto mb-4" />
                  <div className="font-bold text-xl mb-3">#{top3[0].rank}</div>
                  <div className="font-bold text-2xl mb-3 truncate">
                    {top3[0].name}
                  </div>
                  <div className="mb-4">
                    <DivisionBadge
                      division={top3[0].division}
                      size="md"
                    />
                  </div>
                  <div className="font-bold text-3xl mb-2">
                    {top3[0].totalScore.toLocaleString()}
                  </div>
                  <div className="text-base font-semibold">
                    {top3[0].quizzesCompleted} quiz complétés
                  </div>
                  {top3[0].isCurrentUser && (
                    <div className="mt-4 px-4 py-2 bg-ink text-on-ink text-sm font-semibold uppercase tracking-wide border-[3px] border-ink inline-block">
                      C&apos;est toi !
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3ème place */}
            {top3[2] && (
              <div className="flex-1 max-w-[280px]">
                <div className={`border-[3px] shadow-hard p-6 text-center ${podiumStyles[2]}`}>
                  <RankMedal rank={3} className="w-16 h-16 mx-auto mb-3" />
                  <div className="font-bold text-lg mb-2">#{top3[2].rank}</div>
                  <div className="font-semibold text-xl mb-2 truncate">
                    {top3[2].name}
                  </div>
                  <div className="mb-3">
                    <DivisionBadge
                      division={top3[2].division}
                      size="sm"
                    />
                  </div>
                  <div className="font-bold text-2xl mb-1">
                    {top3[2].totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm">
                    {top3[2].quizzesCompleted} quiz
                  </div>
                  {top3[2].isCurrentUser && (
                    <div className="mt-3 px-3 py-1 bg-ink text-on-ink text-xs font-semibold uppercase tracking-wide border-[3px] border-ink inline-block">
                      C&apos;est toi !
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
          <h2 className="text-2xl font-display font-bold text-text-primary mb-4 flex items-center gap-2">
            <PixelIcon name="Medal" className="w-6 h-6 text-text-secondary" />
            Classement complet
          </h2>
          <LeaderboardTable leaderboard={restOfLeaderboard} />
        </div>
      )}

      {/* Position actuelle si hors du top affiché (au-delà de la première page) */}
      {userPosition && !currentUserEntry && (
        <div className="sticky bottom-0 bg-surface border-[3px] border-accent shadow-hard p-4 z-10">
          <div className="flex items-center justify-center gap-3">
            <PixelIcon name="Trophy" className="w-5 h-5 text-accent" />
            <span className="text-text-primary font-semibold">
              Tu es classé #{userPosition} sur {total} joueurs
            </span>
            <PixelIcon name="TrendingUp" className="w-5 h-5 text-accent" />
          </div>
        </div>
      )}
    </div>
  );
}
