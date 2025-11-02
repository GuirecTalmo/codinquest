import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DIVISIONS_ORDER } from '@/lib/quiz/divisions';
import { Division } from '@prisma/client';

export async function GET(request: Request) {
  try {
    // Récupérer la session utilisateur (optionnel, pour marquer l'utilisateur actuel)
    const session = await auth();
    const currentUserId = session?.user?.id as string | undefined;

    // Récupérer les query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    // Récupérer tous les utilisateurs avec leurs statistiques
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        division: true,
        totalScore: true,
        quizzesCompleted: true,
      },
      orderBy: [
        // Ordre personnalisé pour la division (sera trié après)
        { totalScore: 'desc' },
      ],
    });

    // Trier les utilisateurs par division puis par totalScore
    // CHALLENGER > MASTER > DIAMOND > PLATINE > GOLD > SILVER > BRONZE
    const sortedUsers = users.sort((a, b) => {
      // Obtenir l'index de la division dans l'ordre
      const aDivisionIndex = DIVISIONS_ORDER.indexOf(a.division);
      const bDivisionIndex = DIVISIONS_ORDER.indexOf(b.division);

      // Si les divisions sont différentes, trier par division (ordre décroissant)
      if (aDivisionIndex !== bDivisionIndex) {
        return bDivisionIndex - aDivisionIndex; // Ordre décroissant
      }

      // Si même division, trier par totalScore (ordre décroissant)
      return b.totalScore - a.totalScore;
    });

    // Appliquer la pagination
    const paginatedUsers = sortedUsers.slice(skip, skip + limit);

    // Formater la réponse avec le rank
    const leaderboard = paginatedUsers.map((user, index) => ({
      rank: skip + index + 1, // Rank commence à 1 (skip + index + 1)
      id: user.id,
      name: user.name,
      email: user.email,
      division: user.division,
      totalScore: user.totalScore,
      quizzesCompleted: user.quizzesCompleted,
      isCurrentUser: currentUserId ? user.id === currentUserId : false,
    }));

    return NextResponse.json({
      leaderboard,
      total: users.length,
      limit,
      skip,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du classement:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du classement' },
      { status: 500 }
    );
  }
}

