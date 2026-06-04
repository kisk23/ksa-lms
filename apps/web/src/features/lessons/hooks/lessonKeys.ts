/**
 * Centralised React Query key factory for the lessons feature.
 *
 * Import and use these everywhere you query or invalidate lesson-related data.
 * The hierarchy mirrors the URL structure so invalidating a parent key
 * automatically invalidates all children.
 *
 * Key hierarchy:
 *   lessons                                          ← top-level scope
 *   lessons › detail › courseId/chapterId/lessonId  ← single lesson
 *   lessons › assignments › lessonId                ← lesson assignments
 *   lessons › files › lessonId                      ← lesson files
 *   lessons › progress › courseId                   ← course progress summary
 *   lessons › statuses › courseId                   ← all lesson statuses in course
 */
export const lessonKeys = {
  all: ['lessons'] as const,

  // ── Single lesson ──────────────────────────────────────────────────────────
  details: () => [...lessonKeys.all, 'detail'] as const,
  detail: (courseId: string, chapterId: string, lessonId: string) =>
    [...lessonKeys.details(), courseId, chapterId, lessonId] as const,

  // ── Assignments ────────────────────────────────────────────────────────────
  assignmentsList: () => [...lessonKeys.all, 'assignments'] as const,
  assignments: (lessonId: string) => [...lessonKeys.assignmentsList(), lessonId] as const,

  // ── Downloadable files ─────────────────────────────────────────────────────
  filesList: () => [...lessonKeys.all, 'files'] as const,
  files: (lessonId: string) => [...lessonKeys.filesList(), lessonId] as const,

  // ── Course progress (header bar %) ────────────────────────────────────────
  progress: (courseId: string) => [...lessonKeys.all, 'progress', courseId] as const,

  // ── Per-lesson completion statuses (sidebar checkmarks) ───────────────────
  statuses: (courseId: string) => [...lessonKeys.all, 'statuses', courseId] as const,
} as const;
