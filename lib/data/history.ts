import { prisma } from '@/lib/prisma';
import { Difficulty } from '@prisma/client';

export interface AttemptData {
  id: string;
  score: number;
  pointsEarned: number;
  totalPoints: number;
  isPassed: boolean;
  timeSpent: number | null;
  startedAt: Date;
  completedAt: Date;
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

// Partagé entre /api/user/history et les pages Server Component.
export async function getUserHistory(
  userId: string,
  options: { status?: 'passed' | 'failed' | null; limit?: number } = {}
): Promise<AttemptData[]> {
  const { status = null, limit = 20 } = options;

  const where: { userId: string; isPassed?: boolean } = { userId };
  if (status === 'passed') {
    where.isPassed = true;
  } else if (status === 'failed') {
    where.isPassed = false;
  }

  const attempts = await prisma.quizAttempt.findMany({
    where,
    take: limit,
    orderBy: {
      completedAt: 'desc',
    },
    include: {
      quiz: {
        include: {
          level: {
            select: {
              id: true,
              name: true,
              order: true,
            },
          },
        },
      },
    },
  });

  return attempts.map((attempt) => ({
    id: attempt.id,
    score: attempt.score,
    pointsEarned: attempt.pointsEarned,
    totalPoints: attempt.totalPoints,
    isPassed: attempt.isPassed,
    timeSpent: attempt.timeSpent,
    startedAt: attempt.startedAt,
    completedAt: attempt.completedAt,
    quiz: {
      id: attempt.quiz.id,
      title: attempt.quiz.title,
      description: attempt.quiz.description,
      difficulty: attempt.quiz.difficulty,
      passingScore: attempt.quiz.passingScore,
      level: {
        id: attempt.quiz.level.id,
        name: attempt.quiz.level.name,
        order: attempt.quiz.level.order,
      },
    },
  }));
}
