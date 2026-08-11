import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'عنوان الدورة يجب أن لا يقل عن 5 أحرف')
    .max(255, 'عنوان الدورة يجب ألا يتجاوز 255 حرفاً'),
  teacherUserId: z.string().optional(),
  price: z
    .union([
      z.number({ message: 'يرجى إدخال سعر صحيح' }).min(0, 'السعر يجب أن يكون 0 أو أكثر'),
      z.literal(''),
    ])
    .refine((val) => val !== '', {
      message: 'يرجى إدخال سعر الدورة',
    }),
  currency: z.string().default('SAR'),
  description: z.string().optional(),
  category: z.string().optional(),
  thumbnailUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      'رابط الصورة يجب أن يكون رابطاً صالحاً (يبدأ بـ http:// أو https://)',
    ),
  promoVideoUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      'رابط الفيديو يجب أن يكون رابطاً صالحاً (يبدأ بـ http:// أو https://)',
    ),
  promoVideoProvider: z.enum(['YOUTUBE', 'BUNNY']).default('YOUTUBE'),
});

export type CreateCourseFormInput = z.input<typeof createCourseSchema>;
export type CreateCourseFormValues = z.output<typeof createCourseSchema>;
