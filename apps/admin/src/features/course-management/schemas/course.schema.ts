import {
  hasNoControlCharacters,
  hasSafeProtocol,
  isHtmlOrScriptFree,
  isPathTraversalFree,
  isSafeFiniteNumber,
  isSafePayloadLength,
  isSqlInjectionFree,
} from '@shared/utils/security-guards';
import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'عنوان الدورة يجب أن لا يقل عن 5 أحرف')
    .max(255, 'عنوان الدورة يجب ألا يتجاوز 255 حرفاً')
    .refine(isHtmlOrScriptFree, 'العنوان يحتوي على وسم غير مسموح به (HTML/Script)')
    .refine(isSqlInjectionFree, 'النص يحتوي على رموز غير مسموح بها')
    .refine(hasNoControlCharacters, 'العنوان يحتوي على رموز غير صالحة'),
  teacherUserId: z.string().optional(),
  price: z
    .union([
      z
        .number({ message: 'يرجى إدخال سعر صحيح' })
        .min(0, 'السعر يجب أن يكون 0 أو أكثر')
        .refine(isSafeFiniteNumber, 'السعر غير صالح'),
      z.literal(''),
    ])
    .refine((val) => val !== '', {
      message: 'يرجى إدخال سعر الدورة',
    }),
  currency: z.string().default('SAR'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || isSafePayloadLength(val, 5000), 'الوصف يتجاوز الحد المسموح به'),
  category: z
    .string()
    .optional()
    .refine(
      (val) => !val || isHtmlOrScriptFree(val),
      'التصنيف يحتوي على وسم غير مسموح به (HTML/Script)',
    )
    .refine((val) => !val || isSqlInjectionFree(val), 'التصنيف يحتوي على رموز غير مسموح بها'),
  thumbnailUrl: z
    .union([
      z
        .string()
        .trim()
        .url('رابط الصورة يجب أن يكون رابطاً صالحاً')
        .refine(hasSafeProtocol, 'رابط الصورة يجب أن يبدأ بـ http:// أو https://')
        .refine(isPathTraversalFree, 'رابط الصورة غير صالح'),
      z.literal(''),
    ])
    .optional(),
  promoVideoUrl: z
    .string({ required_error: 'رابط الفيديو التعريفي مطلوب' })
    .trim()
    .min(1, 'رابط الفيديو التعريفي مطلوب')
    .url('رابط الفيديو يجب أن يكون رابطاً صالحاً')
    .refine(hasSafeProtocol, 'رابط الفيديو يجب أن يبدأ بـ http:// أو https://'),
  promoVideoProvider: z.enum(['YOUTUBE', 'BUNNY']).default('YOUTUBE'),
});

export type CreateCourseFormInput = z.input<typeof createCourseSchema>;
export type CreateCourseFormValues = z.output<typeof createCourseSchema>;
