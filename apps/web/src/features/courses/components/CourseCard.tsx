import type { ICourse } from '@lms/shared-types';
import { formatPrice } from '@lms/utils';

interface CourseCardProps {
  course: ICourse;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="course-card">
      {course.thumbnailUrl && (
        <img src={course.thumbnailUrl} alt={course.title} />
      )}
      <div className="course-card__body">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-card__footer">
          <span className="course-card__price">
            {course.price === 0 ? 'Free' : formatPrice(course.price)}
          </span>
          <span className="course-card__difficulty">{course.difficulty}</span>
        </div>
      </div>
    </article>
  );
}
