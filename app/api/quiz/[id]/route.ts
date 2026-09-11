import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isDivisionAtLeast } from "@/lib/quiz/divisions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier que l'utilisateur est authentifié
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer l'ID du quiz depuis les params
    const { id } = await params;

    // Récupérer le quiz avec ses questions et réponses
    const quiz = await prisma.quiz.findUnique({
      where: {
        id,
      },
      include: {
        level: {
          select: {
            id: true,
            name: true,
            order: true,
            minDivision: true,
          },
        },
        questions: {
          orderBy: {
            order: "asc",
          },
          include: {
            answers: {
              orderBy: {
                order: "asc",
              },
              select: {
                id: true,
                text: true,
                order: true,
                // IMPORTANT : Ne pas révéler isCorrect
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz non trouvé" }, { status: 404 });
    }

    // Vérifier que la division de l'utilisateur permet d'accéder à ce niveau
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { division: true },
    });

    if (!user || !isDivisionAtLeast(user.division, quiz.level.minDivision)) {
      return NextResponse.json(
        { error: "Division insuffisante pour accéder à ce quiz" },
        { status: 403 }
      );
    }

    // Formater la réponse sans révéler les réponses correctes
    const formattedQuiz = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      level: {
        id: quiz.level.id,
        name: quiz.level.name,
        order: quiz.level.order,
        minDivision: quiz.level.minDivision,
      },
      questions: quiz.questions.map((question) => ({
        id: question.id,
        question: question.question,
        order: question.order,
        points: question.points,
        answers: question.answers.map((answer) => ({
          id: answer.id,
          text: answer.text,
          order: answer.order,
          // isCorrect n'est PAS inclus pour ne pas révéler la bonne réponse
        })),
      })),
    };

    return NextResponse.json({
      quiz: formattedQuiz,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du quiz:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération du quiz" },
      { status: 500 }
    );
  }
}
