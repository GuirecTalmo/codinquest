# codinquest

// This is your Prisma schema file

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

// Modèle Utilisateur
model User {
id String @id @default(cuid())
email String @unique
name String?
password String // Hash du mot de passe
image String?

// Progression et statistiques
division Division @default(BRONZE)
divisionPoints Int @default(0) // 0-2 points avant passage division suivante
totalScore Int @default(0)
quizzesCompleted Int @default(0)

// Relations
attempts QuizAttempt[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([division, totalScore])
}

// Enum pour les divisions
enum Division {
BRONZE
SILVER
GOLD
PLATINE
DIAMOND
MASTER
CHALLENGER
}

// Modèle Niveau (regroupement de quiz)
model Level {
id String @id @default(cuid())
name String
description String?
order Int @unique // Pour trier les niveaux
minDivision Division @default(BRONZE) // Division minimale requise

// Relations
quizzes Quiz[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([order])
}

// Modèle Quiz
model Quiz {
id String @id @default(cuid())
title String
description String?
levelId String
difficulty Difficulty @default(MEDIUM)
timeLimit Int? // En secondes, optionnel
passingScore Int @default(70) // Pourcentage minimum pour réussir

// Relations
level Level @relation(fields: [levelId], references: [id], onDelete: Cascade)
questions Question[]
attempts QuizAttempt[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([levelId])
}

enum Difficulty {
EASY
MEDIUM
HARD
}

// Modèle Question
model Question {
id String @id @default(cuid())
quizId String
question String
order Int // Ordre d'affichage dans le quiz
points Int @default(1) // Points attribués pour cette question

// Relations
quiz Quiz @relation(fields: [quizId], references: [id], onDelete: Cascade)
answers Answer[]
userAnswers UserAnswer[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([quizId])
}

// Modèle Réponse (options du QCM)
model Answer {
id String @id @default(cuid())
questionId String
text String
isCorrect Boolean @default(false)
order Int // Ordre d'affichage

// Relations
question Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
userAnswers UserAnswer[]

@@index([questionId])
}

// Modèle Tentative de Quiz
model QuizAttempt {
id String @id @default(cuid())
userId String
quizId String

// Résultats
score Int // Score obtenu sur 100
pointsEarned Int @default(0) // Points réels obtenus
totalPoints Int // Points maximum possible
isPassed Boolean // true si score >= passingScore
timeSpent Int? // Temps passé en secondes

// Relations
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
quiz Quiz @relation(fields: [quizId], references: [id], onDelete: Cascade)
userAnswers UserAnswer[]

startedAt DateTime @default(now())
completedAt DateTime @default(now())

@@index([userId, completedAt])
@@index([quizId])
}

// Modèle Réponse Utilisateur (pour l'historique détaillé)
model UserAnswer {
id String @id @default(cuid())
attemptId String
questionId String
answerId String

// Relations
attempt QuizAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
question Question @relation(fields: [questionId], references: [id])
answer Answer @relation(fields: [answerId], references: [id])

createdAt DateTime @default(now())

@@index([attemptId])
@@unique([attemptId, questionId]) // Une seule réponse par question par tentative
}
