import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Le classement n'est visible que par les utilisateurs connectés
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const currentUserId = session.user.id as string;

    // Récupérer les query params (limit plafonné pour éviter un dump complet)
    const MAX_LIMIT = 100;
    const { searchParams } = new URL(request.url);
    const rawLimit = parseInt(searchParams.get('limit') || '100', 10);
    const rawSkip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = Number.isNaN(rawLimit) ? 100 : Math.min(Math.max(rawLimit, 1), MAX_LIMIT);
    const skip = Number.isNaN(rawSkip) ? 0 : Math.max(rawSkip, 0);

    // Le tri par division s'appuie sur l'ordre natif de l'enum Postgres
    // (BRONZE=1 ... CHALLENGER=7, déclaré dans ce même ordre dans schema.prisma) :
    // { division: 'desc' } place donc CHALLENGER en tête, comme DIVISIONS_ORDER.
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          division: true,
          totalScore: true,
          quizzesCompleted: true,
        },
        orderBy: [
          { division: 'desc' },
          { totalScore: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    // Formater la réponse avec le rank
    // L'email n'est jamais exposé au client : seul un nom d'affichage
    // (nom choisi, ou pseudonyme dérivé de l'email en repli) est renvoyé.
    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1, // Rank commence à 1 (skip + index + 1)
      id: user.id,
      name: user.name || user.email.split('@')[0],
      division: user.division,
      totalScore: user.totalScore,
      quizzesCompleted: user.quizzesCompleted,
      isCurrentUser: user.id === currentUserId,
    }));

    return NextResponse.json({
      leaderboard,
      total,
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

