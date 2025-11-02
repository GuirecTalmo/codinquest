import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Protéger toutes les routes /dashboard/*
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      // Rediriger vers la page de connexion si non authentifié
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
