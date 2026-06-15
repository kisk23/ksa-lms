"use client";

import { Question } from "../types";
import MCQOption from "./MCQOption";

const ORDINALS: Record<number, string> = {
  1: "الأول",
  2: "الثاني",
  3: "الثالث",
  4: "الرابع",
  5: "الخامس",
  6: "السادس",
  7: "السابع",
  8: "الثامن",
  9: "التاسع",
  10: "العاشر",
  11: "الحادي عشر",
  12: "الثاني عشر",
  13: "الثالث عشر",
  14: "الرابع عشر",
  15: "الخامس عشر",
  16: "السادس عشر",
  17: "السابع عشر",
  18: "الثامن عشر",
  19: "التاسع عشر",
  20: "العشرون",
  21: "الحادي والعشرون",
  22: "الثاني والعشرون",
  23: "الثالث والعشرون",
  24: "الرابع والعشرون",
  25: "الخامس والعشرون",
  26: "السادس والعشرون",
  27: "السابع والعشرون",
  28: "الثامن والعشرون",
  29: "التاسع والعشرون",
  30: "الثلاثون",
  31: "الحادي والثلاثون",
  32: "الثاني والثلاثون",
  33: "الثالث والثلاثون",
  34: "الرابع والثلاثون",
  35: "الخامس والثلاثون",
  36: "السادس والثلاثون",
  37: "السابع والثلاثون",
  38: "الثامن والثلاثون",
  39: "التاسع والثلاثون",
  40: "الأربعون",
  41: "الحادي والأربعون",
  42: "الثاني والأربعون",
  43: "الثالث والأربعون",
  44: "الرابع والأربعون",
  45: "الخامس والأربعون",
  46: "السادس والأربعون",
  47: "السابع والأربعون",
  48: "الثامن والأربعون",
  49: "التاسع والأربعون",
  50: "الخمسون",
};

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
}

export default function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-4xl p-8 md:p-10 shadow-[0_40px_80px_-15px_rgba(36,70,184,0.06)] border border-[#c4c5d6]/20">
      <span className="text-primary font-bold text-base mb-3 block">
        السؤال {ORDINALS[question.orderIndex] || question.orderIndex}
      </span>

      <h2 className="text-2xl md:text-3xl font-bold text-[#2A3439] leading-relaxed mb-8">
        {question.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option) => (
          <MCQOption
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onSelect={onSelectOption}
          />
        ))}
      </div>
    </div>
  );
}
