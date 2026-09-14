import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signupSchema } from '@/lib/quiz/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Limiter les inscriptions par IP pour empêcher la création de comptes en masse
    const ip = getClientIp(request);
    const { success, retryAfterSeconds } = rateLimit(`signup:${ip}`, 5, 15 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Trop de tentatives, réessayez plus tard' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    const body = await request.json();

    // Valider les données avec Zod
    const validationResult = signupSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validationResult.data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Un utilisateur avec cet email existe déjà',
        },
        { status: 409 }
      );
    }

    // Hacher le mot de passe avec 10 rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec division BRONZE par défaut (défini dans le schéma Prisma)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        // Division BRONZE est déjà défini comme default dans le schéma Prisma
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur est survenue lors de l\'inscription',
      },
      { status: 500 }
    );
  }
}
