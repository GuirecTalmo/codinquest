import { z } from 'zod';

// Schéma pour l'inscription
export const signupSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .min(1, 'Email requis'),
  name: z
    .string()
    .min(1, 'Nom requis')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères')
    .optional(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /[A-Z]/,
      'Le mot de passe doit contenir au moins une majuscule'
    )
    .regex(
      /[a-z]/,
      'Le mot de passe doit contenir au moins une minuscule'
    )
    .regex(
      /[0-9]/,
      'Le mot de passe doit contenir au moins un chiffre'
    ),
});

export type SignupInput = z.infer<typeof signupSchema>;

// Schéma pour la soumission de quiz
export const quizSubmissionSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, 'Question ID requis'),
        answerId: z.string().min(1, 'Answer ID requis'),
      })
    )
    .min(1, 'Au moins une réponse est requise'),
  timeSpent: z.number().int().positive().optional(),
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;

// Schéma pour la connexion
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .min(1, 'Email requis'),
  password: z
    .string()
    .min(1, 'Mot de passe requis'),
});

export type LoginInput = z.infer<typeof loginSchema>;


