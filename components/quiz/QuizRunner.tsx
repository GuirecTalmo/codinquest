'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Division } from '@prisma/client';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizTimer } from '@/components/quiz/QuizTimer';
import { QuizReview } from '@/components/quiz/QuizReview';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import type { QuizForUser } from '@/lib/data/quiz';
import { PixelIcon } from '@/components/PixelIcon';

interface SubmissionResult {
  success: boolean;
  score: number;
  isPassed: boolean;
  pointsEarned: number;
  totalPoints: number;
  division?: string;
  currentDivision: Division;
  divisionPoints: number;
  wasAlreadyMastered: boolean;
  correctAnswers: Array<{
    questionId: string;
    correctAnswerId: string;
    explanation: string | null;
  }>;
}

export function QuizRunner({ quiz }: { quiz: QuizForUser }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeStarted, setTimeStarted] = useState<Date>(() => new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const handleSelectAnswer = (answerId: string) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
    setShowIncompleteWarning(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (force = false) => {
    if (isSubmitting) return;

    // Vérifier que toutes les questions ont une réponse, sauf en cas de
    // soumission forcée (temps écoulé) : on envoie alors ce qui a été
    // répondu jusque-là plutôt que de bloquer l'utilisateur indéfiniment.
    if (!force) {
      const allAnswered = quiz.questions.every((q) => userAnswers[q.id]);
      if (!allAnswered) {
        setShowIncompleteWarning(true);
        return;
      }
    }

    setShowIncompleteWarning(false);
    setIsSubmitting(true);

    try {
      const timeSpent = Math.floor((new Date().getTime() - timeStarted.getTime()) / 1000);

      const answers = Object.entries(userAnswers).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));

      const response = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission du quiz');
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (!isSubmitting) {
      handleSubmit(true);
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestion.id] || null;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const allQuestionsAnswered = quiz.questions.every((q) => userAnswers[q.id]);
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-accent border-[3px] border-accent-border text-on-accent shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface border-[3px] border-border shadow-hard p-8">
          <div className="text-center mb-8">
            {result.isPassed ? (
              <>
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center border-[3px] border-success bg-success-surface">
                  <PixelIcon name="CheckCircle2" className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-3xl font-display font-bold text-text-primary mb-2">
                  Quiz réussi !
                </h2>
                <p className="text-text-secondary">
                  Félicitations, vous avez réussi ce quiz !
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center border-[3px] border-error bg-error-surface">
                  <PixelIcon name="XCircle" className="w-10 h-10 text-error" />
                </div>
                <h2 className="text-3xl font-display font-bold text-text-primary mb-2">
                  Quiz échoué
                </h2>
                <p className="text-text-secondary">
                  Dommage, vous n&apos;avez pas atteint le score minimum requis.
                </p>
              </>
            )}
          </div>

          <div className="bg-surface-dimmed border-[3px] border-border p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-text-primary mb-1">
                  {result.score}%
                </div>
                <div className="text-sm text-text-secondary uppercase tracking-wide">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-text-primary mb-1">
                  {result.pointsEarned}/{result.totalPoints}
                </div>
                <div className="text-sm text-text-secondary uppercase tracking-wide">Points</div>
              </div>
            </div>

            {result.division && (
              <div className="bg-accent border-[3px] border-accent-border p-4 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <PixelIcon name="Trophy" className="w-5 h-5 text-on-accent" />
                  <span className="text-on-accent font-semibold">
                    Promotion ! Vous êtes maintenant {result.division}
                  </span>
                </div>
              </div>
            )}

            <div className="text-sm text-text-secondary text-center">
              Score minimum requis : {quiz.passingScore}%
            </div>
          </div>

          {/* Conséquence sur la série de promotion -- c'est le moment où
              elle est gagnée ou perdue (voir PRODUCT.md), donc ça ne peut
              pas rester silencieux comme avant cette passe. */}
          {result.wasAlreadyMastered ? (
            <div className="flex items-center gap-2 bg-surface-dimmed border-[3px] border-border-dimmed text-text-secondary px-4 py-3 text-sm mb-6">
              <PixelIcon name="CheckCircle2" className="w-4 h-4 flex-shrink-0" />
              Quiz déjà validé : ce résultat n&apos;affecte pas ta série de promotion.
            </div>
          ) : (
            <div className="mb-6">
              {!result.isPassed && (
                <div className="flex items-center gap-2 bg-error-surface border-[3px] border-error text-error px-4 py-3 text-sm mb-4">
                  <PixelIcon name="AlertCircle" className="w-4 h-4 flex-shrink-0" />
                  Série remise à zéro : ce quiz n&apos;avait encore jamais été réussi.
                </div>
              )}
              <ProgressBar
                current={result.divisionPoints}
                total={3}
                division={result.currentDivision}
              />
            </div>
          )}

          <h3 className="text-lg font-display font-bold text-text-primary mb-4">Correction</h3>
          <div className="mb-6">
            <QuizReview
              questions={quiz.questions}
              userAnswers={userAnswers}
              correctAnswers={result.correctAnswers}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-4 py-3 bg-accent border-[3px] border-accent-border text-on-accent font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
            >
              Retour au dashboard
            </button>
            <button
              onClick={() => {
                setResult(null);
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setTimeStarted(new Date());
              }}
              className="flex-1 px-4 py-3 bg-surface border-[3px] border-border text-text-primary font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
            >
              <PixelIcon name="RotateCcw" className="w-4 h-4" />
              Recommencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header du quiz */}
      <div className="bg-surface border-[3px] border-border shadow-hard p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary mb-1">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-text-secondary text-sm">{quiz.description}</p>
            )}
          </div>
          {quiz.timeLimit && (
            <QuizTimer timeLimit={quiz.timeLimit} onTimeUp={handleTimeUp} />
          )}
        </div>

        {/* Rassure sur le risque réel d'un échec en rejouant un quiz déjà
            validé : la règle anti-triche le protège déjà côté serveur (voir
            PRODUCT.md), mais rien ne le disait à l'écran avant cette passe. */}
        {quiz.previousBest?.passed && (
          <div className="flex items-center gap-2 bg-surface-dimmed border-[3px] border-border-dimmed text-text-secondary px-4 py-3 text-sm mb-4">
            <PixelIcon name="CheckCircle2" className="w-4 h-4 flex-shrink-0" />
            Déjà validé — meilleur score {quiz.previousBest.bestScore}%. Un échec ici ne cassera pas ta série.
          </div>
        )}

        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              Question {currentQuestionIndex + 1} sur {quiz.questions.length}
            </span>
            <span className="text-text-secondary">
              {Math.round(progress)}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Progression du quiz"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full bg-surface-dimmed border-[3px] border-border h-2 overflow-hidden"
          >
            <div
              className="bg-accent h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question actuelle */}
      <div className="bg-surface border-[3px] border-border shadow-hard p-6 mb-6">
        <QuizQuestion
          question={currentQuestion}
          answers={currentQuestion.answers}
          selectedAnswer={currentAnswer}
          onSelectAnswer={handleSelectAnswer}
        />
      </div>

      {/* Avertissement de soumission incomplète -- remplace l'ancien
          alert() natif, qui cassait tout le système visuel pixel-art. */}
      {showIncompleteWarning && (
        <div className="flex items-center gap-2 bg-error-surface border-[3px] border-error text-error px-4 py-3 text-sm mb-4">
          <PixelIcon name="AlertCircle" className="w-4 h-4 flex-shrink-0" />
          Veuillez répondre à toutes les questions avant de soumettre.
        </div>
      )}

      {/* Navigation -- la rangée de pastilles défile dans son propre
          conteneur borné plutôt que de pousser Précédent/Suivant hors de
          l'écran sur mobile (mesuré : scrollWidth ~700px pour un viewport
          de 390px avec l'ancienne disposition en une seule rangée). */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-surface border-[3px] border-border disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0 transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
        >
          <PixelIcon name="ArrowLeft" className="w-4 h-4" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        <div className="flex-1 min-w-0 overflow-x-auto">
          <div className="flex gap-2 w-max mx-auto sm:mx-0">
            {quiz.questions.map((_, index) => {
              const isCurrent = index === currentQuestionIndex;
              const isAnswered = !!userAnswers[quiz.questions[index].id];
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Question ${index + 1}${isAnswered ? ' (répondue)' : ' (sans réponse)'}`}
                  className={`w-8 h-8 flex-shrink-0 border-[3px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring ${
                    isCurrent
                      ? 'bg-accent border-accent-border text-on-accent'
                      : isAnswered
                      ? 'bg-letter-badge-bg border-border text-letter-badge-text'
                      : 'bg-surface border-border text-text-secondary hover:border-accent-border'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {isLastQuestion ? (
          <button
            onClick={() => handleSubmit()}
            disabled={!allQuestionsAnswered || isSubmitting}
            className="flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2 bg-success border-[3px] border-success disabled:opacity-50 disabled:cursor-not-allowed text-on-state font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0 transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
          >
            {isSubmitting ? (
              'Envoi...'
            ) : (
              <>
                <span className="hidden sm:inline">Terminer le quiz</span>
                <span className="sm:hidden">Terminer</span>
                <PixelIcon name="CheckCircle2" className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2 bg-accent border-[3px] border-accent-border disabled:opacity-50 disabled:cursor-not-allowed text-on-accent font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0 transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring"
          >
            <span className="hidden sm:inline">Suivant</span>
            <PixelIcon name="ArrowRight" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
