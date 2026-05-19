import { apiClient } from '@/shared/lib/api-client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,

  AuthUser,

} from '@lms/shared-types';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', data);
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  },


  async getMe(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/auth/me');
  },

  async verifyOtp(code: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/verify-otp', { code });
  },

  async resendOtp(): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>('/auth/resend-otp');
  },
};


export const AUTH_ERRORS = {
  OTP_VERIFICATION_REQUIRED: 'OTP_VERIFICATION_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  STUDENT_ALREADY_EXISTS: 'STUDENT_ALREADY_EXISTS',
  GUARDIAN_CONTACT_CONFLICT: 'GUARDIAN_CONTACT_CONFLICT',
  GUARDIAN_ROLE_MISMATCH: 'GUARDIAN_ROLE_MISMATCH',

  ALREADY_VERIFIED: 'ALREADY_VERIFIED',
  OTP_INVALID: 'OTP_INVALID',
  OTP_EXPIRED: 'OTP_EXPIRED',

} as const;

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AUTH_ERRORS.INVALID_CREDENTIALS]: 'بيانات الاعتماد غير صحيحة. يرجى التحقق والمحاولة مجدداً.',
  [AUTH_ERRORS.STUDENT_ALREADY_EXISTS]: 'هذا الطالب مسجل مسبقاً. يرجى تسجيل الدخول.',
  [AUTH_ERRORS.GUARDIAN_CONTACT_CONFLICT]: 'بيانات ولي الأمر مستخدمة بالفعل. يرجى التحقق.',
  [AUTH_ERRORS.GUARDIAN_ROLE_MISMATCH]: 'صلة القرابة المحددة غير متوافقة مع البيانات المسجلة.',

  [AUTH_ERRORS.OTP_INVALID]: 'رمز التحقق غير صحيح.',
  [AUTH_ERRORS.OTP_EXPIRED]: 'انتهت صلاحية رمز التحقق. اطلب رمزاً جديداً.',
  [AUTH_ERRORS.ALREADY_VERIFIED]: 'حسابك موثّق بالفعل.',

};
