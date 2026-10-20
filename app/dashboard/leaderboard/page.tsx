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

  // Hors du top 100 affiché, un numéro de rang isolé ne dit rien de la
  // compétition : on va chercher les joueurs juste autour du rang réel du
  // joueur, pour qu'il voie qui le précède et le suit (PRODUCT.md : la
  // compétition comme moteur de rétention).
  const NEARBY_RADIUS = 5;
  const nearbyPlayers =
    userPosition && !currentUserEntry
      ? (
          await getLeaderboard({
            skip: Math.max(0, userPosition - 1 - NEARBY_RADIUS),
            limit: NEARBY_RADIUS * 2 + 1,
            currentUserId,
          })
        ).leaderboard
      : [];

  // Les trois tuiles partagent la surface standard du système (plutôt que
  // des teintes Tailwind brutes hors-token, ou l'or de l'accent en grand
  // aplat sur la tuile #1 -- une entorse non documentée à la Règle du Seul
  // Accent) : l'identité or/argent/bronze est portée par la médaille
  // RankMedal elle-même, pas par le fond de la carte. Seules la taille et la
  // position (tuile centrale plus grande, surélevée) distinguent les rangs.
  const podiumTileClass = 'bg-surface border-[3px] shadow-hard text-center';

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
        <p className="text-xs text-text-secondary mt-2">
          À score total égal, le nombre de quiz complétés départage.
        </p>
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
                <div className={`${podiumTileClass} border-border p-6`}>
                  <RankMedal rank={2} className="w-16 h-16 mx-auto mb-3" />
                  <div className="font-bold text-lg mb-2 text-text-secondary">#{top3[1].rank}</div>
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
                  <div className="text-sm text-text-secondary">
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
                <div className={`${podiumTileClass} p-8 relative border-accent-border`}>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <PixelIcon name="Crown" className="w-8 h-8 text-accent" />
                  </div>
                  <RankMedal rank={1} className="w-20 h-20 mx-auto mb-4" />
                  <div className="font-bold text-xl mb-3 text-text-secondary">#{top3[0].rank}</div>
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
                  <div className="text-base font-semibold text-text-secondary">
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
                <div className={`${podiumTileClass} border-border p-6`}>
                  <RankMedal rank={3} className="w-16 h-16 mx-auto mb-3" />
                  <div className="font-bold text-lg mb-2 text-text-secondary">#{top3[2].rank}</div>
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
                  <div className="text-sm text-text-secondary">
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

      {/* Autour de toi : si le joueur est hors du top 100 affiché, montrer
          qui le précède et le suit plutôt qu'un simple numéro isolé. */}
      {userPosition && !currentUserEntry && (
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-4 flex items-center gap-2">
            <PixelIcon name="TrendingUp" className="w-6 h-6 text-accent" />
            Autour de toi — #{userPosition} sur {total} joueurs
          </h2>
          {nearbyPlayers.length > 0 && <LeaderboardTable leaderboard={nearbyPlayers} />}
        </div>
      )}
    </div>
  );
}
