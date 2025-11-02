import { Division, Difficulty } from '@prisma/client';

// Types pour Quiz
export interface QuizWithDetails {
  id: string;
  title: string;
  description: string | null;
  levelId: string;
  difficulty: Difficulty;
  timeLimit: number | null;
  passingScore: number;
  questions: QuestionWithAnswers[];
  level: {
    id: string;
    name: string;
    order: number;
  };
}

// Types pour Question avec réponses
export interface QuestionWithAnswers {
  id: string;
  quizId: string;
  question: string;
  order: number;
  points: number;
  answers: Answer[];
}

// Types pour Answer
export interface Answer {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

// Types pour les statistiques utilisateur
export interface UserStats {
  id: string;
  email: string;
  name: string | null;
  division: Division;
  divisionPoints: number;
  totalScore: number;
  quizzesCompleted: number;
}

// Types pour une tentative de quiz
export interface QuizAttemptResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  pointsEarned: number;
  totalPoints: number;
  isPassed: boolean;
  timeSpent: number | null;
  startedAt: Date;
  completedAt: Date;
}

// Types pour la soumission de quiz
export interface QuizSubmission {
  answers: {
    questionId: string;
    answerId: string;
  }[];
  timeSpent?: number;
}

// Types pour les niveaux
export interface LevelWithQuizzes {
  id: string;
  name: string;
  description: string | null;
  order: number;
  minDivision: Division;
  quizzes: {
    id: string;
    title: string;
    difficulty: Difficulty;
  }[];
}


