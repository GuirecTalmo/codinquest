import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getLeaderboard } from '@/lib/data/leaderboard';

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

    const { leaderboard, total } = await getLeaderboard({ skip, limit, currentUserId });

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
