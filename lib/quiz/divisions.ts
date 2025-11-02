import { Division } from '@prisma/client';

// Ordre des divisions du plus bas au plus haut
export const DIVISIONS_ORDER: Division[] = [
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINE',
  'DIAMOND',
  'MASTER',
  'CHALLENGER',
];

// Couleurs pour chaque division
export function getDivisionColor(division: Division): string {
  const colors: Record<Division, string> = {
    BRONZE: '#CD7F32', // Bronze
    SILVER: '#C0C0C0', // Argent
    GOLD: '#FFD700', // Or
    PLATINE: '#E5E4E2', // Platine
    DIAMOND: '#B9F2FF', // Diamant (bleu clair)
    MASTER: '#9B59B6', // Master (violet)
    CHALLENGER: '#FF1493', // Challenger (rose fuchsia)
  };
  return colors[division];
}

// Obtenir la division suivante
export function getNextDivision(currentDivision: Division): Division | null {
  const currentIndex = DIVISIONS_ORDER.indexOf(currentDivision);
  if (currentIndex === -1 || currentIndex === DIVISIONS_ORDER.length - 1) {
    return null; // Dernière division ou division invalide
  }
  return DIVISIONS_ORDER[currentIndex + 1];
}

// Obtenir l'icône/emoji pour chaque division
export function getDivisionIcon(division: Division): string {
  const icons: Record<Division, string> = {
    BRONZE: '🥉',
    SILVER: '🥈',
    GOLD: '🥇',
    PLATINE: '💎',
    DIAMOND: '💠',
    MASTER: '👑',
    CHALLENGER: '⭐',
  };
  return icons[division];
}


