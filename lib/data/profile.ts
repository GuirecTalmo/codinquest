import { prisma } from '@/lib/prisma';
import { Division } from '@prisma/client';

export interface UserProfileData {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  stats: {
    division: Division;
    divisionPoints: number;
    totalScore: number;
    quizzesCompleted: number;
    successRate: number;
  };
}

// Partagé entre /api/user/profile et les pages Server Component qui ont
// besoin du profil, pour ne garder qu'un seul endroit où le taux de réussite
// est calculé (voir la règle produit : jamais recalculé côté client).
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      division: true,
      divisionPoints: true,
      totalScore: true,
      quizzesCompleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) return null;

  // Taux de réussite = part des quiz distincts tentés que l'utilisateur a
  // fini par réussir (cohérent avec quizzesCompleted, qui ne compte que
  // les réussites distinctes depuis le fix anti-farming)
  const attemptedQuizIds = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    select: { quizId: true },
    distinct: ['quizId'],
  });
  const distinctQuizzesAttempted = attemptedQuizIds.length;
  const successRate =
    distinctQuizzesAttempted > 0
      ? Math.round((user.quizzesCompleted / distinctQuizzesAttempted) * 100)
      : 0;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    stats: {
      division: user.division,
      divisionPoints: user.divisionPoints,
      totalScore: user.totalScore,
      quizzesCompleted: user.quizzesCompleted,
      successRate,
    },
  };
}
