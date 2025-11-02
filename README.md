# CodeInQuest 🎯

Application de quiz interactive avec système de divisions et de progression. Testez vos connaissances, progressez à travers 7 divisions (de Bronze à Challenger) et montez dans le classement mondial !

## ✨ Fonctionnalités principales

### 🎮 Système de Quiz
- **3 niveaux de difficulté** : Débutant, Intermédiaire, Avancé
- **6+ quiz** avec plus de 30 questions au total
- **QCM** avec 4 réponses par question
- **Timer optionnel** pour les quiz chronométrés
- **Système de scoring** avec points et pourcentages

### 🏆 Système de Divisions
- **7 divisions** : Bronze, Silver, Gold, Platine, Diamond, Master, Challenger
- **Promotion automatique** après 3 quiz réussis consécutifs
- **Barre de progression** visuelle vers la division suivante
- **Divisions minimales** requises pour débloquer certains niveaux

### 📊 Statistiques et Progression
- **Profil utilisateur** avec statistiques détaillées
- **Historique complet** de toutes les tentatives
- **Taux de réussite** calculé automatiquement
- **Meilleur score** pour chaque quiz tenté

### 🏅 Classement
- **Leaderboard mondial** avec top 100
- **Podium spécial** pour les 3 premiers (🥇🥈🥉)
- **Tri par division** puis par score total
- **Position actuelle** affichée en temps réel

## 🛠️ Technologies utilisées

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Prisma** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **NextAuth.js v5** - Authentification
- **Tailwind CSS** - Styling
- **Zod** - Validation de schémas
- **Zustand** - Gestion d'état (si utilisé)
- **Lucide React** - Icônes
- **bcryptjs** - Hashage de mots de passe

## 📋 Prérequis

- Node.js 18+ installé
- PostgreSQL installé et configuré (ou compte Supabase gratuit)
- npm ou yarn

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <votre-repo-url>
cd codinquest
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/quiz_app?schema=public"
NEXTAUTH_SECRET="votre-secret-key-aleatoire-ici"
NEXTAUTH_URL="http://localhost:3000"
```

**Pour générer un NEXTAUTH_SECRET :**
```bash
openssl rand -base64 32
```

### 4. Initialiser la base de données

```bash
# Pousser le schéma Prisma vers la base de données
npx prisma db push

# Peupler la base avec des données de test
npx prisma db seed
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 👤 Identifiants de test

Un utilisateur admin est créé automatiquement lors du seed :

- **Email** : `admin@test.com`
- **Mot de passe** : `admin123`
- **Division** : BRONZE

## 📁 Structure du projet

```
codinquest/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts    # Routes NextAuth
│   │   │   └── signup/route.ts           # API d'inscription
│   │   ├── leaderboard/route.ts          # API du classement
│   │   ├── levels/route.ts                # API des niveaux
│   │   ├── quiz/
│   │   │   ├── [id]/route.ts              # API d'un quiz
│   │   │   └── [id]/submit/route.ts       # API de soumission
│   │   └── user/
│   │       ├── profile/route.ts           # API du profil
│   │       └── history/route.ts           # API de l'historique
│   ├── auth/
│   │   ├── signin/page.tsx                # Page de connexion
│   │   └── signup/page.tsx                # Page d'inscription
│   ├── dashboard/
│   │   ├── layout.tsx                     # Layout du dashboard
│   │   ├── page.tsx                       # Page principale
│   │   ├── history/page.tsx               # Page d'historique
│   │   ├── leaderboard/page.tsx           # Page de classement
│   │   ├── levels/[id]/page.tsx           # Page d'un niveau
│   │   └── quiz/[id]/page.tsx            # Page de quiz
│   ├── layout.tsx                         # Layout racine
│   ├── page.tsx                           # Page d'accueil
│   └── globals.css                        # Styles globaux
├── components/
│   ├── providers.tsx                      # SessionProvider
│   └── quiz/
│       ├── DivisionBadge.tsx             # Badge de division
│       ├── LeaderboardTable.tsx           # Tableau de classement
│       ├── ProgressBar.tsx                # Barre de progression
│       ├── QuizCard.tsx                   # Card de quiz
│       ├── QuizQuestion.tsx               # Composant question
│       ├── QuizTimer.tsx                  # Timer de quiz
│       ├── StatCard.tsx                   # Card de statistique
│       ├── types.ts                       # Types TypeScript
│       ├── divisions.ts                  # Utilitaires divisions
│       ├── validations.ts                 # Schémas Zod
│       └── index.ts                       # Barrel exports
├── lib/
│   ├── auth.ts                           # Configuration NextAuth
│   ├── prisma.ts                         # Client Prisma singleton
│   └── quiz/
│       ├── score.ts                      # Fonctions de scoring
│       ├── types.ts                      # Types TypeScript
│       ├── divisions.ts                  # Fonctions divisions
│       └── validations.ts                # Schémas Zod
├── prisma/
│   ├── schema.prisma                     # Schéma Prisma
│   ├── seed.ts                           # Script de seed
│   └── migrations/                       # Migrations (générées)
├── middleware.ts                         # Middleware NextAuth
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.example                          # Exemple de variables d'environnement
```

