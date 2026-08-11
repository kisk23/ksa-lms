import { apiClient } from '@shared/lib/api-client';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

import { inputStyles } from '../styles';
import type { QuestionOption, AddQuestionFormProps } from '../types';

export function AddQuestionForm({
  assignmentId,
  questionCount,
  onSuccess,
  onCancel,
}: AddQuestionFormProps) {
  const [questionText, setQuestionText] = useState('');
  const [questionOptions, setQuestionOptions] = useState<Omit<QuestionOption, 'id'>[]>([
    { text: '', isCorrect: true, orderIndex: 1 },
    { text: '', isCorrect: false, orderIndex: 2 },
  ]);

  const newQuestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newQuestionRef.current) {
      newQuestionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleAddQuestion = async () => {
    if (!questionText.trim() || questionOptions.length < 2) {
      toast.error('الرجاء كتابة السؤال وإضافة خيارين على الأقل.');
      return;
    }
    const hasCorrectOption = questionOptions.some((option) => option.isCorrect);
    if (!hasCorrectOption) {
      toast.error('الرجاء تحديد إجابة صحيحة واحدة على الأقل.');
      return;
    }

    try {
      await apiClient.post(`/assignments/${assignmentId}/questions`, {
        text: questionText.trim(),
        orderIndex: questionCount + 1,
        options: questionOptions.map((option, index) => ({
          text: option.text.trim(),
          isCorrect: option.isCorrect,
          orderIndex: index + 1,
        })),
      });
      // Reset form
      setQuestionText('');
      setQuestionOptions([
        { text: '', isCorrect: true, orderIndex: 1 },
        { text: '', isCorrect: false, orderIndex: 2 },
      ]);
      await onSuccess();
    } catch (error: unknown) {
      toast.error((error as Error).message || 'فشل في إضافة السؤال.');
    }
  };

  return (
    <div ref={newQuestionRef} className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-6">
      <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
        <Plus size={18} /> سؤال جديد
      </h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-on-surface-variant">نص السؤال</label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className={`${inputStyles} min-h-[80px]`}
            placeholder="اكتب سؤالك هنا..."
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-on-surface-variant">
            الخيارات (اختر الإجابة الصحيحة)
          </label>
          {questionOptions.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-3">
              <button
                onClick={() => {
                  const newOptions = questionOptions.map((item, index) => ({
                    ...item,
                    isCorrect: index === optionIndex,
                  }));
                  setQuestionOptions(newOptions);
                }}
                className={`p-2 rounded-full transition-colors ${option.isCorrect ? 'text-primary bg-primary/10' : 'text-outline hover:bg-surface-container'}`}
              >
                {option.isCorrect ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              <input
                type="text"
                value={option.text}
                onChange={(e) => {
                  const newOptions = [...questionOptions];
                  newOptions[optionIndex].text = e.target.value;
                  setQuestionOptions(newOptions);
                }}
                className={inputStyles}
                placeholder={`الخيار ${optionIndex + 1}`}
              />
              {questionOptions.length > 2 && (
                <button
                  onClick={() =>
                    setQuestionOptions(questionOptions.filter((_, index) => index !== optionIndex))
                  }
                  className="p-2 text-error hover:bg-error/10 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() =>
              setQuestionOptions([
                ...questionOptions,
                { text: '', isCorrect: false, orderIndex: questionOptions.length + 1 },
              ])
            }
            className="text-sm font-medium text-primary hover:text-primary/80 mt-2 flex items-center gap-1"
          >
            <Plus size={14} /> إضافة خيار آخر
          </button>
        </div>
        <div className="flex gap-3 pt-4 border-t border-primary/10">
          <button
            onClick={handleAddQuestion}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            حفظ السؤال
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-surface border border-outline-variant text-on-surface-variant rounded-lg font-medium hover:bg-surface-container transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
