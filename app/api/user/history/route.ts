import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Vérifier que l'utilisateur est authentifié
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;

    // Récupérer les query params (limit plafonné pour éviter un dump complet)
    const MAX_LIMIT = 100;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'passed' | 'failed'
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const limit = Number.isNaN(rawLimit) ? 20 : Math.min(Math.max(rawLimit, 1), MAX_LIMIT);

    // Construire les filtres
    const where: {
      userId: string;
      isPassed?: boolean;
    } = {
      userId,
    };

    if (status === 'passed') {
      where.isPassed = true;
    } else if (status === 'failed') {
      where.isPassed = false;
    }

    // Récupérer l'historique des tentatives
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

    // Formater la réponse
    const formattedAttempts = attempts.map((attempt) => ({
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

    return NextResponse.json({
      attempts: formattedAttempts,
      total: attempts.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération de l\'historique' },
      { status: 500 }
    );
  }
}

