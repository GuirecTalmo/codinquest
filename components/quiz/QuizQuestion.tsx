'use client';

import { Radio } from 'lucide-react';

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
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
            {question.order}
          </span>
          <span className="text-sm text-gray-400 font-medium">
            {question.points} point{question.points > 1 ? 's' : ''}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">
          {question.question}
        </h3>
      </div>

      {/* Réponses */}
      <div className="space-y-3">
        {answers.map((answer) => {
          const isSelected = selectedAnswer === answer.id;

          return (
            <button
              key={answer.id}
              type="button"
              onClick={() => onSelectAnswer(answer.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg scale-[1.02]'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-500 bg-transparent'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={`flex-1 text-base font-medium ${
                    isSelected ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {answer.text}
                </span>
                {isSelected && (
                  <Radio className="w-5 h-5 text-blue-500 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

