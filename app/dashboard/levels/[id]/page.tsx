import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLevelById } from '@/lib/data/levels';
import { DivisionBadge } from '@/components/quiz/DivisionBadge';
import { isDivisionAtLeast } from '@/lib/quiz/divisions';
import {
  ChevronRight,
  Home,
  Lock,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react';

interface Attempt {
  quizId: string;
  score: number;
  isPassed: boolean;
}

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const userId = session.user.id as string;
  const { id: levelId } = await params;

  const [level, attempts, user] = await Promise.all([
    getLevelById(levelId),
    prisma.quizAttempt.findMany({
      where: { userId },
      select: { quizId: true, score: true, isPassed: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { division: true },
    }),
  ]);

  if (!level) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">Niveau non trouvé</p>
          <Link
            href="/dashboard"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  const userDivision = user?.division ?? null;

  const getQuizStatus = (quizId: string, quizAttempts: Attempt[]) => {
    const relevant = quizAttempts.filter((a) => a.quizId === quizId);
    if (relevant.length === 0) return { attempted: false, passed: false, bestScore: null as number | null };

    const passedAttempts = relevant.filter((a) => a.isPassed);
    const bestAttempt = relevant.reduce((best, current) =>
      current.score > best.score ? current : best
    );

    return {
      attempted: true,
      passed: passedAttempts.length > 0,
      bestScore: bestAttempt.score,
    };
  };

  const locked = userDivision ? !isDivisionAtLeast(userDivision, level.minDivision) : false;
  const passedCount = level.quizzes.filter((quiz) => getQuizStatus(quiz.id, attempts).passed).length;
  const progressPercentage = level.quizzes.length > 0
    ? (passedCount / level.quizzes.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href="/dashboard"
          className="hover:text-white transition-colors"
        >
          Niveaux
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white font-medium">{level.name}</span>
      </nav>

      {/* Header du niveau */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              {locked && <Lock className="w-8 h-8 text-red-500" />}
              {level.name}
            </h1>
            {level.description && (
              <p className="text-gray-400">{level.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Division minimale requise :</span>
            <DivisionBadge division={level.minDivision} size="md" />
          </div>
        </div>

        {/* Message si verrouillé */}
        {locked && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-400">
              <Lock className="w-5 h-5" />
              <span className="font-semibold">
                Ce niveau est verrouillé. Vous devez atteindre la division {level.minDivision} pour y accéder.
              </span>
            </div>
          </div>
        )}

        {/* Statistiques du niveau */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 font-medium">Progression du niveau</span>
            <span className="text-sm font-semibold text-white">
              {passedCount} / {level.quizzes.length} quiz réussis
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {Math.round(progressPercentage)}% du niveau complété
          </p>
        </div>
      </div>

      {/* Liste des quiz */}
      {level.quizzes.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
          <p className="text-gray-400">Aucun quiz disponible pour ce niveau</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Quiz disponibles ({level.quizzes.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {level.quizzes.map((quiz) => {
              const status = getQuizStatus(quiz.id, attempts);

              return (
                <div
                  key={quiz.id}
                  className={`relative bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
                    locked
                      ? 'border-gray-700 opacity-60 cursor-not-allowed'
                      : status.passed
                      ? 'border-green-500/50 hover:border-green-500'
                      : status.attempted
                      ? 'border-red-500/50 hover:border-red-500'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {locked && (
                    <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center z-10">
                      <Lock className="w-12 h-12 text-gray-500" />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white flex-1">{quiz.title}</h3>
                    {status.passed && (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                    )}
                    {status.attempted && !status.passed && (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {quiz.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {quiz.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                        quiz.difficulty === 'EASY'
                          ? 'bg-green-500/20 text-green-400 border-green-500/50'
                          : quiz.difficulty === 'MEDIUM'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                      }`}
                    >
                      {quiz.difficulty === 'EASY'
                        ? 'Facile'
                        : quiz.difficulty === 'MEDIUM'
                        ? 'Moyen'
                        : 'Difficile'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {quiz.questionCount} questions
                    </span>
                    {quiz.timeLimit && (
                      <span className="text-xs text-gray-400">
                        {Math.floor(quiz.timeLimit / 60)} min
                      </span>
                    )}
                  </div>

                  {/* Meilleur score si tenté */}
                  {status.attempted && (
                    <div className="mb-4 p-2 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Meilleur score</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-blue-400" />
                          <span
                            className={`text-sm font-semibold ${
                              status.passed ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {status.bestScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Verrouillé : pas de Link du tout (plutôt qu'un onClick qui
                      intercepte la navigation), pour rester un Server Component */}
                  {locked ? (
                    <div className="block w-full text-center px-4 py-2 rounded-lg font-semibold bg-gray-700 text-gray-500 cursor-not-allowed">
                      Verrouillé
                    </div>
                  ) : (
                    <Link
                      href={`/dashboard/quiz/${quiz.id}`}
                      className={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                        status.passed
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : status.attempted
                          ? 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {status.passed ? 'Refaire' : status.attempted ? 'Réessayer' : 'Commencer'}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
