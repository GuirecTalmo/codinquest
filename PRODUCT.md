# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Auto-apprenants front-end : développeurs débutants ou autodidactes qui veulent
tester et renforcer leurs connaissances HTML/CSS/JS/React de façon ludique,
en solo, plutôt que dans un cadre scolaire ou d'entretien formel.

## Product Purpose

CodeInQuest est une application de quiz interactive pour s'entraîner sur des
sujets front-end. Elle existe pour rendre l'auto-apprentissage motivant en le
transformant en progression mesurable : quiz à QCM, scoring, historique, et
montée dans un classement mondial. Le succès se mesure à l'engagement répété
(séries de réussites, montée en division) autant qu'à la maîtrise du contenu.

## Positioning

Le mécanisme différenciant est l'échelle de divisions façon ranked (Bronze →
Silver → Gold → Platine → Diamond → Master → Challenger), avec promotion après
3 réussites réellement consécutives — le même ressort qu'un matchmaking de jeu
compétitif, appliqué à des quiz de connaissances. Un quiz classique qui se
contente d'un score en % ne pourrait pas reproduire honnêtement cette
mécanique de classement et de séries.

## Operating Context

- Usage solo, navigateur web (desktop et mobile web, pas d'app native).
- Interface et contenu entièrement en français.
- Hébergement auto-géré sur VPS (Caddy en reverse proxy + service systemd),
  pas de plateforme managée type Vercel — voir `deploy/`.
- Base PostgreSQL via Prisma ; NextAuth.js v5 pour l'authentification.

## Capabilities and Constraints

Règles de progression figées (arbitrées explicitement avec l'utilisateur,
anti-triche) — à respecter ou remettre en question explicitement avec lui
avant toute modification :

- Seule la **première réussite** d'un quiz compte pour `totalScore`,
  `divisionPoints` et `quizzesCompleted` ; les tentatives suivantes vont dans
  l'historique sans affecter les stats agrégées.
- `quizzesCompleted` = nombre de quiz **distincts** réussis au moins une fois.
- **Promotion = 3 réussites réellement consécutives.** Un échec sur un quiz
  jamais réussi remet `divisionPoints` à 0 ; un échec en rejouant un quiz déjà
  maîtrisé ne casse pas la série.
- **Taux de Réussite = quiz distincts réussis / quiz distincts tentés**,
  calculé côté serveur uniquement (`/api/user/profile`).
- **L'email d'un utilisateur n'apparaît jamais** dans le payload du
  classement ; le serveur résout un nom d'affichage.
- **L'autorisation ne se base jamais sur la session NextAuth** : la division
  doit être relue en base, jamais depuis le JWT.
- Rate limiting actuellement in-memory (`lib/rate-limit.ts`), sans Redis —
  connu comme non scalable en multi-instance.

Autres faits produit confirmés :

- 7 divisions, 3 niveaux de difficulté (Débutant/Intermédiaire/Avancé), QCM à
  4 réponses, quiz optionnellement chronométrés.
- Score de passage par quiz (`passingScore`, 70% par défaut).

## Brand Commitments

- Nom du produit : **CodeInQuest**.
- Voix et contenu en français.
- Identité visuelle déjà engagée : univers rétro/pixel-art jeu vidéo (icônes
  pixelisées, coffre comme logo, style néo-brutaliste "shadow-hard"), ton
  gamer/ludique plutôt que corporate.

## Evidence on Hand

Aucun témoignage, étude de cas ou preuve externe. Produit en développement
solo, pas de métriques d'usage réel documentées à ce jour — ne pas inventer de
chiffres, de témoignages ou de logos clients dans les futurs écrans.

## Product Principles

1. **Le classement doit rester gagné, pas gaméable.** Toute évolution de
   scoring ou de progression passe par les invariants anti-triche ci-dessus.
2. **La compétition est le moteur de rétention**, pas un habillage — les
   futurs écrans doivent rendre la série/promotion/classement visibles et
   gratifiants, pas secondaires au contenu du quiz.
3. **Le contenu et le classement sont solo-first** : pas de fonctionnalités
   sociales/temps réel à supposer implicitement.
4. **Rien ne doit casser un déploiement VPS auto-géré** (pas de dépendance
   implicite à une plateforme managée type edge functions Vercel).
5. **Ne jamais exposer l'email ou des données personnelles** dans un contenu
   public (classement, profils partagés).

## Accessibility & Inclusion

Aucune exigence spécifique établie à ce jour au-delà des standards habituels
du web.
