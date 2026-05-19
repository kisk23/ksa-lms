import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export interface ICourseContext {
  courseId: string;
  teacherUserId: string;
}

export const CourseContext = createParamDecorator(
  (_, ctx: ExecutionContext): ICourseContext | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.courseContext;
  },
);
