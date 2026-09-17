import { prisma } from '@/lib/prisma';
import { Difficulty, Division } from '@prisma/client';

export interface LevelData {
  id: string;
  name: string;
  description: string | null;
  order: number;
  minDivision: Division;
  quizzes: {
    id: string;
    title: string;
    description: string | null;
    difficulty: Difficulty;
    timeLimit: number | null;
    passingScore: number;
    questionCount: number;
  }[];
}

const quizSelect = {
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
} as const;

function formatLevel(level: {
  id: string;
  name: string;
  description: string | null;
  order: number;
  minDivision: Division;
  quizzes: {
    id: string;
    title: string;
    description: string | null;
    difficulty: Difficulty;
    timeLimit: number | null;
    passingScore: number;
    _count: { questions: number };
  }[];
}): LevelData {
  return {
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
  };
}

// Partagé entre /api/levels et les pages Server Component qui affichent les
// niveaux, pour ne garder qu'un seul endroit où le formatage est fait.
export async function getLevels(): Promise<LevelData[]> {
  const levels = await prisma.level.findMany({
    orderBy: {
      order: 'asc',
    },
    include: {
      quizzes: {
        select: quizSelect,
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  return levels.map(formatLevel);
}

export async function getLevelById(id: string): Promise<LevelData | null> {
  const level = await prisma.level.findUnique({
    where: { id },
    include: {
      quizzes: {
        select: quizSelect,
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  return level ? formatLevel(level) : null;
}
