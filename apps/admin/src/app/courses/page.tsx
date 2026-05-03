'use client';

import {
  CoursesHeader,
  CoursesFilters,
  CoursesTable,
  MOCK_COURSES,
} from '@features/course-management';
import type {
  CourseStatusFilter,
  PriceRangeFilter,
  SubjectFilter,
  TeacherFilter,
} from '@features/course-management';
import { useState, useMemo } from 'react';

// Helpers to map filter values → matching logic
function matchesSubject(courseName: string, subject: SubjectFilter): boolean {
  if (subject === 'all') return true;

  const subjectKeywords: Record<string, string[]> = {
    math: ['رياضيات', 'إحصاء', 'حساب'],
    physics: ['فيزياء'],
    chemistry: ['كيمياء'],
  };

  const keywords = subjectKeywords[subject] || [];
  return keywords.some((kw) => courseName.includes(kw));
}

function matchesTeacher(teacherName: string, teacher: TeacherFilter): boolean {
  if (teacher === 'all') return true;

  const teacherNames: Record<string, string> = {
    ahmed: 'أحمد محمد',
    sara: 'سارة علي',
  };

  const target = teacherNames[teacher];
  return target ? teacherName.includes(target) : true;
}

function matchesPriceRange(price: number | null, range: PriceRangeFilter): boolean {
  if (range === 'all') return true;
  if (range === 'free') return price === null;
  if (price === null) return false;
  if (range === 'lt100') return price < 100;
  if (range === 'gt100') return price >= 100;
  return true;
}

export default function CoursesPage() {
  const [subject, setSubject] = useState<SubjectFilter>('all');
  const [teacher, setTeacher] = useState<TeacherFilter>('all');
  const [status, setStatus] = useState<CourseStatusFilter>('all');
  const [priceRange, setPriceRange] = useState<PriceRangeFilter>('all');

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter((course) => {
      if (!matchesSubject(course.name, subject)) return false;
      if (!matchesTeacher(course.teacher, teacher)) return false;
      if (status !== 'all' && course.status !== status) return false;
      if (!matchesPriceRange(course.price, priceRange)) return false;
      return true;
    });
  }, [subject, teacher, status, priceRange]);

  const handleReset = () => {
    setSubject('all');
    setTeacher('all');
    setStatus('all');
    setPriceRange('all');
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <CoursesHeader />
      <CoursesFilters
        subject={subject}
        teacher={teacher}
        status={status}
        priceRange={priceRange}
        onSubjectChange={setSubject}
        onTeacherChange={setTeacher}
        onStatusChange={setStatus}
        onPriceRangeChange={setPriceRange}
        onReset={handleReset}
      />
      <CoursesTable courses={filteredCourses} />
    </div>
  );
}
