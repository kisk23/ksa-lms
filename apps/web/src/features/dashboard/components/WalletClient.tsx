'use client';

import { useState, useRef } from 'react';
import {
  Wallet,
  PlusCircle,
  ShoppingCart,
  History,
  CreditCard,
  Building,
  Lock,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'purchase' | 'deposit';
  description: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-1001',
    type: 'purchase',
    description: 'دورة الفيزياء المتقدمة',
    amount: -150.0,
    date: '15 أكتوبر 2023',
    status: 'success',
  },
  {
    id: 'TX-1002',
    type: 'deposit',
    description: 'إيداع عبر البطاقة',
    amount: 500.0,
    date: '10 أكتوبر 2023',
    status: 'success',
  },
  {
    id: 'TX-1003',
    type: 'purchase',
    description: 'مراجعة الرياضيات',
    amount: -50.0,
    date: '05 أكتوبر 2023',
    status: 'success',
  },
];

export function WalletClient() {
  const [balance, setBalance] = useState<number>(450.0);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [filterType, setFilterType] = useState<'all' | 'purchase' | 'deposit'>('all');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleQuickAction = (action: 'deposit' | 'purchase' | 'history') => {
    if (action === 'deposit') {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      // focus input
      const inputEl = document.getElementById('amount-input');
      if (inputEl) inputEl.focus();
    } else if (action === 'purchase') {
      toast('سيتم تحويلك إلى متجر المقررات قريباً!', {
        icon: '🛒',
      });
    } else if (action === 'history') {
      historyRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(depositAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      toast.error('الرجاء إدخال مبلغ صالح أكبر من صفر.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setBalance((prev) => prev + amountVal);
      const newTx: Transaction = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'deposit',
        description: paymentMethod === 'card' ? 'إيداع عبر البطاقة' : 'إيداع عبر تحويل بنكي',
        amount: amountVal,
        date: 'اليوم',
        status: 'success',
      };
      setTransactions((prev) => [newTx, ...prev]);
      setDepositAmount('');
      setIsSubmitting(false);
      toast.success(`تم شحن رصيدك بنجاح بمبلغ ${amountVal.toFixed(2)} ريال سعودي!`);
    }, 1200);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  return (
    <div className="space-y-8 font-arabic text-right pb-12" dir="rtl">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-on-surface">المحفظة</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          تتبع رصيدك، معاملاتك، واشحن محفظتك بكل سهولة وأمان.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#2446b8] to-[#3554c6] rounded-xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
            <div>
              <p className="text-white/80 text-sm mb-2 font-medium">الرصيد المتاح</p>
              <h2 className="text-4xl md:text-5xl font-black font-sans tracking-tight">
                {balance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="text-lg md:text-xl font-medium mr-2">ريال سعودي</span>
              </h2>
            </div>
            <button
              onClick={() => handleQuickAction('deposit')}
              className="bg-white text-primary-container hover:bg-surface-container-low transition-colors duration-200 px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <PlusCircle size={18} />
              <span>شحن الرصيد</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-6 flex flex-col justify-center">
          <h3 className="text-base font-bold mb-4 text-on-surface">إجراءات سريعة</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleQuickAction('deposit')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-surface-container transition-all text-primary hover:text-primary-hover cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <span className="text-xs font-semibold">شحن الرصيد</span>
            </button>

            <button
              onClick={() => handleQuickAction('purchase')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-surface-container transition-all text-primary hover:text-primary-hover cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <span className="text-xs font-semibold">شراء كورس</span>
            </button>

            <button
              onClick={() => handleQuickAction('history')}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-surface-container transition-all text-primary hover:text-primary-hover cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <History size={20} />
              </div>
              <span className="text-xs font-semibold">عرض السجل</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Funds Section */}
        <div
          ref={formRef}
          className="lg:col-span-1 bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-bold mb-6 text-on-surface">شحن الرصيد</h3>
            <form onSubmit={handleDeposit} className="space-y-6">
              <div>
                <label
                  htmlFor="amount-input"
                  className="block text-xs font-bold text-on-surface-variant mb-2"
                >
                  المبلغ (ريال سعودي)
                </label>
                <input
                  id="amount-input"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full border border-outline-variant rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow text-left"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2">
                  طريقة الدفع
                </label>
                <div className="space-y-3">
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                      ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-surface-container-low/50'
                          : 'border-outline-variant hover:bg-surface-container-low/20'
                      }
                    `}
                  >
                    <input
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-primary focus:ring-primary ml-3 cursor-pointer"
                      name="payment"
                      type="radio"
                    />
                    <CreditCard className="ml-2 text-on-surface-variant" size={18} />
                    <span className="text-xs font-bold text-on-surface">
                      بطاقة ائتمان (Visa/MasterCard)
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                      ${
                        paymentMethod === 'bank'
                          ? 'border-primary bg-surface-container-low/50'
                          : 'border-outline-variant hover:bg-surface-container-low/20'
                      }
                    `}
                  >
                    <input
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="text-primary focus:ring-primary ml-3 cursor-pointer"
                      name="payment"
                      type="radio"
                    />
                    <Building className="ml-2 text-on-surface-variant" size={18} />
                    <span className="text-xs font-bold text-on-surface">تحويل بنكي</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover transition-colors shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري الشحن...</span>
                  </>
                ) : (
                  <span>شحن الرصيد الآن</span>
                )}
              </button>
            </form>
          </div>
          <div className="text-center text-[10px] text-on-surface-variant flex items-center justify-center gap-1 mt-6 border-t border-outline-variant/30 pt-4">
            <Lock size={12} className="text-secondary" />
            <span className="font-semibold">عملية آمنة ومحمية بشهادة SSL مشفرة بالكامل</span>
          </div>
        </div>

        {/* Transaction History */}
        <div
          ref={historyRef}
          className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-outline-variant/30 pb-4">
            <div>
              <h3 className="text-lg font-bold text-on-surface">سجل العمليات</h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                تفاصيل جميع عمليات الشحن والشراء التي تمت على حسابك
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => {
                    const nextFilter =
                      filterType === 'all'
                        ? 'deposit'
                        : filterType === 'deposit'
                          ? 'purchase'
                          : 'all';
                    setFilterType(nextFilter);
                    toast(
                      `تم تصفية السجل: ${nextFilter === 'all' ? 'الكل' : nextFilter === 'deposit' ? 'عمليات الشحن فقط' : 'عمليات الشراء فقط'}`,
                    );
                  }}
                  className="px-3 py-1.5 border border-outline-variant/60 rounded text-xs font-bold text-on-surface-variant flex items-center gap-1.5 hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <Filter size={12} />
                  <span>
                    تصفية (
                    {filterType === 'all' ? 'الكل' : filterType === 'deposit' ? 'شحن' : 'شراء'})
                  </span>
                </button>
              </div>
              <button
                onClick={() => {
                  toast('سيتم إتاحة فلترة التواريخ المفصلة قريباً!');
                }}
                className="px-3 py-1.5 border border-outline-variant/60 rounded text-xs font-bold text-on-surface-variant flex items-center gap-1.5 hover:bg-surface-container cursor-pointer transition-colors"
              >
                <Calendar size={12} />
                <span>التاريخ</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant text-xs">
                  <th className="pb-3 font-bold w-1/4">نوع العملية</th>
                  <th className="pb-3 font-bold w-1/3">الوصف</th>
                  <th className="pb-3 font-bold text-left pl-4">المبلغ</th>
                  <th className="pb-3 font-bold">التاريخ</th>
                  <th className="pb-3 font-bold text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-on-surface-variant font-medium"
                    >
                      لا توجد عمليات تطابق التصفية المحددة.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-surface-container last:border-0 hover:bg-surface-container-low/40 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center
                              ${
                                tx.type === 'deposit'
                                  ? 'bg-secondary-container/20 text-on-secondary-container'
                                  : 'bg-error-container/20 text-on-error-container'
                              }
                            `}
                          >
                            {tx.type === 'deposit' ? (
                              <ArrowUpRight size={14} />
                            ) : (
                              <ArrowDownLeft size={14} />
                            )}
                          </div>
                          <span className="font-bold">
                            {tx.type === 'deposit' ? 'شحن' : 'شراء'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-on-surface font-semibold">{tx.description}</td>
                      <td
                        className={`py-4 font-bold text-left pl-4 font-sans text-sm
                          ${tx.type === 'deposit' ? 'text-secondary' : 'text-error'}
                        `}
                      >
                        {tx.type === 'deposit' ? '+' : '-'}
                        {Math.abs(tx.amount).toFixed(2)} ر.س
                      </td>
                      <td className="py-4 text-on-surface-variant font-medium">{tx.date}</td>
                      <td className="py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold rounded-full border border-secondary-container/30">
                          <CheckCircle2 size={10} className="text-secondary" />
                          <span>ناجحة</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
