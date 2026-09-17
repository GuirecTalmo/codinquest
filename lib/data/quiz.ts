import { prisma } from '@/lib/prisma';
import { isDivisionAtLeast } from '@/lib/quiz/divisions';
import { Difficulty, Division } from '@prisma/client';

export interface QuizForUser {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  timeLimit: number | null;
  passingScore: number;
  level: {
    id: string;
    name: string;
    order: number;
    minDivision: Division;
  };
  questions: {
    id: string;
    question: string;
    order: number;
    points: number;
    answers: {
      id: string;
      text: string;
      order: number;
      // isCorrect n'est jamais inclus, pour ne pas révéler la bonne réponse
    }[];
  }[];
}

export type QuizForUserResult =
  | { status: 'ok'; quiz: QuizForUser }
  | { status: 'not_found' }
  | { status: 'forbidden'; requiredDivision: Division };

// Partagé entre /api/quiz/[id] et la page Server Component du quiz : charge
// le quiz sans les bonnes réponses, et vérifie le gating par division.
export async function getQuizForUser(
  quizId: string,
  userId: string
): Promise<QuizForUserResult> {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
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
        orderBy: { order: 'asc' },
        include: {
          answers: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              text: true,
              order: true,
            },
          },
        },
      },
    },
  });

  if (!quiz) {
    return { status: 'not_found' };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { division: true },
  });

  if (!user || !isDivisionAtLeast(user.division, quiz.level.minDivision)) {
    return { status: 'forbidden', requiredDivision: quiz.level.minDivision };
  }

  return {
    status: 'ok',
    quiz: {
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
        })),
      })),
    },
  };
}
