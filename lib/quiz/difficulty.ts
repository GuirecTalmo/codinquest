import { Difficulty } from '@prisma/client';

// Score minimum par défaut du système (`passingScore` Prisma, voir
// PRODUCT.md). Les écrans qui affichent ce chiffre ne doivent le montrer que
// lorsqu'un quiz s'en écarte -- le répéter pour le cas courant n'ajoute
// aucune information.
export const DEFAULT_PASSING_SCORE = 70;

// Neutre à dessein : la difficulté est informative, pas une alerte. Un badge
// coloré (vert/jaune/rouge) entre en collision avec l'accent gold ("Moyen")
// et avec les couleurs sémantiques success/error ("Difficile"), ce qui casse
// la Règle du Seul Accent et la Règle de Statut du DESIGN.md. La progression
// de poids visuel (contour -> surface tamisée -> surface ink) différencie
// les trois niveaux sans emprunter de teinte. Partagé entre QuizCard et la
// page de détail d'un niveau pour que les deux affichages restent identiques.
export const difficultyConfig: Record<
  Difficulty,
  { color: string; label: string; bgColor: string }
> = {
  EASY: {
    color: 'text-text-secondary',
    label: 'Facile',
    bgColor: 'bg-transparent border-border',
  },
  MEDIUM: {
    color: 'text-text-primary',
    label: 'Moyen',
    bgColor: 'bg-surface-dimmed border-border',
  },
  HARD: {
    color: 'text-on-ink',
    label: 'Difficile',
    bgColor: 'bg-ink border-border',
  },
};
