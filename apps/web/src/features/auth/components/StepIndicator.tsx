'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] leading-normal text-[#444653] font-arabic">
          الخطوة {currentStep} من {totalSteps}
        </span>
        {labels?.[currentStep - 1] && (
          <span className="text-[14px] leading-normal text-primary font-semibold font-arabic">
            {labels[currentStep - 1]}
          </span>
        )}
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={[
              'h-2 flex-1 rounded-full transition-colors duration-300',
              i < currentStep ? 'bg-primary' : 'bg-[#e2e7ff]',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
