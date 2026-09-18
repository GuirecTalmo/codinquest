'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizTimer } from '@/components/quiz/QuizTimer';
import type { QuizForUser } from '@/lib/data/quiz';
import { PixelIcon } from '@/components/PixelIcon';

interface SubmissionResult {
  success: boolean;
  score: number;
  isPassed: boolean;
  pointsEarned: number;
  totalPoints: number;
  division?: string;
  correctAnswers: Array<{
    questionId: string;
    correctAnswerId: string;
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

  const handleSelectAnswer = (answerId: string) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
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
        alert('Veuillez répondre à toutes les questions avant de soumettre.');
        return;
      }
    }

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
            className="px-4 py-2 bg-accent border-[3px] border-accent-border text-on-accent shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
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

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-4 py-3 bg-accent border-[3px] border-accent-border text-on-accent font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
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
              className="flex-1 px-4 py-3 bg-surface border-[3px] border-border text-text-primary font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center justify-center gap-2"
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
          <div className="w-full bg-surface-dimmed border-[3px] border-border h-2 overflow-hidden">
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

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-surface border-[3px] border-border disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0 transition-all"
        >
          <PixelIcon name="ArrowLeft" className="w-4 h-4" />
          Précédent
        </button>

        <div className="flex gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 border-[3px] text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-accent border-accent-border text-on-accent'
                  : userAnswers[quiz.questions[index].id]
                  ? 'bg-success border-success text-on-state'
                  : 'bg-surface border-border text-text-secondary hover:border-accent-border'
              }`}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <button
            onClick={() => handleSubmit()}
            disabled={!allQuestionsAnswered || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-success border-[3px] border-success disabled:opacity-50 disabled:cursor-not-allowed text-on-state font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0 transition-all"
          >
            {isSubmitting ? (
              'Envoi...'
            ) : (
              <>
                Terminer le quiz
                <PixelIcon name="CheckCircle2" className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="flex items-center gap-2 px-6 py-2 bg-accent border-[3px] border-accent-border disabled:opacity-50 disabled:cursor-not-allowed text-on-accent font-semibold shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:shadow-hard disabled:translate-x-0 disabled:translate-y-0 transition-all"
          >
            Suivant
            <PixelIcon name="ArrowRight" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