## 🔐 Authentification

L'application utilise NextAuth.js v5 avec :
- **Provider Credentials** (email/password)
- **JWT strategy** pour les sessions
- **Hashage bcrypt** pour les mots de passe
- **Validation Zod** pour les formulaires

## 🎯 Système de Divisions

### Ordre des divisions :
1. 🥉 **BRONZE** - Division de départ
2. 🥈 **SILVER** - 3 quiz réussis requis
3. 🥇 **GOLD** - 3 quiz réussis requis
4. 💎 **PLATINE** - 3 quiz réussis requis
5. 💠 **DIAMOND** - 3 quiz réussis requis
6. 👑 **MASTER** - 3 quiz réussis requis
7. ⭐ **CHALLENGER** - Division ultime

### Promotion :
- Après 3 quiz réussis consécutifs, promotion automatique à la division suivante
- `divisionPoints` est réinitialisé à 0 après promotion

## 📊 Base de données

Le schéma Prisma comprend :
- **User** - Utilisateurs avec progression
- **Level** - Niveaux regroupant les quiz
- **Quiz** - Quiz avec difficulté et limites
- **Question** - Questions avec points
- **Answer** - Réponses (QCM)
- **QuizAttempt** - Tentatives de quiz
- **UserAnswer** - Réponses utilisateur détaillées

## 🎨 Design

- **Dark mode** par défaut
- **Glassmorphism** pour les cards
- **Gradients** pour les éléments importants
- **Animations** subtiles et transitions smooth
- **Responsive** design (mobile-first)

## 🧪 Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Linting
npm run lint

# Prisma Studio (interface graphique)
npx prisma studio

# Vérifier TypeScript
npx tsc --noEmit

# Générer Prisma Client
npx prisma generate

# Créer une migration
npx prisma migrate dev

# Reset de la base (ATTENTION: supprime toutes les données)
npx prisma migrate reset
```

## 📝 Notes

- Les mots de passe doivent contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre
- Le score minimum pour réussir un quiz est de 70% par défaut
- Les quiz sont automatiquement verrouillés si la division minimale requise n'est pas atteinte

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez la `DATABASE_URL` dans `.env`
- Testez la connexion avec `npx prisma db push`

### Erreur NextAuth
- Vérifiez que `NEXTAUTH_SECRET` est défini dans `.env`
- Assurez-vous que `NEXTAUTH_URL` correspond à votre URL

### Erreurs TypeScript
```bash
npx tsc --noEmit
```

## 📄 Licence

MIT

## 🙏 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Fait avec ❤️ en utilisant Next.js, Prisma et Tailwind CSS**
