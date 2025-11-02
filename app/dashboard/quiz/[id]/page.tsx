'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizTimer } from '@/components/quiz/QuizTimer';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { Division } from '@prisma/client';

interface Answer {
  id: string;
  text: string;
  order: number;
}

interface Question {
  id: string;
  question: string;
  order: number;
  points: number;
  answers: Answer[];
}

interface QuizData {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  timeLimit: number | null;
  passingScore: number;
  level: {
    id: string;
    name: string;
    order: number;
    minDivision: Division;
  };
  questions: Question[];
}

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

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);

  // Récupérer l'ID du quiz depuis les params
  useEffect(() => {
    params.then((resolvedParams) => {
      setQuizId(resolvedParams.id);
    });
  }, [params]);

  // Charger le quiz
  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/quiz/${quizId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Quiz non trouvé');
          }
          throw new Error('Erreur lors du chargement du quiz');
        }

        const data = await response.json();
        setQuiz(data.quiz);
        setTimeStarted(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleSelectAnswer = (answerId: string) => {
    if (!quiz) return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || isSubmitting) return;

    // Vérifier que toutes les questions ont une réponse
    const allAnswered = quiz.questions.every((q) => userAnswers[q.id]);
    if (!allAnswered) {
      alert('Veuillez répondre à toutes les questions avant de soumettre.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculer le temps passé
      const timeSpent = timeStarted
        ? Math.floor((new Date().getTime() - timeStarted.getTime()) / 1000)
        : undefined;

      // Préparer les réponses pour l'API
      const answers = Object.entries(userAnswers).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));

      const response = await fetch(`/api/quiz/${quizId}/submit`, {
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
    if (!isSubmitting && quiz) {
      handleSubmit();
    }
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? userAnswers[currentQuestion.id] || null : null;
  const isLastQuestion = currentQuestionIndex === (quiz?.questions.length || 0) - 1;
  const allQuestionsAnswered = quiz?.questions.every((q) => userAnswers[q.id]) || false;
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 shadow-xl">
          <div className="text-center mb-8">
            {result.isPassed ? (
              <>
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">
                  Quiz réussi ! 🎉
                </h2>
                <p className="text-gray-400">
                  Félicitations, vous avez réussi ce quiz !
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">
                  Quiz échoué
                </h2>
                <p className="text-gray-400">
                  Dommage, vous n'avez pas atteint le score minimum requis.
                </p>
              </>
            )}
          </div>

          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {result.score}%
                </div>
                <div className="text-sm text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {result.pointsEarned}/{result.totalPoints}
                </div>
                <div className="text-sm text-gray-400">Points</div>
              </div>
            </div>

            {result.division && (
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold">
                    Promotion ! Vous êtes maintenant {result.division}
                  </span>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-400 text-center">
              Score minimum requis : {quiz?.passingScore || 70}%
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
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
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Recommencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !currentQuestion) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header du quiz */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-gray-400 text-sm">{quiz.description}</p>
            )}
          </div>
          {quiz.timeLimit && (
            <QuizTimer timeLimit={quiz.timeLimit} onTimeUp={handleTimeUp} />
          )}
        </div>

        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Question {currentQuestionIndex + 1} sur {quiz.questions.length}
            </span>
            <span className="text-gray-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question actuelle */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
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
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </button>

        <div className="flex gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : userAnswers[quiz.questions[index].id]
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                Terminer le quiz
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

