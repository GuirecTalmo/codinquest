import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserHistory } from '@/lib/data/history';

export async function GET(request: Request) {
  try {
    // Vérifier que l'utilisateur est authentifié
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;

    // Récupérer les query params (limit plafonné pour éviter un dump complet)
    const MAX_LIMIT = 100;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'passed' | 'failed'
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const limit = Number.isNaN(rawLimit) ? 20 : Math.min(Math.max(rawLimit, 1), MAX_LIMIT);

    const formattedAttempts = await getUserHistory(userId, {
      status: status === 'passed' || status === 'failed' ? status : null,
      limit,
    });

    return NextResponse.json({
      attempts: formattedAttempts,
      total: formattedAttempts.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération de l\'historique' },
      { status: 500 }
    );
  }
}
