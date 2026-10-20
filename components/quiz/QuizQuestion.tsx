'use client';

import { renderInlineCode } from './InlineCode';

interface Answer {
  id: string;
  text: string;
  order: number;
}

interface QuizQuestionProps {
  question: {
    id: string;
    question: string;
    order: number;
    points: number;
  };
  answers: Answer[];
  selectedAnswer: string | null;
  onSelectAnswer: (answerId: string) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function QuizQuestion({
  question,
  answers,
  selectedAnswer,
  onSelectAnswer,
}: QuizQuestionProps) {
  return (
    <div className="w-full mb-8">
      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center justify-center w-8 h-8 bg-accent border-[3px] border-accent-border text-on-accent font-bold text-sm">
            {question.order}
          </span>
          <span className="text-sm text-text-secondary font-medium uppercase tracking-wide">
            {question.points} point{question.points > 1 ? 's' : ''}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          {renderInlineCode(question.question)}
        </h2>
      </div>

      {/* Réponses -- badge lettré A-D + rangée bordée + hard-shadow, comme
          les answer-option de la source (Codin'sideQuest). Le groupe est
          exposé comme un radiogroup : une seule réponse sélectionnable à la
          fois, state porté par aria-checked plutôt que par la seule couleur. */}
      <div className="space-y-3" role="radiogroup" aria-label="Choix de réponse">
        {answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer.id;
          const letter = OPTION_LETTERS[index] ?? '';

          return (
            <button
              key={answer.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Réponse ${letter} : ${answer.text}`}
              onClick={() => onSelectAnswer(answer.id)}
              className={`w-full text-left p-4 border-[3px] transition-all duration-200 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring ${
                isSelected
                  ? 'border-accent-border bg-surface shadow-none translate-x-[2px] translate-y-[2px]'
                  : 'border-border bg-surface shadow-hard hover:border-accent-border'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border-[3px] font-bold text-sm ${
                  isSelected
                    ? 'bg-accent border-accent-border text-on-accent'
                    : 'bg-letter-badge-bg border-border text-letter-badge-text'
                }`}
              >
                {letter}
              </span>
              <span
                aria-hidden="true"
                className={`flex-1 text-base font-medium ${
                  isSelected ? 'text-text-primary' : 'text-text-secondary'
                }`}
              >
                {renderInlineCode(answer.text)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
