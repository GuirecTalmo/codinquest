import { PrismaClient, Division } from '@prisma/client';
import { getNextDivision } from './divisions';

// Type pour une réponse utilisateur
interface UserAnswer {
  questionId: string;
  answerId: string;
}

// Type pour une question avec ses réponses correctes
interface QuestionWithCorrectAnswer {
  id: string;
  points: number;
  correctAnswerId: string;
}

/**
 * Calcule le score en pourcentage basé sur les réponses utilisateur
 * @param userAnswers Réponses soumises par l'utilisateur
 * @param questions Questions du quiz avec leurs bonnes réponses
 * @returns Score en pourcentage (0-100)
 */
export function calculateScore(
  userAnswers: UserAnswer[],
  questions: QuestionWithCorrectAnswer[]
): number {
  if (questions.length === 0) {
    return 0;
  }

  let pointsEarned = 0;
  let totalPoints = 0;

  // Créer un Map pour un accès rapide aux réponses utilisateur par questionId
  const userAnswersMap = new Map<string, string>();
  userAnswers.forEach((answer) => {
    userAnswersMap.set(answer.questionId, answer.answerId);
  });

  // Calculer les points pour chaque question
  questions.forEach((question) => {
    totalPoints += question.points;
    const userAnswerId = userAnswersMap.get(question.id);
    
    if (userAnswerId === question.correctAnswerId) {
      pointsEarned += question.points;
    }
  });

  // Calculer le pourcentage
  const percentage = (pointsEarned / totalPoints) * 100;
  return Math.round(percentage);
}

/**
 * Vérifie si le score est suffisant pour réussir le quiz
 * @param score Score obtenu en pourcentage
 * @param passingScore Score minimum requis pour réussir
 * @returns true si le score est >= passingScore
 */
export function checkIfPassed(score: number, passingScore: number): boolean {
  return score >= passingScore;
}

/**
 * Met à jour la division de l'utilisateur si nécessaire
 * Promotion après 3 réussites consécutives (divisionPoints >= 3)
 * @param userId ID de l'utilisateur
 * @param prisma Instance Prisma Client
 * @returns Nouvelle division ou null si pas de changement
 */
export async function updateUserDivision(
  userId: string,
  prisma: PrismaClient
): Promise<Division | null> {
  // Récupérer l'utilisateur actuel
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      division: true,
      divisionPoints: true,
    },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Si divisionPoints >= 3, promouvoir à la division suivante
  if (user.divisionPoints >= 3) {
    const nextDivision = getNextDivision(user.division);
    
    if (nextDivision) {
      // Mettre à jour la division et réinitialiser divisionPoints
      await prisma.user.update({
        where: { id: userId },
        data: {
          division: nextDivision,
          divisionPoints: 0,
        },
      });

      return nextDivision;
    }
  }

  return null;
}

