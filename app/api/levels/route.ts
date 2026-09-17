import { NextResponse } from 'next/server';
import { getLevels } from '@/lib/data/levels';

export async function GET() {
  try {
    const levels = await getLevels();

    return NextResponse.json({
      levels,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des niveaux:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des niveaux' },
      { status: 500 }
    );
  }
}
