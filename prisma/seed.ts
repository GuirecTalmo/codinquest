import { PrismaClient, Division, Difficulty } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

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

    // 2. Créer les 3 niveaux
    const levels = [
      {
        name: 'Débutant',
        description: 'Quiz pour débutants, niveau facile',
        order: 1,
        minDivision: 'BRONZE' as Division,
      },
      {
        name: 'Intermédiaire',
        description: 'Quiz pour utilisateurs intermédiaires',
        order: 2,
        minDivision: 'SILVER' as Division,
      },
      {
        name: 'Avancé',
        description: 'Quiz pour utilisateurs avancés',
        order: 3,
        minDivision: 'GOLD' as Division,
      },
    ];

    const createdLevels = [];
    for (const levelData of levels) {
      const level = await tx.level.upsert({
        where: { order: levelData.order },
        update: {},
        create: levelData,
      });
      createdLevels.push(level);
      console.log(`✅ Niveau créé: ${level.name}`);
    }

    // 3. Créer les quiz avec questions et réponses
    const quizzesData = [
      // Niveau 1 - Débutant (EASY)
      {
        title: 'Culture Générale - Débutant',
        description: 'Testez vos connaissances générales de base',
        levelOrder: 1,
        difficulty: 'EASY' as Difficulty,
        questions: [
          {
            question: 'Quelle est la capitale de la France ?',
            order: 1,
            points: 1,
            answers: [
              { text: 'Paris', isCorrect: true, order: 1 },
              { text: 'Lyon', isCorrect: false, order: 2 },
              { text: 'Marseille', isCorrect: false, order: 3 },
              { text: 'Bordeaux', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Combien de continents y a-t-il sur Terre ?',
            order: 2,
            points: 1,
            answers: [
              { text: '5', isCorrect: false, order: 1 },
              { text: '6', isCorrect: false, order: 2 },
              { text: '7', isCorrect: true, order: 3 },
              { text: '8', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quelle est la plus grande planète du système solaire ?',
            order: 3,
            points: 1,
            answers: [
              { text: 'Terre', isCorrect: false, order: 1 },
              { text: 'Mars', isCorrect: false, order: 2 },
              { text: 'Jupiter', isCorrect: true, order: 3 },
              { text: 'Saturne', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Qui a peint la Joconde ?',
            order: 4,
            points: 1,
            answers: [
              { text: 'Picasso', isCorrect: false, order: 1 },
              { text: 'Van Gogh', isCorrect: false, order: 2 },
              { text: 'Léonard de Vinci', isCorrect: true, order: 3 },
              { text: 'Monet', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quel est le plus grand océan du monde ?',
            order: 5,
            points: 1,
            answers: [
              { text: 'Océan Atlantique', isCorrect: false, order: 1 },
              { text: 'Océan Pacifique', isCorrect: true, order: 2 },
              { text: 'Océan Indien', isCorrect: false, order: 3 },
              { text: 'Océan Arctique', isCorrect: false, order: 4 },
            ],
          },
        ],
      },
      {
        title: 'Sciences - Débutant',
        description: 'Questions scientifiques de base',
        levelOrder: 1,
        difficulty: 'EASY' as Difficulty,
        questions: [
          {
            question: 'Quelle est la formule chimique de l\'eau ?',
            order: 1,
            points: 1,
            answers: [
              { text: 'CO2', isCorrect: false, order: 1 },
              { text: 'H2O', isCorrect: true, order: 2 },
              { text: 'O2', isCorrect: false, order: 3 },
              { text: 'NaCl', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Combien de pattes a une araignée ?',
            order: 2,
            points: 1,
            answers: [
              { text: '6', isCorrect: false, order: 1 },
              { text: '8', isCorrect: true, order: 2 },
              { text: '10', isCorrect: false, order: 3 },
              { text: '12', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quelle planète est la plus proche du Soleil ?',
            order: 3,
            points: 1,
            answers: [
              { text: 'Vénus', isCorrect: false, order: 1 },
              { text: 'Mercure', isCorrect: true, order: 2 },
              { text: 'Terre', isCorrect: false, order: 3 },
              { text: 'Mars', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Combien de dents a un adulte en moyenne ?',
            order: 4,
            points: 1,
            answers: [
              { text: '28', isCorrect: false, order: 1 },
              { text: '30', isCorrect: false, order: 2 },
              { text: '32', isCorrect: true, order: 3 },
              { text: '34', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quel gaz représente environ 78% de l\'atmosphère terrestre ?',
            order: 5,
            points: 1,
            answers: [
              { text: 'Oxygène', isCorrect: false, order: 1 },
              { text: 'Azote', isCorrect: true, order: 2 },
              { text: 'Dioxyde de carbone', isCorrect: false, order: 3 },
              { text: 'Hydrogène', isCorrect: false, order: 4 },
            ],
          },
        ],
      },
      // Niveau 2 - Intermédiaire (MEDIUM)
      {
        title: 'Histoire - Intermédiaire',
        description: 'Testez vos connaissances historiques',
        levelOrder: 2,
        difficulty: 'MEDIUM' as Difficulty,
        questions: [
          {
            question: 'En quelle année a eu lieu la Révolution française ?',
            order: 1,
            points: 1,
            answers: [
              { text: '1787', isCorrect: false, order: 1 },
              { text: '1789', isCorrect: true, order: 2 },
              { text: '1791', isCorrect: false, order: 3 },
              { text: '1793', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Qui a découvert l\'Amérique en 1492 ?',
            order: 2,
            points: 1,
            answers: [
              { text: 'Vasco de Gama', isCorrect: false, order: 1 },
              { text: 'Christophe Colomb', isCorrect: true, order: 2 },
              { text: 'Marco Polo', isCorrect: false, order: 3 },
              { text: 'Magellan', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quelle guerre a opposé les États-Unis au Vietnam ?',
            order: 3,
            points: 1,
            answers: [
              { text: 'Guerre de Corée', isCorrect: false, order: 1 },
              { text: 'Guerre du Vietnam', isCorrect: true, order: 2 },
              { text: 'Guerre froide', isCorrect: false, order: 3 },
              { text: 'Première Guerre mondiale', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quel empire était dirigé par Napoléon Bonaparte ?',
            order: 4,
            points: 1,
            answers: [
              { text: 'Empire romain', isCorrect: false, order: 1 },
              { text: 'Empire français', isCorrect: true, order: 2 },
              { text: 'Empire britannique', isCorrect: false, order: 3 },
              { text: 'Empire ottoman', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'En quelle année a pris fin la Seconde Guerre mondiale ?',
            order: 5,
            points: 1,
            answers: [
              { text: '1944', isCorrect: false, order: 1 },
              { text: '1945', isCorrect: true, order: 2 },
              { text: '1946', isCorrect: false, order: 3 },
              { text: '1947', isCorrect: false, order: 4 },
            ],
          },
        ],
      },
      {
        title: 'Géographie - Intermédiaire',
        description: 'Connaissances géographiques approfondies',
        levelOrder: 2,
        difficulty: 'MEDIUM' as Difficulty,
        questions: [
          {
            question: 'Quel est le plus haut sommet du monde ?',
            order: 1,
            points: 1,
            answers: [
              { text: 'Mont Kilimandjaro', isCorrect: false, order: 1 },
              { text: 'Mont Everest', isCorrect: true, order: 2 },
              { text: 'Mont Blanc', isCorrect: false, order: 3 },
              { text: 'K2', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quel est le plus grand désert du monde ?',
            order: 2,
            points: 1,
            answers: [
              { text: 'Désert du Sahara', isCorrect: false, order: 1 },
              { text: 'Désert de Gobi', isCorrect: false, order: 2 },
              { text: 'Désert d\'Arabie', isCorrect: false, order: 3 },
              { text: 'Antarctique', isCorrect: true, order: 4 },
            ],
          },
          {
            question: 'Quel fleuve traverse l\'Égypte ?',
            order: 3,
            points: 1,
            answers: [
              { text: 'Tigre', isCorrect: false, order: 1 },
              { text: 'Euphrate', isCorrect: false, order: 2 },
              { text: 'Nil', isCorrect: true, order: 3 },
              { text: 'Congo', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quelle est la plus grande île du monde ?',
            order: 4,
            points: 1,
            answers: [
              { text: 'Madagascar', isCorrect: false, order: 1 },
              { text: 'Groenland', isCorrect: true, order: 2 },
              { text: 'Bornéo', isCorrect: false, order: 3 },
              { text: 'Sumatra', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Dans quel pays se trouve la ville de Machu Picchu ?',
            order: 5,
            points: 1,
            answers: [
              { text: 'Chili', isCorrect: false, order: 1 },
              { text: 'Pérou', isCorrect: true, order: 2 },
              { text: 'Bolivie', isCorrect: false, order: 3 },
              { text: 'Équateur', isCorrect: false, order: 4 },
            ],
          },
        ],
      },
      // Niveau 3 - Avancé (HARD)
      {
        title: 'Sciences Avancées',
        description: 'Questions scientifiques complexes',
        levelOrder: 3,
        difficulty: 'HARD' as Difficulty,
        questions: [
          {
            question: 'Quelle est la vitesse de la lumière dans le vide ?',
            order: 1,
            points: 1,
            answers: [
              { text: '299 792 458 m/s', isCorrect: true, order: 1 },
              { text: '300 000 000 m/s', isCorrect: false, order: 2 },
              { text: '150 000 000 m/s', isCorrect: false, order: 3 },
              { text: '299 792 458 km/h', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quel est le nombre d\'Avogadro approximatif ?',
            order: 2,
            points: 1,
            answers: [
              { text: '6.02 x 10²²', isCorrect: false, order: 1 },
              { text: '6.02 x 10²³', isCorrect: true, order: 2 },
              { text: '6.02 x 10²⁴', isCorrect: false, order: 3 },
              { text: '6.02 x 10²⁵', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quelle particule est responsable de la force nucléaire faible ?',
            order: 3,
            points: 1,
            answers: [
              { text: 'Photon', isCorrect: false, order: 1 },
              { text: 'Gluon', isCorrect: false, order: 2 },
              { text: 'Boson W et Z', isCorrect: true, order: 3 },
              { text: 'Graviton', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quelle est la température absolue zéro en Celsius ?',
            order: 4,
            points: 1,
            answers: [
              { text: '-273.15°C', isCorrect: true, order: 1 },
              { text: '-273.16°C', isCorrect: false, order: 2 },
              { text: '-273.14°C', isCorrect: false, order: 3 },
              { text: '0°C', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quel est le principe d\'incertitude d\'Heisenberg ?',
            order: 5,
            points: 1,
            answers: [
              { text: 'On ne peut connaître simultanément position et vitesse exactes', isCorrect: true, order: 1 },
              { text: 'L\'énergie ne peut être créée ni détruite', isCorrect: false, order: 2 },
              { text: 'Tout est relatif', isCorrect: false, order: 3 },
              { text: 'La lumière est à la fois onde et particule', isCorrect: false, order: 4 },
            ],
          },
        ],
      },
      {
        title: 'Littérature et Arts Avancés',
        description: 'Connaissances approfondies en littérature et arts',
        levelOrder: 3,
        difficulty: 'HARD' as Difficulty,
        questions: [
          {
            question: 'Qui a écrit "L\'Étranger" ?',
            order: 1,
            points: 1,
            answers: [
              { text: 'Jean-Paul Sartre', isCorrect: false, order: 1 },
              { text: 'Albert Camus', isCorrect: true, order: 2 },
              { text: 'André Malraux', isCorrect: false, order: 3 },
              { text: 'Marcel Proust', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quelle période artistique est caractérisée par le "Guernica" de Picasso ?',
            order: 2,
            points: 1,
            answers: [
              { text: 'Impressionnisme', isCorrect: false, order: 1 },
              { text: 'Cubisme', isCorrect: true, order: 2 },
              { text: 'Surréalisme', isCorrect: false, order: 3 },
              { text: 'Expressionnisme', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quel compositeur a écrit "La Flûte enchantée" ?',
            order: 3,
            points: 1,
            answers: [
              { text: 'Beethoven', isCorrect: false, order: 1 },
              { text: 'Mozart', isCorrect: true, order: 2 },
              { text: 'Bach', isCorrect: false, order: 3 },
              { text: 'Chopin', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quelle est la première pièce de théâtre de Molière ?',
            order: 4,
            points: 1,
            answers: [
              { text: 'Le Tartuffe', isCorrect: false, order: 1 },
              { text: 'L\'École des femmes', isCorrect: false, order: 2 },
              { text: 'Le Médecin volant', isCorrect: true, order: 3 },
              { text: 'Le Misanthrope', isCorrect: false, order: 4 },
            ],
          },
          {
            question: 'Quel mouvement artistique est associé à Salvador Dali ?',
            order: 5,
            points: 1,
            answers: [
              { text: 'Dadaïsme', isCorrect: false, order: 1 },
              { text: 'Surréalisme', isCorrect: true, order: 2 },
              { text: 'Fauvisme', isCorrect: false, order: 3 },
              { text: 'Futurisme', isCorrect: false, order: 4 },
            ],
          },
        ],
      },
    ];

    // Créer les quiz avec leurs questions et réponses
    for (const quizData of quizzesData) {
      const level = createdLevels.find((l) => l.order === quizData.levelOrder);
      if (!level) {
        throw new Error(`Niveau avec order ${quizData.levelOrder} non trouvé`);
      }

      const quiz = await tx.quiz.create({
        data: {
          title: quizData.title,
          description: quizData.description,
          levelId: level.id,
          difficulty: quizData.difficulty,
          passingScore: 70,
          questions: {
            create: quizData.questions.map((q) => ({
              question: q.question,
              order: q.order,
              points: q.points,
              answers: {
                create: q.answers.map((a) => ({
                  text: a.text,
                  isCorrect: a.isCorrect,
                  order: a.order,
                })),
              },
            })),
          },
        },
      });
      console.log(`✅ Quiz créé: ${quiz.title} (${quiz.difficulty})`);
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


