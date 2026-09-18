import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient, Division } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  recapText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Ordre de déblocage par division -- fondamentaux d'abord, frameworks
// ensuite, sujets avancés/spécialisés en dernier.
const CATEGORY_PLAN: { category: string; name: string; description: string; order: number; minDivision: Division }[] = [
  { category: 'HTML', name: 'HTML', description: "Structure, sémantique et accessibilité HTML pour vos entretiens techniques.", order: 1, minDivision: 'BRONZE' },
  { category: 'CSS/SCSS', name: 'CSS/SCSS', description: "Mise en page, sélecteurs et SCSS pour vos entretiens techniques.", order: 2, minDivision: 'BRONZE' },
  { category: 'JavaScript', name: 'JavaScript', description: "Fondamentaux et pièges classiques de JavaScript pour vos entretiens techniques.", order: 3, minDivision: 'SILVER' },
  { category: 'React', name: 'React', description: "Composants, hooks et rendu React pour vos entretiens techniques.", order: 4, minDivision: 'GOLD' },
  { category: 'Vue.js', name: 'Vue.js', description: "Réactivité et composants Vue pour vos entretiens techniques.", order: 5, minDivision: 'GOLD' },
  { category: 'Web Perf', name: 'Web Perf', description: "Core Web Vitals et optimisation de performance pour vos entretiens techniques.", order: 6, minDivision: 'PLATINE' },
  { category: 'IA', name: 'IA', description: "Outils IA pour développeurs (Copilot, chat, etc.) pour vos entretiens techniques.", order: 7, minDivision: 'DIAMOND' },
];

const CHUNK_SIZE = 10;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function main() {
  console.log('🌱 Début du seeding...');

  const questionsPath = join(__dirname, 'data', 'interview-questions.json');
  const allQuestions: InterviewQuestion[] = JSON.parse(readFileSync(questionsPath, 'utf-8'));

  await prisma.$transaction(async (tx) => {
    // 1. Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await tx.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        password: hashedPassword,
        name: 'Admin',
        division: 'BRONZE',
      },
    });
    console.log('✅ Utilisateur admin créé:', admin.email);

    // 2. Repartir d'un contenu de quiz propre -- supprime les anciens
    // niveaux/quiz (culture générale, etc.), puis remet à zéro la
    // progression de tous les comptes existants (leur historique ne
    // correspond plus à aucun quiz après ce reset). UserAnswer.questionId
    // n'est pas en cascade, donc on supprime explicitement dans l'ordre
    // plutôt que de compter sur la cascade Level -> Quiz -> Question.
    await tx.userAnswer.deleteMany({});
    await tx.quizAttempt.deleteMany({});
    await tx.level.deleteMany({});
    await tx.user.updateMany({
      data: {
        division: 'BRONZE',
        divisionPoints: 0,
        totalScore: 0,
        quizzesCompleted: 0,
      },
    });
    console.log('🧹 Anciens niveaux/quiz supprimés, progression réinitialisée');

    // 3. Créer les 7 niveaux (un par catégorie technique)
    const levelByCategory = new Map<string, { id: string }>();
    for (const plan of CATEGORY_PLAN) {
      const level = await tx.level.create({
        data: {
          name: plan.name,
          description: plan.description,
          order: plan.order,
          minDivision: plan.minDivision,
        },
      });
      levelByCategory.set(plan.category, level);
      console.log(`✅ Niveau créé: ${level.name}`);
    }

    // 4. Créer les quiz (par tranches de 10 questions) pour chaque catégorie
    const byCategory = new Map<string, InterviewQuestion[]>();
    for (const q of allQuestions) {
      const list = byCategory.get(q.category) ?? [];
      list.push(q);
      byCategory.set(q.category, list);
    }

    for (const plan of CATEGORY_PLAN) {
      const questions = byCategory.get(plan.category) ?? [];
      const level = levelByCategory.get(plan.category);
      if (!level) continue;

      const chunks = chunk(questions, CHUNK_SIZE);

      for (let i = 0; i < chunks.length; i++) {
        const part = chunks[i];
        const quiz = await tx.quiz.create({
          data: {
            title: `${plan.name} — Partie ${i + 1}`,
            description: plan.description,
            levelId: level.id,
            difficulty: 'MEDIUM',
            passingScore: 70,
            questions: {
              create: part.map((q, index) => ({
                question: q.question,
                explanation: q.explanation,
                order: index + 1,
                points: 1,
                answers: {
                  create: q.options.map((optionText, optionIndex) => ({
                    text: optionText,
                    isCorrect: optionIndex === q.correctIndex,
                    order: optionIndex + 1,
                  })),
                },
              })),
            },
          },
        });
        console.log(`✅ Quiz créé: ${quiz.title} (${part.length} questions)`);
      }
    }
  });

  console.log('✨ Seeding terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
