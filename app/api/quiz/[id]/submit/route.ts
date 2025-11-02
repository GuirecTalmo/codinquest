import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { quizSubmissionSchema } from '@/lib/quiz/validations';
import { calculateScore, checkIfPassed } from '@/lib/quiz/score';
import { Division } from '@prisma/client';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: quizId } = await params;

    // Récupérer le body de la requête
    const body = await request.json();

    // Valider les données avec Zod
    const validationResult = quizSubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { answers, timeSpent } = validationResult.data;

    // Récupérer le quiz avec ses questions et réponses correctes
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            answers: {
              where: { isCorrect: true },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz non trouvé' },
        { status: 404 }
      );
    }

    // Préparer les données pour le calcul du score
    const questionsWithCorrectAnswers = quiz.questions.map((q) => ({
      id: q.id,
      points: q.points,
      correctAnswerId: q.answers[0]?.id || '', // Première réponse correcte (normalement il n'y en a qu'une)
    }));

    // Calculer le score
    const score = calculateScore(answers, questionsWithCorrectAnswers);
    const isPassed = checkIfPassed(score, quiz.passingScore);

    // Calculer les points totaux
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const pointsEarned = quiz.questions.reduce((sum, q) => {
      const userAnswer = answers.find((a) => a.questionId === q.id);
      const isCorrect = q.answers.some((a) => a.id === userAnswer?.answerId);
      return sum + (isCorrect ? q.points : 0);
    }, 0);

    // Créer la tentative de quiz et les réponses utilisateur dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer la tentative
      const attempt = await tx.quizAttempt.create({
        data: {
          userId,
          quizId,
          score,
          pointsEarned,
          totalPoints,
          isPassed,
          timeSpent: timeSpent || null,
        },
      });

      // Créer les réponses utilisateur
      await tx.userAnswer.createMany({
        data: answers.map((answer) => ({
          attemptId: attempt.id,
          questionId: answer.questionId,
          answerId: answer.answerId,
        })),
      });

      // Si réussi, incrémenter divisionPoints et mettre à jour les stats
      const updateData: {
        quizzesCompleted: { increment: number };
        totalScore: { increment: number };
        divisionPoints?: { increment: number };
      } = {
        quizzesCompleted: { increment: 1 },
        totalScore: { increment: pointsEarned },
      };

      if (isPassed) {
        updateData.divisionPoints = { increment: 1 };
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          division: true,
          divisionPoints: true,
        },
      });

      // Vérifier si promotion nécessaire (après incrément, divisionPoints peut être >= 3)
      let newDivision: string | null = null;
      if (isPassed && updatedUser.divisionPoints >= 3) {
        const currentDivision = updatedUser.division;
        // Vérifier et promouvoir si nécessaire
        const divisionOrder = ['BRONZE', 'SILVER', 'GOLD', 'PLATINE', 'DIAMOND', 'MASTER', 'CHALLENGER'];
        const currentIndex = divisionOrder.indexOf(currentDivision as Division);
        if (currentIndex < divisionOrder.length - 1) {
          const nextDivision = divisionOrder[currentIndex + 1] as Division;
          await tx.user.update({
            where: { id: userId },
            data: {
              division: nextDivision,
              divisionPoints: 0,
            },
          });
          newDivision = nextDivision;
        }
      }

      return { attempt, newDivision };
    });

    // Préparer les réponses correctes pour le retour
    const correctAnswers = quiz.questions.map((q) => ({
      questionId: q.id,
      correctAnswerId: q.answers[0]?.id || null,
    }));

    return NextResponse.json({
      success: true,
      score,
      isPassed,
      pointsEarned,
      totalPoints,
      division: result.newDivision || undefined,
      correctAnswers,
    });
  } catch (error) {
    console.error('Erreur lors de la soumission du quiz:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la soumission du quiz' },
      { status: 500 }
    );
  }
}

