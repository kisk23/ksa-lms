// This layout intentionally removes the dashboard sidebar & top bar
// so the quiz-taker renders in a clean full-screen environment.
export default function QuizTakerLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen w-full bg-background">{children}</div>;
}
