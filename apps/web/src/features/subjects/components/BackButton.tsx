import { MoveRight } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="عودة إلى المراحل الدراسية"
      className="flex items-center gap-1 p-2 font-bold text-primary-container transition-all hover:gap-3 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-container cursor-pointer"
    >
      <MoveRight className="w-6 h-6" />
      <span>عودة إلى المراحل</span>
    </button>
  );
}
