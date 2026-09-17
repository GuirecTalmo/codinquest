import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserProfile } from '@/lib/data/profile';

export async function GET() {
  try {
    // Récupérer la session utilisateur
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const profile = await getUserProfile(session.user.id as string);

    if (!profile) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du profil' },
      { status: 500 }
    );
  }
}
