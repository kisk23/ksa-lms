'use client';

import type { ICourse } from '@lms/shared-types';
import { CourseCard } from './CourseCard';

interface CourseListProps {
  courses: ICourse[];
}

export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return <p>No courses found.</p>;
  }

  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
