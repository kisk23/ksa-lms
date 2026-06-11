import { Check, IdCard, Mail, User, UserPlus, X } from 'lucide-react';
import { motion } from 'motion/react';

import type { AddUserSuccessProps } from '../types';

export function AddUserSuccess({
  createdUser,
  addedMsg,
  nameLabel,
  idLabel,
  viewMsg,
  addAnotherMsg,
  onResetForm,
  onClose,
}: AddUserSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-[480px] border border-outline-variant overflow-hidden border-t-4 border-primary-container p-8 flex flex-col items-center"
        dir="rtl"
      >
        <div className="w-16 h-16 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center mb-6 shadow-md">
          <Check size={28} className="stroke-[3.5]" />
        </div>

        <h2 className="font-h2-ar text-xl font-bold text-on-surface mb-2 text-center">
          {addedMsg}
        </h2>
        <p className="font-body-md-ar text-sm text-on-surface-variant text-center mb-6 leading-relaxed px-4">
          تم إنشاء الحساب وإرسال بيانات الدخول إلى البريد الإلكتروني الخاص به.
        </p>

        <div className="w-full bg-surface-container-low rounded-2xl p-5 space-y-4 mb-8 border border-outline-variant/50">
          <div className="flex justify-between items-center text-sm">
            <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
              <User size={18} className="text-primary-container" />
              {nameLabel}
            </span>
            <span className="font-body-md-ar font-medium text-on-surface">{createdUser.name}</span>
          </div>

          <div className="border-b border-outline-variant/30" />

          <div className="flex justify-between items-center text-sm">
            <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
              <Mail size={18} className="text-primary-container" />
              البريد الإلكتروني
            </span>
            <span className="font-body-md-ar font-medium text-on-surface text-left" dir="ltr">
              {createdUser.email}
            </span>
          </div>

          <div className="border-b border-outline-variant/30" />

          <div className="flex justify-between items-center text-sm">
            <span className="font-caption-ar text-on-surface-variant flex items-center gap-2">
              <IdCard size={18} className="text-primary-container" />
              {idLabel}
            </span>
            <span
              className="font-body-md-ar font-bold bg-primary-container/10 text-primary-container px-4 py-1.5 rounded-full text-xs text-left"
              dir="ltr"
            >
              {createdUser.loginId}
            </span>
          </div>
        </div>

        <div className="w-full space-y-4">
          <button
            type="button"
            className="w-full py-3.5 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-body-md-ar font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <User size={20} className="stroke-[2.5]" />
            {viewMsg}
          </button>

          <div className="flex gap-4 w-full">
            <button
              type="button"
              onClick={onResetForm}
              className="flex-1 py-3 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus size={18} />
              {addAnotherMsg}
            </button>

            <button
              type="button"
              onClick={() => {
                onResetForm();
                onClose();
              }}
              className="flex-1 py-3 bg-transparent border border-outline-variant hover:bg-on-surface/5 text-on-surface rounded-xl font-body-md-ar text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <X size={18} />
              إغلاق
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
