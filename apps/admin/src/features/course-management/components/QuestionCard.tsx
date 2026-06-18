import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import React from 'react';

import type { QuestionCardProps } from '../types';

export function QuestionCard({ question, index, onDelete }: QuestionCardProps) {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-on-surface font-body-lg-ar">
          <span className="text-primary ml-2">{index + 1}.</span>
          {question.text}
        </h4>
        <button
          onClick={() => onDelete(question.id)}
          className="text-error hover:bg-error/10 p-2 rounded-full transition-colors"
          title="حذف السؤال"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="space-y-2 pr-6">
        {question.options.map((opt) => (
          <div
            key={opt.id}
            className={`flex items-center gap-3 p-3 rounded-lg border ${opt.isCorrect ? 'border-primary/50 bg-primary/5 text-primary' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant'}`}
          >
            {opt.isCorrect ? (
              <CheckCircle2 size={18} />
            ) : (
              <Circle size={18} className="opacity-40" />
            )}
            <span className="font-medium text-sm">{opt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
