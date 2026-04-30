export default function LessonPage({ params }: { params: { id: string; lessonId: string } }) {
  return (
    <main>
      <h1>Lesson Player</h1>
      <p>
        Course: {params.id} | Lesson: {params.lessonId}
      </p>
      {/* TODO: Wire up lesson player feature */}
    </main>
  );
}
