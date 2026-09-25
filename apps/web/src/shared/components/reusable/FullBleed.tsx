type FullBleedProps = {
  children: React.ReactNode;
  className?: string;
};

export function FullBleed({ children, className = "" }: FullBleedProps) {
  return (
    <section
      className={`relative left-1/2 right-1/2 ml-[-50.4vw] mr-[-50vw] w-screen  ${className}`}
    >
      {children}
    </section>
  );
}