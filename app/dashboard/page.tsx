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
import { Trophy, CheckCircle2, Target, Lock } from 'lucide-react';

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
          <StatCard
            label="Score Total"
            value={profile.stats.totalScore.toLocaleString()}
            icon={Trophy}
            color="text-accent"
          />
          <StatCard
            label="Quiz Complétés"
            value={profile.stats.quizzesCompleted}
            icon={CheckCircle2}
            color="text-success"
          />
          <StatCard
            label="Taux de Réussite"
            value={`${profile.stats.successRate}%`}
            icon={Target}
            color="text-accent"
          />
        </div>
      </section>

      {/* Section Niveaux */}
      <section>
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">Niveaux</h2>
        <div className="space-y-8">
          {levels.map((level) => {
            const locked = !isDivisionAtLeast(profile.stats.division, level.minDivision);

            return (
              <div key={level.id} className="bg-surface border-[3px] border-border shadow-hard p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-display font-bold text-text-primary">{level.name}</h3>
                    <span className="text-xs text-text-secondary bg-surface-dimmed border-[3px] border-border px-2 py-1 uppercase tracking-wide">
                      Niveau {level.order}
                    </span>
                    {locked && (
                      <span className="flex items-center gap-1 text-xs text-error bg-error-surface border-[3px] border-error px-2 py-1 uppercase tracking-wide">
                        <Lock className="w-3 h-3" />
                        Division {level.minDivision} requise
                      </span>
                    )}
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
                          locked={locked}
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
            );
          })}
        </div>
      </section>
    </div>
  );
}
