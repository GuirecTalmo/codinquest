'use client';

import { PixelIcon } from '@/components/PixelIcon';
import { renderInlineCode } from './InlineCode';

interface ReviewAnswer {
  id: string;
  text: string;
  order: number;
}

interface ReviewQuestion {
  id: string;
  question: string;
  order: number;
  answers: ReviewAnswer[];
}

interface CorrectAnswerEntry {
  questionId: string;
  correctAnswerId: string;
  explanation: string | null;
}

interface QuizReviewProps {
  questions: ReviewQuestion[];
  userAnswers: Record<string, string>;
  correctAnswers: CorrectAnswerEntry[];
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/**
 * Correction affichée en fin de quiz : bonne réponse, choix de
 * l'utilisateur si différent, et explication -- jamais montré avant
 * soumission (l'API ne renvoie l'explication qu'à ce moment-là).
 */
export function QuizReview({ questions, userAnswers, correctAnswers }: QuizReviewProps) {
  const correctByQuestion = new Map(correctAnswers.map((c) => [c.questionId, c]));

  return (
    <div className="space-y-4">
      {questions.map((question) => {
        const correct = correctByQuestion.get(question.id);
        const selectedAnswerId = userAnswers[question.id] ?? null;
        const wasCorrect = !!correct && selectedAnswerId === correct.correctAnswerId;

        return (
          <div
            key={question.id}
            className={`bg-surface border-[3px] p-5 ${wasCorrect ? 'border-success' : 'border-error'}`}
          >
            <div className="flex items-start gap-3 mb-3">
              {wasCorrect ? (
                <PixelIcon name="CheckCircle2" className="w-5 h-5 text-success flex-shrink-0 mt-1" />
              ) : (
                <PixelIcon name="XCircle" className="w-5 h-5 text-error flex-shrink-0 mt-1" />
              )}
              <h4 className="text-base font-semibold text-text-primary">
                {renderInlineCode(question.question)}
              </h4>
            </div>

            <div className="space-y-2 mb-3">
              {question.answers.map((answer, index) => {
                const isCorrectAnswer = correct?.correctAnswerId === answer.id;
                const isUserPick = selectedAnswerId === answer.id;

                return (
                  <div
                    key={answer.id}
                    className={`flex items-center gap-3 px-3 py-2 border-[3px] text-sm ${
                      isCorrectAnswer
                        ? 'bg-success-surface border-success text-success'
                        : isUserPick
                        ? 'bg-error-surface border-error text-error'
                        : 'bg-surface-dimmed border-border-dimmed text-text-secondary'
                    }`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center border-[3px] border-current text-xs font-bold">
                      {OPTION_LETTERS[index] ?? ''}
                    </span>
                    <span>{renderInlineCode(answer.text)}</span>
                  </div>
                );
              })}
            </div>

            {correct?.explanation && (
              <p className="text-sm text-text-secondary border-t-[3px] border-border pt-3">
                {renderInlineCode(correct.explanation)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
