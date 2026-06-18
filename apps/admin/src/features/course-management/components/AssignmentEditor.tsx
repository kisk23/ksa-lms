'use client';

import { ConfirmToast } from '@shared/components/ConfirmToast';
import { AddQuestionForm, type DraftQuestion } from '@shared/components/quiz/AddQuestionForm';
import { QuestionCard } from '@shared/components/quiz/QuestionCard';
import { apiClient } from '@shared/lib/api-client';
import { X, Loader2, AlertCircle, Save, Plus, HelpCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Toast } from 'react-hot-toast';
import toast from 'react-hot-toast';

import { inputStyles } from '../styles';
import type { Assignment, Question, AssignmentEditorProps } from '../types';

export function AssignmentEditor({ lessonId, lessonTitle, type, onClose }: AssignmentEditorProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for Assignment settings
  const [passingScorePct, setPassingScorePct] = useState<number>(60);
  const [maxAttempts, setMaxAttempts] = useState<number | ''>('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);

  // New question form state
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  const loadAssignment = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The backend returns the assignment with questions and options if it exists.
      // If it doesn't exist, the backend might return null or 404.
      const res = await apiClient.get<Assignment>(`/lessons/${lessonId}/assignment`);
      if (res) {
        setAssignment(res);
        setPassingScorePct(res.passingScorePct);
        setMaxAttempts(res.maxAttempts || '');
        setQuestions(res.questions || []);
        setShowSettings(false);
      }
    } catch (err: unknown) {
      const e = err as { message?: string; status?: number };
      const msg = e.message || '';
      const isNotFound =
        e.status === 404 || msg.includes('404') || msg.toLowerCase().includes('not found');
      if (!isNotFound) {
        setError(msg || `فشل في تحميل ${type === 'QUIZ' ? 'الاختبار' : 'الواجب'}.`);
      }
      // If 404 / Not Found, it just means no assignment exists yet, which is fine.
    } finally {
      setIsLoading(false);
    }
  }, [lessonId, type]);

  useEffect(() => {
    loadAssignment();
  }, [loadAssignment]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const payload: Record<string, string | number> = {
        passingScorePct: Number(passingScorePct),
      };
      if (maxAttempts !== '') {
        payload.maxAttempts = Number(maxAttempts);
      }

      if (assignment) {
        // Update existing
        await apiClient.patch(`/assignments/${assignment.id}`, payload);
      } else {
        // Create new
        const created = await apiClient.post<Assignment>(
          `/lessons/${lessonId}/assignment`,
          payload,
        );
        setAssignment(created);
      }
      setShowSettings(false);
      await loadAssignment();
    } catch (err: unknown) {
      toast.error(
        (err as Error).message || `فشل في حفظ إعدادات ${type === 'QUIZ' ? 'الاختبار' : 'الواجب'}.`,
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    toast.custom(
      (t: Toast) => (
        <ConfirmToast
          t={t}
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذا السؤال؟"
          confirmText="حذف السؤال"
          onConfirm={async () => {
            const toastId = toast.loading('جاري الحذف...');
            try {
              await apiClient.delete(`/questions/${questionId}`);
              await loadAssignment();
              toast.success('تم حذف السؤال بنجاح.', { id: toastId });
            } catch (err: unknown) {
              toast.error((err as Error).message || 'فشل في حذف السؤال.', { id: toastId });
            }
          }}
        />
      ),
      { duration: Infinity, position: 'top-center' },
    );
  };

  const handleSaveNewQuestion = async (draftQuestion: DraftQuestion) => {
    if (!assignment) {
      toast.error(`يرجى حفظ إعدادات ${type === 'QUIZ' ? 'الاختبار' : 'الواجب'} أولاً.`);
      return;
    }

    try {
      await apiClient.post(`/assignments/${assignment.id}/questions`, {
        text: draftQuestion.text,
        orderIndex: questions.length + 1,
        options: draftQuestion.options,
      });
      setIsAddingQuestion(false);
      await loadAssignment();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'فشل في إضافة السؤال.');
      throw err; // re-throw so the form can catch it or we just handle toast here
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden"
      dir="rtl"
    >
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-4xl min-h-[500px] max-h-[90vh] flex flex-col border border-outline-variant my-auto relative">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface rounded-t-2xl shrink-0 z-10">
          <div>
            <h2 className="font-h2-ar text-xl text-on-surface font-bold flex items-center gap-2">
              <HelpCircle className="text-primary" size={24} />
              {type === 'QUIZ' ? 'إدارة الاختبار' : 'إدارة الواجب'}
            </h2>
            <p className="text-on-surface-variant font-body-sm-ar mt-1">
              تابع للدرس: {lessonTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:bg-surface hover:text-error rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-primary mb-4" />
              <p className="font-body-md-ar text-on-surface-variant">جاري التحميل...</p>
            </div>
          ) : error ? (
            <div className="bg-error/10 text-error p-6 rounded-xl flex items-center gap-3">
              <AlertCircle size={24} />
              <p className="font-medium font-body-md-ar">{error}</p>
            </div>
          ) : (
            <div className="space-y-8 flex flex-col items-start w-full">
              {/* Settings Form */}
              {showSettings ? (
                <div className="w-full bg-surface border border-outline-variant rounded-xl p-6 shadow-sm animate-in slide-in-from-top-2 duration-300">
                  <h3 className="font-h3-ar text-lg font-bold text-on-surface mb-4">
                    إعدادات {type === 'QUIZ' ? 'الاختبار' : 'الواجب'} الأساسية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-on-surface-variant">
                        نسبة النجاح (%) <span className="text-error">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={passingScorePct}
                        onChange={(e) => setPassingScorePct(Number(e.target.value))}
                        className={inputStyles}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-on-surface-variant">
                        الحد الأقصى للمحاولات
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={maxAttempts}
                        onChange={(e) =>
                          setMaxAttempts(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        placeholder="اتركه فارغاً لمحاولات غير محدودة"
                        className={inputStyles}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSavingSettings}
                      className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingSettings ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}
                      حفظ الإعدادات
                    </button>
                    {assignment && (
                      <button
                        onClick={() => setShowSettings(false)}
                        className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer text-sm font-medium"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-6">
                    <div className="text-sm">
                      <span className="text-on-surface-variant">نسبة النجاح: </span>
                      <span className="font-bold text-on-surface">{passingScorePct}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-on-surface-variant">المحاولات المسموحة: </span>
                      <span className="font-bold text-on-surface">
                        {maxAttempts || 'غير محدود'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-primary hover:bg-primary/5 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer border border-primary/20"
                  >
                    تعديل الإعدادات
                  </button>
                </div>
              )}

              {/* Questions Section */}
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                  <h3 className="font-h3-ar text-lg font-bold text-on-surface">
                    الأسئلة ({questions.length})
                  </h3>
                  {assignment && !isAddingQuestion && (
                    <button
                      onClick={() => setIsAddingQuestion(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg font-medium text-sm hover:bg-secondary/90 transition-colors"
                    >
                      <Plus size={16} />
                      إضافة سؤال جديد
                    </button>
                  )}
                </div>

                {!assignment ? (
                  <div className="text-center py-12 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                    <HelpCircle size={40} className="text-outline mx-auto mb-3 opacity-50" />
                    <p className="text-on-surface-variant font-medium">قم بحفظ الإعدادات للبدء</p>
                    <p className="text-sm text-outline mt-1">
                      يرجى حفظ إعدادات {type === 'QUIZ' ? 'الاختبار' : 'الواجب'} الأساسية (في
                      الأعلى) لتتمكن من إضافة الأسئلة.
                    </p>
                  </div>
                ) : (
                  <>
                    {questions.length === 0 && !isAddingQuestion && (
                      <div className="text-center py-12 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                        <HelpCircle size={40} className="text-outline mx-auto mb-3 opacity-50" />
                        <p className="text-on-surface-variant font-medium">لا توجد أسئلة بعد.</p>
                        <p className="text-sm text-outline mt-1">
                          ابدأ بإضافة أسئلة {type === 'QUIZ' ? 'للاختبار' : 'للواجب'}.
                        </p>
                      </div>
                    )}

                    {/* List of existing questions */}
                    {questions.length > 0 && (
                      <div className="space-y-4">
                        {questions.map((q, idx) => (
                          <QuestionCard
                            key={q.id}
                            question={q}
                            index={idx}
                            onDelete={handleDeleteQuestion}
                          />
                        ))}
                      </div>
                    )}

                    {/* Add Question Form */}
                    {isAddingQuestion && assignment && (
                      <AddQuestionForm
                        onSave={handleSaveNewQuestion}
                        onCancel={() => setIsAddingQuestion(false)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
