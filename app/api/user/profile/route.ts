import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Récupérer les informations complètes de l'utilisateur
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id as string,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        division: true,
        divisionPoints: true,
        totalScore: true,
        quizzesCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      stats: {
        division: user.division,
        divisionPoints: user.divisionPoints,
        totalScore: user.totalScore,
        quizzesCompleted: user.quizzesCompleted,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du profil' },
      { status: 500 }
    );
  }
}


