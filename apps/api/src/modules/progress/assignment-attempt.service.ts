import { EnrollmentStatus } from '@lms/shared-types';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { AnswerDto } from './dto';
import { Prisma } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';

// ─── TYPES ────────────────────────────────────────────────────────────────────

/** Snapshot of one answer stored in AssignmentAttempt.snapshot (Json?) */
interface AnswerSnapshot {
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
  /** Whether the selected option is correct — explicitly stored per the requirement. */
  isCorrect: boolean;
}

// ─── SERVICE ──────────────────────────────────────────────────────────────────

@Injectable()
export class AssignmentAttemptService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── PRIVATE HELPERS ───────────────────────────────────────────────────────

  /**
   * Checks the student hasn't exceeded the attempt limit before grading.
   * Returns the current attempt count so the caller can set attemptNumber.
   */
  private async checkAttemptLimit(
    studentUserId: string,
    assignmentId: string,
    maxAttempts: number | null,
  ): Promise<number> {
    const count = await this.prisma.assignmentAttempt.count({
      where: { studentUserId, assignmentId },
    });

    if (maxAttempts !== null && count >= maxAttempts) {
      throw new ForbiddenException(
        `You have reached the maximum number of attempts (${maxAttempts}) for this assignment.`,
      );
    }

    return count;
  }

  // ─── PUBLIC METHODS ─────────────────────────────────────────────────────────

  /**
   * submit(studentUserId, assignmentId, answers)
   *
   * Grades a submission and persists the attempt + best score in one transaction.
   *
   * Grading steps:
   *  1. Load assignment with all questions + options (needed for evaluation and snapshot)
   *  2. Validate: each submitted questionId belongs to this assignment
   *  3. Validate: each selectedOptionId belongs to its question
   *  4. Check attempt limit
   *  5. Compute scorePct = (correctAnswers / totalQuestions) * 100
   *  6. Build AnswerSnapshot per question — includes questionText, optionText, isCorrect
   *  7. Write AssignmentAttempt (snapshot persisted to AssignmentAttempt.snapshot Json?)
   *  8. Upsert AssignmentBestScore if this attempt beats the stored best
   *
   * The snapshot is intentional — it preserves the exact question/option text at
   * submission time. If a teacher later edits the question, the historical
   * record remains accurate.
   */
  async submit(studentUserId: string, assignmentId: string, answers: AnswerDto[]) {
    // 1. Load assignment + full question tree + courseId for enrollment check.
    //    We join all the way to chapter.courseId here so the enrollment check
    //    costs zero extra queries — the data is already fetched for grading.
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        lesson: {
          select: {
            chapter: { select: { courseId: true } },
          },
        },
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            options: { orderBy: { orderIndex: 'asc' } },
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment #${assignmentId} not found`);
    }

    // 1b. Enrollment check — must happen before any grading work.
    //     We derive courseId from the join above rather than a separate query.
    const courseId = assignment.lesson.chapter.courseId;
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentUserId_courseId: { studentUserId, courseId } },
      select: { status: true },
    });

    if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) {
      throw new ForbiddenException(
        'You must be actively enrolled in this course to submit an attempt.',
      );
    }

    const questionMap = new Map(assignment.questions.map((q) => [q.id, q]));

    // 2. Validate all submitted questionIds belong to this assignment
    for (const answer of answers) {
      if (!questionMap.has(answer.questionId)) {
        throw new BadRequestException(
          `Question #${answer.questionId} does not belong to assignment #${assignmentId}.`,
        );
      }
    }

    // 3. Check attempt limit (returns current count for setting attemptNumber)
    const currentCount = await this.checkAttemptLimit(
      studentUserId,
      assignmentId,
      assignment.maxAttempts,
    );

    // 4. Validate selectedOptionIds and build answer index
    for (const answer of answers) {
      const question = questionMap.get(answer.questionId)!;
      const optionExists = question.options.some((o) => o.id === answer.selectedOptionId);
      if (!optionExists) {
        throw new BadRequestException(
          `Option #${answer.selectedOptionId} does not belong to question #${answer.questionId}.`,
        );
      }
    }

    // 5. Grade — build snapshots in the same pass to avoid a second iteration
    let correctCount = 0;
    const snapshots: AnswerSnapshot[] = [];

    // Index submitted answers by questionId for O(1) lookup
    const answerByQuestionId = new Map(answers.map((a) => [a.questionId, a]));

    for (const question of assignment.questions) {
      const submitted = answerByQuestionId.get(question.id);

      if (!submitted) {
        // Unanswered question — counts as wrong, snapshot records null selection
        snapshots.push({
          questionId: question.id,
          questionText: question.text,
          selectedOptionId: '',
          selectedOptionText: '(no answer)',
          isCorrect: false,
        });
        continue;
      }

      const selectedOption = question.options.find((o) => o.id === submitted.selectedOptionId)!;

      const isCorrect = selectedOption.isCorrect;
      if (isCorrect) correctCount++;

      // 6. Build snapshot — includes isCorrect alongside the text fields
      snapshots.push({
        questionId: question.id,
        questionText: question.text,
        selectedOptionId: selectedOption.id,
        selectedOptionText: selectedOption.text,
        isCorrect,
      });
    }

    const totalQuestions = assignment.questions.length;
    const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isPassed = scorePct >= assignment.passingScorePct;
    const attemptNumber = currentCount + 1;

    // 7 + 8. Persist attempt (with snapshot) and upsert best score in one transaction
    return this.prisma.$transaction(async (tx) => {
      // 7. Create attempt — snapshot is frozen at submission time so historical
      //    records stay accurate even if the teacher later edits question/option text.
      const attempt = await tx.assignmentAttempt.create({
        data: {
          studentUserId,
          assignmentId,
          attemptNumber,
          scorePct,
          isPassed,
          snapshot: snapshots as unknown as Prisma.InputJsonValue, // AssignmentAttempt.snapshot Json?
        },
      });

      // 8. Fetch current best to decide whether this attempt beats it
      const existing = await tx.assignmentBestScore.findUnique({
        where: { studentUserId_assignmentId: { studentUserId, assignmentId } },
        select: { bestScorePct: true },
      });

      const isNewBest = !existing || scorePct > existing.bestScorePct;

      if (isNewBest) {
        await tx.assignmentBestScore.upsert({
          where: { studentUserId_assignmentId: { studentUserId, assignmentId } },
          create: {
            studentUserId,
            assignmentId,
            bestScorePct: scorePct,
            isPassed,
            // Link back to the attempt via the BestAttemptLink relation
            bestAttemptId: attempt.id,
          },
          update: {
            bestScorePct: scorePct,
            isPassed,
            bestAttemptId: attempt.id,
          },
        });
      }

      return { ...attempt, isNewBest };
    });
  }

  /**
   * findAttempts(studentUserId, assignmentId)
   * Returns own attempt history ordered by attempt number.
   */
  async findAttempts(studentUserId: string, assignmentId: string) {
    return this.prisma.assignmentAttempt.findMany({
      where: { studentUserId, assignmentId },
      orderBy: { attemptNumber: 'asc' },
    });
  }

  /**
   * getSelfBestScore(studentUserId, assignmentId)
   *
   * Lean lookup — no snapshot included.
   * Called by GET /assignments/:id/best-score (student viewing their own score).
   * Auth is handled upstream by AssignmentAccessGuard.
   */
  async getSelfBestScore(studentUserId: string, assignmentId: string) {
    const best = await this.prisma.assignmentBestScore.findUnique({
      where: { studentUserId_assignmentId: { studentUserId, assignmentId } },
    });

    if (!best) {
      throw new NotFoundException(`No attempts found for student on assignment #${assignmentId}`);
    }

    return best;
  }

  /**
   * findAllAttempts(assignmentId)
   * Teacher view — all students' attempts for a given assignment.
   */
  async findAllAttempts(assignmentId: string) {
    return this.prisma.assignmentAttempt.findMany({
      where: { assignmentId },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ studentUserId: 'asc' }, { attemptNumber: 'asc' }],
    });
  }

  /**
   * getBestScore(studentId, assignmentId)
   *
   * Includes the full attempt snapshot on the best score row.
   * Called by GET /students/:studentId/assignments/:assignmentId/best-score.
   * Auth is handled upstream by StudentProgressAccessGuard (student self, parent,
   * course teacher, staff).
   *
   * The snapshot preserves the frozen question/option text from submission time —
   * safe to return even if the assignment has been edited since.
   */
  async getBestScore(studentId: string, assignmentId: string) {
    const bestScore = await this.prisma.assignmentBestScore.findUnique({
      where: {
        studentUserId_assignmentId: {
          studentUserId: studentId,
          assignmentId,
        },
      },
      include: {
        bestAttempt: {
          select: {
            id: true,
            attemptNumber: true,
            scorePct: true,
            isPassed: true,
            submittedAt: true,
            snapshot: true,
          },
        },
      },
    });

    if (!bestScore) {
      throw new NotFoundException(
        `No score found for student #${studentId} on assignment #${assignmentId}`,
      );
    }

    return bestScore;
  }
}
