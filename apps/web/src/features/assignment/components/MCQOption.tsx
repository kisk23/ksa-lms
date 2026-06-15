"use client";

import { MCQOption as MCQOptionType } from "../types";

interface MCQOptionProps {
  option: MCQOptionType;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
}

export default function MCQOption({ option, isSelected, onSelect }: MCQOptionProps) {
  return (
    <button
      onClick={() => onSelect(option.id)}
      className={`
        group w-full flex items-center justify-between p-5 rounded-2xl border-2 text-right
        transition-all duration-300 cubic-bezier(0.4,0,0.2,1)
        hover:-translate-y-0.5 active:scale-[0.98]
        ${
          isSelected
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-[#c4c5d6]/60 bg-white hover:border-primary/40 hover:bg-blue-50/40 hover:shadow-sm"
        }
      `}
      aria-pressed={isSelected}
    >
      <div className="flex items-center gap-4">
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0
            transition-all duration-200
            ${
              isSelected
                ? "bg-primary text-white"
                : "bg-slate-100 text-[#747685] group-hover:bg-primary/10 group-hover:text-primary"
            }
          `}
        >
          {option.label}
        </div>
        <span
          className={`text-lg font-semibold transition-colors duration-200 ${
            isSelected ? "text-primary" : "text-[#2A3439]"
          }`}
        >
          {option.text}
        </span>
      </div>

      {/* Check icon */}
      <div
        className={`shrink-0 transition-all duration-300 ${
          isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#2446B8"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4.5-4.5 1.41-1.41L10 13.67l7.09-7.09 1.41 1.41L10 16.5z"/>
        </svg>
      </div>
    </button>
  );
}
