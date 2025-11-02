import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { loginSchema } from './quiz/validations';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        // Valider les credentials avec Zod
        const validationResult = loginSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        });

        if (!validationResult.success) {
          throw new Error('Format email ou mot de passe invalide');
        }

        // Rechercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw new Error('Email ou mot de passe incorrect');
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Email ou mot de passe incorrect');
        }

        // Retourner l'utilisateur si l'authentification réussit
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          division: user.division,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Ajouter userId et division au token lors de la première connexion
      if (user) {
        token.userId = user.id;
        token.division = (user as { division?: string }).division;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajouter userId et division à la session
      if (session.user) {
        (session.user as { id?: string; division?: string }).id = token.userId as string;
        (session.user as { id?: string; division?: string }).division = token.division as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
