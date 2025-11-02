# Documentation Technique - CodeInQuest

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure du projet](#structure-du-projet)
3. [Base de données](#base-de-données)
4. [Authentification](#authentification)
5. [API Routes](#api-routes)
6. [Système de progression](#système-de-progression)
7. [Composants principaux](#composants-principaux)
8. [Maintenance](#maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

### Description de l'application

CodeInQuest est une application web interactive de quiz avec système de progression basé sur des divisions. Les utilisateurs peuvent passer des quiz de différents niveaux de difficulté, gagner des points, monter en divisions (de Bronze à Challenger) et se comparer dans un classement mondial.

**Principales fonctionnalités :**
- Système de quiz avec QCM (4 réponses par question)
- 7 divisions progressives (Bronze → Challenger)
- Système de scoring avec points et pourcentages
- Historique des tentatives
- Classement mondial
- Profil utilisateur avec statistiques

### Architecture générale

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Next.js    │  │  Components  │  │  Tailwind    │ │
│  │   App Router │  │   React      │  │     CSS      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   SERVER (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   API Routes │  │  NextAuth.js  │  │  Middleware  │ │
│  │   /api/*     │  │   Auth        │  │   Protection │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│              DATA LAYER (Prisma ORM)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Prisma      │  │  PostgreSQL  │  │   Migrations │ │
│  │   Client      │  │   Database   │  │   & Seeds    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Stack technique complète

| Catégorie | Technologies |
|-----------|-------------|
| **Framework Frontend** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **Authentification** | NextAuth.js v5 (Auth.js) |
| **Base de données** | PostgreSQL |
| **ORM** | Prisma 6 |
| **Validation** | Zod |
| **Hashage** | bcryptjs |
| **Icônes** | Lucide React |
| **State Management** | React Hooks (useState, useEffect) |
| **Linting** | ESLint |
| **Runtime** | Node.js 18+ |

---

## Structure du projet

### Arborescence détaillée

```
codinquest/
├── app/                          # App Router de Next.js
│   ├── api/                      # Routes API
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # Routes NextAuth (dynamiques)
│   │   │   └── signup/           # POST /api/auth/signup
│   │   ├── leaderboard/          # GET /api/leaderboard
│   │   ├── levels/               # GET /api/levels
│   │   ├── quiz/
│   │   │   └── [id]/             # Routes dynamiques pour quiz
│   │   │       ├── route.ts      # GET /api/quiz/[id]
│   │   │       └── submit/       # POST /api/quiz/[id]/submit
│   │   └── user/
│   │       ├── profile/          # GET /api/user/profile
│   │       └── history/          # GET /api/user/history
│   ├── auth/                     # Pages d'authentification
│   │   ├── signin/               # /auth/signin
│   │   └── signup/               # /auth/signup
│   ├── dashboard/                # Pages du dashboard (protégées)
│   │   ├── layout.tsx            # Layout avec navigation
│   │   ├── page.tsx              # /dashboard (page principale)
│   │   ├── history/              # /dashboard/history
│   │   ├── leaderboard/          # /dashboard/leaderboard
│   │   ├── levels/
│   │   │   └── [id]/             # /dashboard/levels/[id]
│   │   └── quiz/
│   │       └── [id]/             # /dashboard/quiz/[id]
│   ├── layout.tsx                # Layout racine
│   ├── page.tsx                  # Page d'accueil (/)
│   └── globals.css               # Styles globaux
│
├── components/                   # Composants React réutilisables
│   ├── providers.tsx            # SessionProvider pour NextAuth
│   └── quiz/                    # Composants spécifiques quiz
│       ├── DivisionBadge.tsx    # Badge de division
│       ├── LeaderboardTable.tsx  # Tableau de classement
│       ├── ProgressBar.tsx       # Barre de progression
│       ├── QuizCard.tsx         # Card de quiz
│       ├── QuizQuestion.tsx     # Composant question
│       ├── QuizTimer.tsx        # Timer de quiz
│       └── StatCard.tsx         # Card de statistique
│
├── lib/                          # Bibliothèques et utilitaires
│   ├── auth.ts                  # Configuration NextAuth
│   ├── prisma.ts                # Client Prisma singleton
│   └── quiz/                    # Utilitaires quiz
│       ├── divisions.ts         # Fonctions de divisions
│       ├── score.ts             # Calcul de scores
│       ├── types.ts             # Types TypeScript
│       └── validations.ts       # Schémas Zod
│
├── prisma/                       # Configuration Prisma
│   ├── schema.prisma            # Schéma de la base de données
│   └── seed.ts                  # Script de seed
│
├── public/                       # Fichiers statiques
│   └── *.svg                    # Images SVG
│
├── middleware.ts                 # Middleware Next.js (auth)
├── next.config.ts               # Configuration Next.js
├── tsconfig.json                # Configuration TypeScript
├── package.json                 # Dépendances npm
└── README.md                    # Documentation utilisateur
```

### Rôle de chaque dossier

#### `app/`
Contient toutes les routes de l'application Next.js 16 (App Router).

- **`app/api/`** : Routes API Server-Side (Route Handlers)
  - Chaque fichier `route.ts` exporte des fonctions HTTP (GET, POST, etc.)
  - Pas de composants React ici, seulement la logique backend

- **`app/auth/`** : Pages publiques d'authentification
  - Accessibles sans authentification
  - Redirection automatique si déjà connecté

- **`app/dashboard/`** : Pages protégées nécessitant une authentification
  - Vérifiées par le middleware
  - Layout partagé avec navigation

#### `components/`
Composants React réutilisables.

- **`components/quiz/`** : Composants spécifiques au domaine quiz
  - Isolés pour faciliter la maintenance
  - Props typées avec TypeScript

#### `lib/`
Code partagé côté serveur et client.

- **`lib/auth.ts`** : Configuration NextAuth centralisée
- **`lib/prisma.ts`** : Instance singleton de Prisma Client
- **`lib/quiz/`** : Logique métier (scoring, divisions, validation)

#### `prisma/`
Configuration et schéma de la base de données.

- **`schema.prisma`** : Définition des modèles et relations
- **`seed.ts`** : Données initiales pour développement

### Convention de nommage

| Type | Convention | Exemple |
|------|-----------|---------|
| **Fichiers de page** | `page.tsx` | `app/dashboard/page.tsx` |
| **Fichiers de layout** | `layout.tsx` | `app/dashboard/layout.tsx` |
| **Routes API** | `route.ts` | `app/api/user/profile/route.ts` |
| **Composants** | `PascalCase.tsx` | `QuizCard.tsx` |
| **Utilitaires** | `camelCase.ts` | `score.ts`, `divisions.ts` |
| **Types** | `PascalCase` | `User`, `QuizAttempt` |
| **Variables** | `camelCase` | `userScore`, `isPassed` |
| **Constantes** | `UPPER_SNAKE_CASE` | `MAX_DIVISION_POINTS` |

---

## Base de données

### Schéma Prisma expliqué

#### Modèle `User`

Représente un utilisateur de l'application.

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  password        String    // Hashé avec bcrypt
  name            String?
  division        Division  @default(BRONZE)
  divisionPoints  Int       @default(0)
  totalScore      Int       @default(0)
  quizzesCompleted Int     @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  quizAttempts   QuizAttempt[]
}
```

**Champs importants :**
- `division` : Division actuelle (Bronze → Challenger)
- `divisionPoints` : Points accumulés vers la prochaine division (0-3)
- `totalScore` : Score total cumulé de tous les quiz réussis
- `quizzesCompleted` : Nombre de quiz complétés (réussis ou échoués)

#### Modèle `Level`

Représente un niveau de progression (ex: Débutant, Intermédiaire).

```prisma
model Level {
  id          String    @id @default(uuid())
  name        String
  description String?
  order       Int       @unique  // Ordre d'affichage (1, 2, 3...)
  minDivision Division  @default(BRONZE)
  createdAt   DateTime  @default(now())
  
  // Relations
  quizzes     Quiz[]
}
```

**Rôle :**
- Groupe les quiz par difficulté/progression
- Définit une division minimale requise pour accéder aux quiz du niveau

#### Modèle `Quiz`

Représente un quiz avec ses questions.

```prisma
model Quiz {
  id           String     @id @default(uuid())
  title        String
  description  String?
  difficulty   Difficulty // EASY, MEDIUM, HARD
  timeLimit    Int?       // En secondes (optionnel)
  passingScore Int        @default(70)  // Score minimum en %
  levelId      String
  createdAt    DateTime   @default(now())
  
  // Relations
  level        Level      @relation(fields: [levelId], references: [id])
  questions    Question[]
  attempts     QuizAttempt[]
}
```

**Champs :**
- `passingScore` : Score minimum requis pour réussir (défaut: 70%)
- `timeLimit` : Temps limite en secondes (optionnel)

#### Modèle `Question`

Représente une question d'un quiz.

```prisma
model Question {
  id           String   @id @default(uuid())
  text         String
  points       Int      @default(1)
  quizId       String
  createdAt    DateTime @default(now())
  
  // Relations
  quiz         Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  answers      Answer[]
  userAnswers  UserAnswer[]
}
```

**Points :**
- Chaque question peut avoir un nombre de points différent
- Les points sont utilisés pour le calcul du score

#### Modèle `Answer`

Représente une réponse possible à une question (QCM avec 4 réponses).

```prisma
model Answer {
  id         String   @id @default(uuid())
  text       String
  isCorrect  Boolean  @default(false)
  questionId String
  createdAt  DateTime @default(now())
  
  // Relations
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  userAnswers UserAnswer[]
}
```

**Structure QCM :**
- 4 réponses par question (1 correcte, 3 incorrectes)

#### Modèle `QuizAttempt`

Représente une tentative de quiz par un utilisateur.

```prisma
model QuizAttempt {
  id           String    @id @default(uuid())
  userId       String
  quizId       String
  score        Int       // Score en pourcentage (0-100)
  pointsEarned Int       // Points gagnés
  totalPoints  Int       // Points totaux possibles
  isPassed     Boolean
  timeSpent    Int?      // En secondes (optionnel)
  startedAt    DateTime  @default(now())
  completedAt  DateTime  @default(now())
  
  // Relations
  user         User      @relation(fields: [userId], references: [id])
  quiz         Quiz      @relation(fields: [quizId], references: [id])
  userAnswers  UserAnswer[]
}
```

**Calcul du score :**
- `score` : Pourcentage obtenu (0-100)
- `pointsEarned` / `totalPoints` : Points gagnés sur points totaux
- `isPassed` : `true` si `score >= quiz.passingScore`

#### Modèle `UserAnswer`

Stocke chaque réponse individuelle donnée par l'utilisateur.

```prisma
model UserAnswer {
  id         String      @id @default(uuid())
  attemptId  String
  questionId String
  answerId   String
  createdAt  DateTime    @default(now())
  
  // Relations
  attempt    QuizAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question   Question    @relation(fields: [questionId], references: [id])
  answer     Answer      @relation(fields: [answerId], references: [id])
}
```

**Utilité :**
- Permet de reconstruire exactement ce que l'utilisateur a répondu
- Nécessaire pour l'historique détaillé

### Diagramme des relations

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1
     │
     │ * ┌──────────────┐
     └───│QuizAttempt   │
         └──────┬───────┘
                │ 1
                │
                │ * ┌──────────────┐
                └───│UserAnswer    │
                    └──────┬───────┘
                           │
                    ┌──────┴──────┐
                    │             │
         ┌──────────┘             └──────────┐
         │                                    │
    ┌────▼─────┐                       ┌─────▼─────┐
    │ Question │                       │  Answer  │
    └────┬─────┘                       └──────────┘
         │ 1
         │
         │ * ┌──────────────┐
         └───│  Quiz        │
             └──────┬───────┘
                    │ * 1
                    │
             ┌──────▼──────┐
             │    Level    │
             └─────────────┘
```

**Relations clés :**
- `User` 1 → * `QuizAttempt` : Un utilisateur peut avoir plusieurs tentatives
- `QuizAttempt` 1 → * `UserAnswer` : Une tentative contient plusieurs réponses
- `Quiz` * → 1 `Level` : Plusieurs quiz appartiennent à un niveau
- `Question` * → 1 `Quiz` : Plusieurs questions appartiennent à un quiz
- `Answer` * → 1 `Question` : 4 réponses par question

### Migrations et seeds

#### Migrations

Les migrations Prisma sont générées automatiquement lors de modifications du schéma.

```bash
# Créer une migration après modification du schéma
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base (ATTENTION: supprime toutes les données)
npx prisma migrate reset
```

#### Seed

Le fichier `prisma/seed.ts` contient les données initiales :

**Ce qui est créé :**
- 1 utilisateur admin (`admin@test.com` / `admin123`)
- 3 niveaux (Débutant, Intermédiaire, Avancé)
- 6 quiz avec leurs questions et réponses
- Niveau de difficulté varié (EASY, MEDIUM, HARD)

**Exécuter le seed :**
```bash
npx prisma db seed
```

---

## Authentification

### Comment fonctionne NextAuth

NextAuth.js v5 (Auth.js) est utilisé pour gérer l'authentification avec un provider **Credentials** (email/password).

#### Configuration (`lib/auth.ts`)

```typescript
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        // 1. Trouver l'utilisateur
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // 2. Vérifier le mot de passe
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // 3. Retourner les données utilisateur pour la session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          division: user.division,
        };
      },
    }),
  ],
  callbacks: {
    // Personnaliser le token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.division = user.division;
      }
      return token;
    },
    // Personnaliser la session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).division = token.division;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
});
```

**Points importants :**
- **Strategy JWT** : Pas de session en base, token stocké côté client
- **Hashage bcrypt** : Mots de passe hashés avec `bcryptjs`
- **Callbacks** : Permettent d'ajouter des données personnalisées (division) à la session

### Gestion des sessions

#### Récupérer la session côté client

```typescript
'use client';
import { useSession } from 'next-auth/react';

export default function Component() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Chargement...</p>;
  if (status === 'unauthenticated') return <p>Non connecté</p>;

  return <p>Bonjour {session?.user?.name}</p>;
}
```

#### Récupérer la session côté serveur

```typescript
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();

  if (!session) {
    return new Response('Non authentifié', { status: 401 });
  }

  // session.user.id, session.user.email, etc.
}
```

### Protection des routes (middleware)

Le fichier `middleware.ts` protège automatiquement toutes les routes sous `/dashboard/*`.

```typescript
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  // Rediriger vers /auth/signin si non connecté sur /dashboard
  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Rediriger vers /dashboard si connecté sur /auth/*
  if (req.nextUrl.pathname.startsWith('/auth') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Routes protégées :**
- `/dashboard/*` : Requiert une authentification
- `/api/user/*` : Protégées manuellement dans chaque route

**Routes publiques :**
- `/` : Page d'accueil
- `/auth/*` : Pages d'authentification

---

## API Routes

### Liste des endpoints

#### 1. Authentification

##### `POST /api/auth/signup`

Créer un nouveau compte utilisateur.

**Paramètres (body) :**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe" // optionnel
}
```

**Réponse succès (201) :**
```json
{
  "message": "Compte créé avec succès",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "division": "BRONZE"
  }
}
```

**Réponse erreur (400/409) :**
```json
{
  "error": "Email déjà utilisé"
}
```

#### 2. Quiz

##### `GET /api/quiz/[id]`

Récupérer un quiz avec ses questions et réponses.

**Paramètres :**
- `id` : ID du quiz (dans l'URL)

**Réponse succès (200) :**
```json
{
  "quiz": {
    "id": "uuid",
    "title": "Culture Générale",
    "description": "...",
    "difficulty": "EASY",
    "timeLimit": 600,
    "passingScore": 70,
    "questions": [
      {
        "id": "uuid",
        "text": "Quelle est la capitale de la France ?",
        "points": 1,
        "answers": [
          { "id": "uuid", "text": "Paris", "isCorrect": true },
          { "id": "uuid", "text": "Londres", "isCorrect": false },
          { "id": "uuid", "text": "Berlin", "isCorrect": false },
          { "id": "uuid", "text": "Madrid", "isCorrect": false }
        ]
      }
    ]
  }
}
```

**Réponse erreur (404) :**
```json
{
  "error": "Quiz non trouvé"
}
```

##### `POST /api/quiz/[id]/submit`

Soumettre les réponses d'un quiz.

**Headers :**
```
Authorization: (géré par NextAuth)
```

**Paramètres (body) :**
```json
{
  "answers": [
    { "questionId": "uuid", "answerId": "uuid" },
    { "questionId": "uuid", "answerId": "uuid" }
  ],
  "timeSpent": 120 // optionnel, en secondes
}
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "attempt": {
    "id": "uuid",
    "score": 85,
    "pointsEarned": 17,
    "totalPoints": 20,
    "isPassed": true,
    "timeSpent": 120
  },
  "newDivision": "SILVER", // null si pas de promotion
  "correctAnswers": {
    "questionId1": "answerId1",
    "questionId2": "answerId2"
  }
}
```

**Réponse erreur (400) :**
```json
{
  "error": "Données invalides",
  "details": [...]
}
```

#### 3. Niveaux

##### `GET /api/levels`

Récupérer tous les niveaux avec leurs quiz.

**Réponse succès (200) :**
```json
{
  "levels": [
    {
      "id": "uuid",
      "name": "Débutant",
      "description": "...",
      "order": 1,
      "minDivision": "BRONZE",
      "quizzes": [
        {
          "id": "uuid",
          "title": "Culture Générale",
          "difficulty": "EASY",
          "questionCount": 5
        }
      ]
    }
  ]
}
```

#### 4. Utilisateur

##### `GET /api/user/profile`

Récupérer le profil et les statistiques de l'utilisateur connecté.

**Headers :**
```
Authorization: (géré par NextAuth)
```

**Réponse succès (200) :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "division": "SILVER",
    "divisionPoints": 2,
    "totalScore": 1500,
    "quizzesCompleted": 5
  },
  "stats": {
    "division": "SILVER",
    "divisionProgress": 67, // divisionPoints / 3 * 100
    "quizzesCompleted": 5,
    "quizzesPassed": 4,
    "successRate": 80, // %
    "totalScore": 1500,
    "averageScore": 85
  }
}
```

**Réponse erreur (401) :**
```json
{
  "error": "Non authentifié"
}
```

##### `GET /api/user/history`

Récupérer l'historique des tentatives de l'utilisateur connecté.

**Query parameters :**
- `status` : `"passed"` | `"failed"` (optionnel)
- `limit` : Nombre max de résultats (défaut: 20)

**Exemple :**
```
GET /api/user/history?status=passed&limit=10
```

**Réponse succès (200) :**
```json
{
  "attempts": [
    {
      "id": "uuid",
      "score": 85,
      "pointsEarned": 17,
      "totalPoints": 20,
      "isPassed": true,
      "timeSpent": 120,
      "startedAt": "2024-01-01T10:00:00Z",
      "completedAt": "2024-01-01T10:02:00Z",
      "quiz": {
        "id": "uuid",
        "title": "Culture Générale",
        "difficulty": "EASY",
        "passingScore": 70,
        "level": {
          "id": "uuid",
          "name": "Débutant",
          "order": 1
        }
      }
    }
  ],
  "total": 10
}
```

#### 5. Classement

##### `GET /api/leaderboard`

Récupérer le classement mondial.

**Query parameters :**
- `limit` : Nombre max de résultats (défaut: 100)
- `skip` : Nombre de résultats à sauter (pour pagination)

**Exemple :**
```
GET /api/leaderboard?limit=50&skip=0
```

**Réponse succès (200) :**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "division": "CHALLENGER",
      "totalScore": 5000,
      "quizzesCompleted": 20,
      "isCurrentUser": false
    }
  ],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

**Logique de tri :**
1. Par division (ordre : BRONZE < SILVER < ... < CHALLENGER)
2. Par score total décroissant (dans la même division)

### Gestion des erreurs

Toutes les routes API suivent un format d'erreur standardisé :

```typescript
// Erreur 400 - Données invalides
return NextResponse.json(
  { error: 'Message d\'erreur', details: [...] },
  { status: 400 }
);

// Erreur 401 - Non authentifié
return NextResponse.json(
  { error: 'Non authentifié' },
  { status: 401 }
);

// Erreur 404 - Ressource non trouvée
return NextResponse.json(
  { error: 'Quiz non trouvé' },
  { status: 404 }
);

// Erreur 500 - Erreur serveur
return NextResponse.json(
  { error: 'Une erreur est survenue' },
  { status: 500 }
);
```

---

## Système de progression

### Logique des divisions

Les utilisateurs progressent à travers **7 divisions** :

```
BRONZE → SILVER → GOLD → PLATINE → DIAMOND → MASTER → CHALLENGER
```

#### Ordre des divisions

```typescript
const divisionOrder = [
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINE',
  'DIAMOND',
  'MASTER',
  'CHALLENGER'
];
```

#### Promotion automatique

**Condition :** Après 3 quiz réussis consécutifs (`divisionPoints >= 3`)

**Logique (`lib/quiz/score.ts`) :**

```typescript
// Lors de la soumission d'un quiz réussi
if (isPassed) {
  // Incrémenter divisionPoints
  await prisma.user.update({
    where: { id: userId },
    data: {
      divisionPoints: { increment: 1 }
    }
  });

  // Si divisionPoints >= 3, promouvoir
  if (user.divisionPoints + 1 >= 3) {
    const nextDivision = getNextDivision(currentDivision);
    if (nextDivision) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          division: nextDivision,
          divisionPoints: 0  // Réinitialiser à 0
        }
      });
    }
  }
}
```

**Important :**
- Seulement les quiz **réussis** comptent (`isPassed = true`)
- Les quiz échoués ne réinitialisent pas `divisionPoints`
- `divisionPoints` est réinitialisé à 0 après promotion

### Calcul des scores

#### Score en pourcentage

```typescript
// lib/quiz/score.ts
export function calculateScore(
  userAnswers: UserAnswer[],
  questions: QuestionWithCorrectAnswer[]
): number {
  let pointsEarned = 0;
  let totalPoints = 0;

  questions.forEach((question) => {
    totalPoints += question.points;
    const userAnswer = userAnswers.find(a => a.questionId === question.id);
    
    if (userAnswer?.answerId === question.correctAnswerId) {
      pointsEarned += question.points;
    }
  });

  // Pourcentage arrondi
  return Math.round((pointsEarned / totalPoints) * 100);
}
```

**Exemple :**
- Quiz avec 5 questions de 1 point chacune = 5 points totaux
- Utilisateur répond correctement à 4 questions = 4 points gagnés
- Score = (4 / 5) * 100 = **80%**

#### Vérification de réussite

```typescript
export function checkIfPassed(score: number, passingScore: number): boolean {
  return score >= passingScore;
}
```

**Par défaut :** `passingScore = 70%` (configurable par quiz)

### Conditions de montée de division

**Résumé :**

1. **Quiz réussi** (`score >= passingScore`)
   - Incrémenter `divisionPoints` de 1
   - Ajouter `pointsEarned` à `totalScore`
   - Incrémenter `quizzesCompleted`

2. **Promotion si `divisionPoints >= 3`**
   - Passer à la division suivante
   - Réinitialiser `divisionPoints` à 0

3. **Quiz échoué** (`score < passingScore`)
   - Ne pas incrémenter `divisionPoints`
   - Ne pas ajouter de points au score total
   - Incrémenter `quizzesCompleted`

**Visualisation :**

```
Utilisateur en BRONZE (divisionPoints: 0)
  ↓
Quiz 1 réussi → divisionPoints: 1 ✅
Quiz 2 réussi → divisionPoints: 2 ✅
Quiz 3 réussi → divisionPoints: 3 ✅
  ↓
PROMOTION → SILVER (divisionPoints: 0) 🎉
```

---

## Composants principaux

### 1. `DivisionBadge`

Affiche un badge coloré pour une division.

**Props :**
```typescript
interface DivisionBadgeProps {
  division: Division;  // BRONZE, SILVER, GOLD, etc.
  size?: 'sm' | 'md' | 'lg';  // Défaut: 'md'
}
```

**Utilisation :**
```typescript
import { DivisionBadge } from '@/components/quiz/DivisionBadge';

<DivisionBadge division="SILVER" size="md" />
```

**Couleurs :**
- BRONZE : Amber (#92400E)
- SILVER : Gray (#9CA3AF)
- GOLD : Yellow (#EAB308)
- PLATINE : Cyan (#22D3EE)
- DIAMOND : Blue (#3B82F6)
- MASTER : Purple (#9333EA)
- CHALLENGER : Red (#DC2626)

### 2. `QuizCard`

Card affichant un quiz avec ses informations.

**Props :**
```typescript
interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    difficulty: Difficulty;
    timeLimit?: number | null;
    passingScore?: number;
    passed?: boolean;
    attempted?: boolean;
  };
  levelName?: string;
}
```

**Utilisation :**
```typescript
import { QuizCard } from '@/components/quiz/QuizCard';

<QuizCard
  quiz={{
    id: "uuid",
    title: "Culture Générale",
    difficulty: "EASY",
    passed: true
  }}
  levelName="Débutant"
/>
```

### 3. `QuizQuestion`

Affiche une question avec ses réponses (QCM).

**Props :**
```typescript
interface QuizQuestionProps {
  question: {
    id: string;
    text: string;
    points: number;
  };
  answers: Array<{
    id: string;
    text: string;
  }>;
  selectedAnswer: string | null;
  onSelectAnswer: (answerId: string) => void;
}
```

**Utilisation :**
```typescript
import { QuizQuestion } from '@/components/quiz/QuizQuestion';

<QuizQuestion
  question={currentQuestion}
  answers={answers}
  selectedAnswer={userAnswers[questionId]}
  onSelectAnswer={(answerId) => {
    setUserAnswers({ ...userAnswers, [questionId]: answerId });
  }}
/>
```

### 4. `QuizTimer`

Timer de quiz avec compte à rebours.

**Props :**
```typescript
interface QuizTimerProps {
  timeLimit: number;  // En secondes
  onTimeUp: () => void;
}
```

**Utilisation :**
```typescript
import { QuizTimer } from '@/components/quiz/QuizTimer';

<QuizTimer
  timeLimit={600}  // 10 minutes
  onTimeUp={() => {
    // Soumettre automatiquement le quiz
    handleSubmit();
  }}
/>
```

### 5. `ProgressBar`

Barre de progression pour la division.

**Props :**
```typescript
interface ProgressBarProps {
  current: number;  // divisionPoints (0-3)
  max: number;      // 3
  label?: string;
}
```

**Utilisation :**
```typescript
import { ProgressBar } from '@/components/quiz/ProgressBar';

<ProgressBar
  current={2}
  max={3}
  label="Progression vers SILVER"
/>
```

### 6. `LeaderboardTable`

Tableau de classement avec tri et highlight.

**Props :**
```typescript
interface LeaderboardTableProps {
  leaderboard: Array<{
    rank: number;
    id: string;
    name: string | null;
    email: string;
    division: string;
    totalScore: number;
    quizzesCompleted: number;
    isCurrentUser: boolean;
  }>;
  currentUserId?: string | null;
}
```

**Utilisation :**
```typescript
import { LeaderboardTable } from '@/components/quiz/LeaderboardTable';

<LeaderboardTable
  leaderboard={leaderboardData}
  currentUserId={session?.user?.id}
/>
```

### 7. `StatCard`

Card affichant une statistique.

**Props :**
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
}
```

**Utilisation :**
```typescript
import { StatCard } from '@/components/quiz/StatCard';
import { Trophy } from 'lucide-react';

<StatCard
  title="Score total"
  value={1500}
  icon={Trophy}
  trend="up"
/>
```

---

## Maintenance

### Comment ajouter un nouveau quiz

#### 1. Via Prisma Studio (recommandé pour développement)

```bash
npx prisma studio
```

1. Ouvrir `Quiz`
2. Cliquer sur "Add record"
3. Remplir les champs :
   - `title` : Nom du quiz
   - `description` : Description (optionnel)
   - `difficulty` : EASY, MEDIUM, ou HARD
   - `timeLimit` : Temps en secondes (optionnel)
   - `passingScore` : Score minimum (défaut: 70)
   - `levelId` : ID du niveau (ex: "Débutant")

#### 2. Via le seed (`prisma/seed.ts`)

```typescript
const quiz = await prisma.quiz.create({
  data: {
    title: "Nouveau Quiz",
    description: "Description du quiz",
    difficulty: "MEDIUM",
    timeLimit: 600,  // 10 minutes
    passingScore: 70,
    levelId: niveauDebutantId,
  },
});

// Créer les questions
const question1 = await prisma.question.create({
  data: {
    text: "Question 1 ?",
    points: 1,
    quizId: quiz.id,
  },
});

// Créer les 4 réponses (1 correcte, 3 incorrectes)
await prisma.answer.createMany({
  data: [
    { text: "Réponse correcte", isCorrect: true, questionId: question1.id },
    { text: "Réponse fausse 1", isCorrect: false, questionId: question1.id },
    { text: "Réponse fausse 2", isCorrect: false, questionId: question1.id },
    { text: "Réponse fausse 3", isCorrect: false, questionId: question1.id },
  ],
});
```

#### 3. Via SQL direct

```sql
-- Créer le quiz
INSERT INTO "Quiz" (id, title, description, difficulty, "passingScore", "levelId", "createdAt")
VALUES (gen_random_uuid(), 'Nouveau Quiz', 'Description', 'MEDIUM', 70, 'level-id', NOW());

-- Créer les questions et réponses...
```

### Comment ajouter un niveau

#### 1. Via Prisma Studio

1. Ouvrir `Level`
2. Cliquer sur "Add record"
3. Remplir :
   - `name` : Nom du niveau (ex: "Expert")
   - `description` : Description
   - `order` : Ordre d'affichage (ex: 4)
   - `minDivision` : Division minimale requise (ex: PLATINE)

#### 2. Via le seed

```typescript
const niveau = await prisma.level.create({
  data: {
    name: "Expert",
    description: "Niveau pour les experts",
    order: 4,
    minDivision: "PLATINE",
  },
});
```

### Comment modifier le système de divisions

Les divisions sont définies dans plusieurs fichiers :

#### 1. Schéma Prisma (`prisma/schema.prisma`)

```prisma
enum Division {
  BRONZE
  SILVER
  GOLD
  PLATINE
  DIAMOND
  MASTER
  CHALLENGER
  // Ajouter ici de nouvelles divisions
}
```

#### 2. Fonction `getNextDivision` (`lib/quiz/divisions.ts`)

```typescript
export function getNextDivision(
  currentDivision: Division
): Division | null {
  const divisionOrder: Division[] = [
    'BRONZE',
    'SILVER',
    'GOLD',
    'PLATINE',
    'DIAMOND',
    'MASTER',
    'CHALLENGER',
    // Ajouter ici de nouvelles divisions
  ];

  const currentIndex = divisionOrder.indexOf(currentDivision);
  if (currentIndex === -1 || currentIndex === divisionOrder.length - 1) {
    return null;
  }

  return divisionOrder[currentIndex + 1];
}
```

#### 3. Composant `DivisionBadge` (`components/quiz/DivisionBadge.tsx`)

Ajouter la configuration de couleur pour la nouvelle division :

```typescript
const divisionConfig: Record<Division, { bgColor: string; icon: React.ComponentType }> = {
  // ... divisions existantes
  NOUVELLE_DIVISION: {
    bgColor: 'bg-custom-color',
    icon: CustomIcon,
  },
};
```

#### 4. Migration

Après modification du schéma :

```bash
npx prisma migrate dev --name add_nouvelle_division
```

### Commandes Prisma utiles

```bash
# Générer le Prisma Client après modification du schéma
npx prisma generate

# Visualiser la base de données dans une interface graphique
npx prisma studio

# Appliquer le schéma sans créer de migration (dev seulement)
npx prisma db push

# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base (supprime toutes les données !)
npx prisma migrate reset

# Voir l'état des migrations
npx prisma migrate status

# Formater le schéma Prisma
npx prisma format
```

### Déploiement

#### Prérequis

1. Base de données PostgreSQL accessible
2. Variables d'environnement configurées :
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

#### Étapes

1. **Build de l'application :**
   ```bash
   npm run build
   ```

2. **Vérifier le build :**
   ```bash
   npm start
   ```

3. **Déployer :**
   - **Vercel** : `vercel deploy`
   - **Railway** : Push vers le repo connecté
   - **Docker** : Build l'image et déployer

4. **Post-déploiement :**
   ```bash
   # Appliquer les migrations
   npx prisma migrate deploy

   # Optionnel : Exécuter le seed (seulement pour données initiales)
   npx prisma db seed
   ```

#### Variables d'environnement en production

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_SECRET="generated-secret-key"
NEXTAUTH_URL="https://votre-domaine.com"
```

---

## Troubleshooting

### Problèmes courants et solutions

#### 1. Erreur de connexion à la base de données

**Erreur :**
```
Can't reach database server at `localhost:5432`
```

**Solutions :**
- Vérifier que PostgreSQL est démarré
- Vérifier la `DATABASE_URL` dans `.env`
- Vérifier que le port est correct (5432 par défaut)
- Vérifier les credentials (utilisateur, mot de passe)

**Test de connexion :**
```bash
# Via Prisma
npx prisma db push

# Via psql
psql -h localhost -U postgres -d quiz_app
```

#### 2. Erreur "Prisma Client not generated"

**Erreur :**
```
@prisma/client did not initialize yet
```

**Solution :**
```bash
npx prisma generate
```

#### 3. Erreur NextAuth "NEXTAUTH_SECRET missing"

**Erreur :**
```
Please define a `NEXTAUTH_SECRET` environment variable
```

**Solution :**
```bash
# Générer un secret
openssl rand -base64 32

# Ajouter dans .env
NEXTAUTH_SECRET="votre-secret-genere"
```

#### 4. Erreur "User already exists" lors du signup

**Cause :** Email déjà utilisé

**Solution :** Vérifier dans Prisma Studio ou utiliser un autre email

#### 5. Quiz non trouvé (404)

**Cause :** ID du quiz incorrect ou quiz supprimé

**Solution :**
- Vérifier l'ID dans l'URL
- Vérifier dans Prisma Studio que le quiz existe
- Vérifier que `quizId` correspond bien à un quiz existant

#### 6. Score toujours à 0%

**Cause :** Aucune réponse correcte ou problème de calcul

**Solution :**
- Vérifier que les `answerId` soumis correspondent aux bonnes réponses
- Vérifier que `isCorrect` est bien `true` pour la bonne réponse
- Vérifier les logs du serveur pour voir les réponses soumises

#### 7. Promotion de division non déclenchée

**Cause :** `divisionPoints` < 3 ou quiz non réussi

**Solution :**
- Vérifier que le quiz est bien réussi (`isPassed = true`)
- Vérifier que `divisionPoints` atteint bien 3 avant promotion
- Vérifier dans Prisma Studio : `SELECT division, "divisionPoints" FROM "User" WHERE id = '...'`

### Logs et debugging

#### Logs côté serveur

Les erreurs sont loggées dans la console du serveur Next.js :

```typescript
// Dans une route API
console.error('Erreur:', error);
```

#### Logs Prisma

Activer les logs Prisma pour voir les requêtes SQL :

```typescript
// lib/prisma.ts
export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'], // Activer les logs
});
```

#### Debugging avec Prisma Studio

```bash
npx prisma studio
```

Permet de :
- Voir toutes les données
- Modifier directement les enregistrements
- Vérifier les relations
- Tester les données

#### Vérifier les sessions NextAuth

```typescript
// Côté serveur
import { auth } from '@/lib/auth';

const session = await auth();
console.log('Session:', session);
```

### Performance

#### Optimiser les requêtes Prisma

**Problème :** Requêtes N+1

**Exemple problématique :**
```typescript
const quizzes = await prisma.quiz.findMany();
for (const quiz of quizzes) {
  const level = await prisma.level.findUnique({ where: { id: quiz.levelId } });
}
```

**Solution :** Utiliser `include` ou `select`

```typescript
const quizzes = await prisma.quiz.findMany({
  include: {
    level: true,  // Charger en une seule requête
  },
});
```

#### Cache des requêtes

Pour les données peu fréquemment mises à jour (niveaux, quiz), considérer :
- Cache côté client (React Query)
- ISR (Incremental Static Regeneration) de Next.js
- Cache Redis pour les routes API

---

## Conclusion

Cette documentation couvre tous les aspects techniques de CodeInQuest. Pour toute question supplémentaire, référez-vous aux fichiers source ou à la documentation officielle des technologies utilisées :

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

**Bonne chance avec votre projet ! 🚀**

