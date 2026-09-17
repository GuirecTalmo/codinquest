import { prisma } from '@/lib/prisma';
import { Division } from '@prisma/client';
import { DIVISIONS_ORDER } from '@/lib/quiz/divisions';

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  division: Division;
  totalScore: number;
  quizzesCompleted: number;
  isCurrentUser: boolean;
}

export interface LeaderboardPage {
  leaderboard: LeaderboardEntry[];
  total: number;
}

// Le tri par division s'appuie sur l'ordre natif de l'enum Postgres
// (BRONZE=1 ... CHALLENGER=7, déclaré dans ce même ordre dans schema.prisma) :
// { division: 'desc' } place donc CHALLENGER en tête, comme DIVISIONS_ORDER.
// Partagé entre /api/leaderboard et les pages Server Component.
export async function getLeaderboard(params: {
  skip: number;
  limit: number;
  currentUserId?: string | null;
}): Promise<LeaderboardPage> {
  const { skip, limit, currentUserId } = params;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        division: true,
        totalScore: true,
        quizzesCompleted: true,
      },
      orderBy: [{ division: 'desc' }, { totalScore: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  // L'email n'est jamais exposé au client : seul un nom d'affichage (nom
  // choisi, ou pseudonyme dérivé de l'email en repli) est renvoyé.
  const leaderboard = users.map((user, index) => ({
    rank: skip + index + 1,
    id: user.id,
    name: user.name || user.email.split('@')[0],
    division: user.division,
    totalScore: user.totalScore,
    quizzesCompleted: user.quizzesCompleted,
    isCurrentUser: user.id === currentUserId,
  }));

  return { leaderboard, total };
}

// Rang exact d'un utilisateur, même hors de la page de classement affichée :
// compte les utilisateurs mieux classés (division strictement supérieure, ou
// même division avec un meilleur score) plutôt que de chercher dans une liste
// tronquée.
export async function getUserRank(userId: string): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { division: true, totalScore: true },
  });

  if (!user) return null;

  const myIndex = DIVISIONS_ORDER.indexOf(user.division);
  const higherDivisions = DIVISIONS_ORDER.slice(myIndex + 1);

  const [higherDivisionCount, sameDivisionBetterScoreCount] = await Promise.all([
    higherDivisions.length > 0
      ? prisma.user.count({ where: { division: { in: higherDivisions } } })
      : Promise.resolve(0),
    prisma.user.count({
      where: { division: user.division, totalScore: { gt: user.totalScore } },
    }),
  ]);

  return higherDivisionCount + sameDivisionBetterScoreCount + 1;
}
