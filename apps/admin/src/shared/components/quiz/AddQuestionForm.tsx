import { Plus, Trash2, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface DraftQuestionOption {
  text: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface DraftQuestion {
  text: string;
  options: DraftQuestionOption[];
}

export interface AddQuestionFormProps {
  onSave: (question: DraftQuestion) => Promise<void>;
  onCancel: () => void;
}

export function AddQuestionForm({ onSave, onCancel }: AddQuestionFormProps) {
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState<DraftQuestionOption[]>([
    { text: '', isCorrect: true, orderIndex: 1 },
    { text: '', isCorrect: false, orderIndex: 2 },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const newQuestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newQuestionRef.current) {
      newQuestionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleAddQuestion = async () => {
    if (!qText.trim() || qOptions.length < 2) {
      toast.error('الرجاء كتابة السؤال وإضافة خيارين على الأقل.');
      return;
    }
    const hasCorrect = qOptions.some((o) => o.isCorrect);
    if (!hasCorrect) {
      toast.error('الرجاء تحديد إجابة صحيحة واحدة على الأقل.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        text: qText.trim(),
        options: qOptions.map((o, idx) => ({
          text: o.text.trim(),
          isCorrect: o.isCorrect,
          orderIndex: idx + 1,
        })),
      });
      // Form reset and closing is typically handled by parent unmounting this component,
      // but we can reset state just in case it's kept alive.
      setQText('');
      setQOptions([
        { text: '', isCorrect: true, orderIndex: 1 },
        { text: '', isCorrect: false, orderIndex: 2 },
      ]);
    } catch (err: unknown) {
      // Parent might throw error, catch and display it or let parent handle toast
      console.error(err);
    } finally {
      setIsSaving(false);
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
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            disabled={isSaving}
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-body-md-ar min-h-[80px]"
            placeholder="اكتب سؤالك هنا..."
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-on-surface-variant">
            الخيارات (اختر الإجابة الصحيحة)
          </label>
          {qOptions.map((opt, oIdx) => (
            <div key={oIdx} className="flex items-center gap-3">
              <button
                disabled={isSaving}
                onClick={() => {
                  const newOpts = qOptions.map((o, i) => ({ ...o, isCorrect: i === oIdx }));
                  setQOptions(newOpts);
                }}
                className={`p-2 rounded-full transition-colors ${opt.isCorrect ? 'text-primary bg-primary/10' : 'text-outline hover:bg-surface-container'}`}
                title="تحديد كإجابة صحيحة"
              >
                {opt.isCorrect ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              <input
                type="text"
                value={opt.text}
                disabled={isSaving}
                onChange={(e) => {
                  const newOpts = [...qOptions];
                  newOpts[oIdx].text = e.target.value;
                  setQOptions(newOpts);
                }}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-body-md-ar"
                placeholder={`الخيار ${oIdx + 1}`}
              />
              {qOptions.length > 2 && (
                <button
                  disabled={isSaving}
                  onClick={() => setQOptions(qOptions.filter((_, i) => i !== oIdx))}
                  className="p-2 text-outline/50 hover:text-error hover:bg-error/10 rounded-full disabled:opacity-50 transition-colors"
                  title="حذف الخيار"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            disabled={isSaving}
            onClick={() =>
              setQOptions([
                ...qOptions,
                { text: '', isCorrect: false, orderIndex: qOptions.length + 1 },
              ])
            }
            className="text-sm font-medium text-primary hover:text-primary/80 mt-2 flex items-center gap-1 disabled:opacity-50"
          >
            <Plus size={14} /> إضافة خيار آخر
          </button>
        </div>
        <div className="flex gap-3 pt-4 border-t border-primary/10">
          <button
            disabled={isSaving}
            onClick={handleAddQuestion}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {isSaving ? 'جاري الحفظ...' : 'حفظ السؤال'}
          </button>
          <button
            disabled={isSaving}
            onClick={() => {
              if (
                qText.trim() &&
                !window.confirm('هل أنت متأكد من الإلغاء؟ سيتم فقدان هذا السؤال.')
              )
                return;
              onCancel();
            }}
            className="px-6 py-2 bg-surface border border-outline-variant text-on-surface-variant rounded-lg font-medium hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
