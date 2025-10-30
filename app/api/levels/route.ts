import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer tous les niveaux avec leurs quiz, triés par order
    const levels = await prisma.level.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        quizzes: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            timeLimit: true,
            passingScore: true,
            _count: {
              select: {
                questions: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    // Formater la réponse
    const formattedLevels = levels.map((level) => ({
      id: level.id,
      name: level.name,
      description: level.description,
      order: level.order,
      minDivision: level.minDivision,
      quizzes: level.quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        questionCount: quiz._count.questions,
      })),
    }));

    return NextResponse.json({
      levels: formattedLevels,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des niveaux:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des niveaux' },
      { status: 500 }
    );
  }
}

