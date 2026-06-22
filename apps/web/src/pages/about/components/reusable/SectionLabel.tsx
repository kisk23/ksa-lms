function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-secondary mb-4">
      <span className="w-6 h-px bg-secondary inline-block" />
      {children}
      <span className="w-6 h-px bg-secondary inline-block" />
    </span>
  );
}

export default SectionLabel;