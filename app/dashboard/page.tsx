import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getUserProfile } from '@/lib/data/profile';
import { getLevels } from '@/lib/data/levels';
import { DivisionBadge } from '@/components/quiz/DivisionBadge';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { StatCard } from '@/components/quiz/StatCard';
import { QuizCard } from '@/components/quiz/QuizCard';
import { isDivisionAtLeast } from '@/lib/quiz/divisions';
import { PixelIcon } from '@/components/PixelIcon';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const userId = session.user.id as string;

  const [profile, levels, attempts] = await Promise.all([
    getUserProfile(userId),
    getLevels(),
    prisma.quizAttempt.findMany({
      where: { userId },
      select: { quizId: true, score: true, isPassed: true },
    }),
  ]);

  if (!profile) {
    redirect('/auth/signin');
  }

  const getQuizStatus = (quizId: string) => {
    const quizAttempts = attempts.filter((a) => a.quizId === quizId);
    if (quizAttempts.length === 0) return { attempted: false, passed: false };

    return {
      attempted: true,
      passed: quizAttempts.some((a) => a.isPassed),
    };
  };

  // Seul le prochain niveau verrouillé (le plus proche dans l'ordre) garde un
  // résumé détaillé ; les suivants sont regroupés en une seule liste pour ne
  // pas noyer la page sous du contenu hors de portée (voir DESIGN.md, section
  // Layout -- un niveau = un palier de la division, pas une carte parmi
  // d'autres).
  const unlockedLevels = levels.filter((level) =>
    isDivisionAtLeast(profile.stats.division, level.minDivision)
  );
  const lockedLevels = levels.filter(
    (level) => !isDivisionAtLeast(profile.stats.division, level.minDivision)
  );
  const [nextLockedLevel, ...restLockedLevels] = lockedLevels;

  return (
    <div className="space-y-8">
      {/* Section Profil */}
      <section className="bg-surface border-[3px] border-border shadow-hard p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
              Bienvenue, {profile.user.name || profile.user.email} !
            </h1>
            <p className="text-text-secondary">
              Continuez à progresser et atteignez de nouvelles divisions
            </p>
          </div>
          <DivisionBadge division={profile.stats.division} size="lg" />
        </div>
        <ProgressBar
          current={profile.stats.divisionPoints}
          total={3}
          division={profile.stats.division}
        />
      </section>

      {/* Section Statistiques */}
      <section>
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Icônes neutres par défaut : le gold de l'accent est réservé aux
              états "agis maintenant" (CTA, promotion, nouveau), pas à de la
              statistique passive (voir DESIGN.md, Règle du Seul Accent). */}
          <StatCard
            label="Score Total"
            value={profile.stats.totalScore.toLocaleString()}
            icon="Trophy"
            color="text-text-secondary"
          />
          <StatCard
            label="Quiz Complétés"
            value={profile.stats.quizzesCompleted}
            icon="CheckCircle2"
            color="text-success"
          />
          <StatCard
            label="Taux de Réussite"
            value={`${profile.stats.successRate}%`}
            icon="Target"
            color="text-text-secondary"
          />
        </div>
      </section>

      {/* Section Niveaux */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="text-xl font-display font-bold text-text-primary">Niveaux</h2>
          <p className="text-xs text-text-secondary">
            Score minimum requis par défaut : 70 % (indiqué sur la carte uniquement si différent)
          </p>
        </div>
        <div className="space-y-8">
          {unlockedLevels.map((level) => (
            <div key={level.id} className="bg-surface border-[3px] border-border shadow-hard p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-xl font-display font-bold text-text-primary">{level.name}</h3>
                  <span className="text-xs text-text-secondary bg-surface-dimmed border-[3px] border-border px-2 py-1 uppercase tracking-wide">
                    Niveau {level.order}
                  </span>
                </div>
                {level.description && (
                  <p className="text-text-secondary text-sm">{level.description}</p>
                )}
              </div>

              {level.quizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {level.quizzes.map((quiz) => {
                    const status = getQuizStatus(quiz.id);

                    return (
                      <QuizCard
                        key={quiz.id}
                        quiz={{
                          id: quiz.id,
                          title: quiz.title,
                          description: quiz.description,
                          difficulty: quiz.difficulty,
                          timeLimit: quiz.timeLimit,
                          passingScore: quiz.passingScore,
                          passed: status.passed,
                          attempted: status.attempted,
                        }}
                        levelName={level.name}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-text-secondary text-center py-8">
                  Aucun quiz disponible pour ce niveau
                </p>
              )}
            </div>
          ))}

          {/* Niveau verrouillé le plus proche : résumé (pas la grille complète
              de quiz) pour que le prochain palier reste visible sans noyer
              la page sous du contenu encore inaccessible. */}
          {nextLockedLevel && (
            <div className="bg-surface border-[3px] border-border-dimmed p-6 opacity-80">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <PixelIcon name="Lock" className="w-5 h-5 text-text-secondary flex-shrink-0" />
                <h3 className="text-xl font-display font-bold text-text-primary">{nextLockedLevel.name}</h3>
                <span className="text-xs text-text-secondary bg-surface-dimmed border-[3px] border-border-dimmed px-2 py-1 uppercase tracking-wide">
                  Niveau {nextLockedLevel.order}
                </span>
                <span className="text-xs text-text-secondary bg-surface-dimmed border-[3px] border-border-dimmed px-2 py-1 uppercase tracking-wide">
                  Division {nextLockedLevel.minDivision} requise
                </span>
              </div>
              {nextLockedLevel.description && (
                <p className="text-text-secondary text-sm mb-2">{nextLockedLevel.description}</p>
              )}
              <p className="text-text-secondary text-xs">
                {nextLockedLevel.quizzes.length} quiz vous attendent une fois cette division atteinte
              </p>
            </div>
          )}

          {/* Niveaux verrouillés au-delà du prochain : une ligne chacun,
              pas de carte -- évite de faire défiler des dizaines de quiz
              totalement hors de portée pour l'instant. */}
          {restLockedLevels.length > 0 && (
            <div className="bg-surface-dimmed border-[3px] border-border-dimmed p-4">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-2">
                {restLockedLevels.length} niveau{restLockedLevels.length > 1 ? 'x' : ''} verrouillé
                {restLockedLevels.length > 1 ? 's' : ''} supplémentaire{restLockedLevels.length > 1 ? 's' : ''}
              </p>
              <ul className="space-y-1">
                {restLockedLevels.map((level) => (
                  <li key={level.id} className="flex items-center gap-2 text-sm text-text-secondary">
                    <PixelIcon name="Lock" className="w-3 h-3 flex-shrink-0" />
                    <span className="text-text-primary">{level.name}</span>
                    <span>— Division {level.minDivision} requise</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
