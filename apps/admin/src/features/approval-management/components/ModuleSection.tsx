import { PlayCircle, FileText } from 'lucide-react';

import type { Module } from '../types';

type ModuleSectionProps = {
  module: Module;
};

export function ModuleSection({ module }: ModuleSectionProps) {
  return (
    <div className="border border-outline-variant rounded-lg overflow-hidden">
      <div className="bg-surface-container-low px-4 py-3 flex items-center justify-between border-b border-outline-variant">
        <h3 className="font-body-lg-ar text-body-lg-ar text-on-surface font-semibold">
          {module.title}
        </h3>
        <span className="text-caption-ar font-caption-ar text-outline">{module.durationLabel}</span>
      </div>

      <div className="p-2">
        {module.lessons.map((lesson) => {
          const Icon = lesson.type === 'video' ? PlayCircle : FileText;
          return (
            <div
              key={lesson.id}
              className="flex items-center gap-3 p-2 hover:bg-surface-container-lowest rounded-md transition-colors cursor-pointer"
            >
              <Icon size={20} className="text-outline" />
              <span className="font-body-md-ar text-body-md-ar text-on-surface flex-1">
                {lesson.title}
              </span>
              <span className="text-caption-ar text-outline">{lesson.duration}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
