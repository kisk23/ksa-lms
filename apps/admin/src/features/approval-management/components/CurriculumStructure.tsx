import { ModuleSection } from './ModuleSection';
import type { Module } from '../types';

interface CurriculumStructureProps {
  modules: Module[];
}

export function CurriculumStructure({ modules }: CurriculumStructureProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-md">
      <h2 className="font-h2-ar text-h2-ar text-on-background mb-md">هيكلة المقرر</h2>

      <div className="space-y-4">
        {modules.map((module) => (
          <ModuleSection key={module.id} module={module} />
        ))}
      </div>
    </section>
  );
}
