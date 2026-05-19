import { z } from 'zod';

export const loginSchema = z.object({
  identity: z.string().min(3, 'يجب إدخال 3 أحرف على الأقل'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Guardian ─────────────────────────────────────────
const guardianSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z
    .string()
    .min(10, 'رقم الهاتف غير صالح')
    .regex(/^\+?[0-9]+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط'),
  identity: z
    .string()
    .min(3, 'رقم الهوية يجب أن يكون 3 أحرف على الأقل')
    .max(20, 'رقم الهوية يجب ألا يتجاوز 20 حرفاً'),
  // Uppercase to match ParentRelationship Prisma enum
  relationship: z.enum(['FATHER', 'MOTHER', 'GUARDIAN'], {
    message: 'يرجى اختيار صلة القرابة',
  }),
});

// ─── Step 1 ───────────────────────────────────────────
export const registerStep1Schema = z
  .object({
    name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
    email: z.string().email('البريد الإلكتروني غير صالح'),
    phone: z
      .string()
      .min(10, 'رقم الهاتف غير صالح')
      .regex(/^\+?[0-9]+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط'),
    identity: z
      .string()
      .min(3, 'رقم الهوية يجب أن يكون 3 أحرف على الأقل')
      .max(20, 'رقم الهوية يجب ألا يتجاوز 20 حرفاً'),
    // Matches backend @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      .regex(/(?=.*[A-Z])/, 'يجب أن تحتوي على حرف كبير')
      .regex(/(?=.*[a-z])/, 'يجب أن تحتوي على حرف صغير')
      .regex(/(?=.*[\d\W])/, 'يجب أن تحتوي على رقم أو رمز'),
    confirmPassword: z.string().min(1, 'هذا الحقل مطلوب'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

// ─── Step 2 ───────────────────────────────────────────
export const registerStep2Schema = guardianSchema;

export type RegisterStep1Values = z.infer<typeof registerStep1Schema>;
export type RegisterStep2Values = z.infer<typeof registerStep2Schema>;
