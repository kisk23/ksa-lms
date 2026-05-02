import { Card } from '@shared/components/ui/Card';
import { IconBadge } from '@shared/components/ui/IconBadge';
import {
  PlusCircle,
  UserCheck,
  AlertTriangle,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';

type Activity = {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  hoverBorder: string;
  title: string;
  time: string;
  description: string;
};

const activities: Activity[] = [
  {
    icon: PlusCircle,
    iconColor: 'text-primary',
    iconBg: 'bg-primary-container/10',
    hoverBorder: 'hover:border-primary/30',
    title: 'دورة جديدة مضافة',
    time: 'منذ 10 دقائق',
    description: 'تمت إضافة "مقدمة في الفيزياء الكمية" بواسطة د. أحمد عبدالله.',
  },
  {
    icon: UserCheck,
    iconColor: 'text-secondary',
    iconBg: 'bg-secondary-container/20',
    hoverBorder: 'hover:border-secondary/30',
    title: 'تسجيل طالب جديد',
    time: 'منذ ساعتين',
    description: 'انضم الطالب "محمد خالد" إلى المنصة واشترك في 3 دورات.',
  },
  {
    icon: AlertTriangle,
    iconColor: 'text-error',
    iconBg: 'bg-error-container/50',
    hoverBorder: 'hover:border-error/30',
    title: 'طلب استرجاع',
    time: 'منذ 5 ساعات',
    description: 'طلب استرجاع رقم #REQ-4029 قيد الانتظار للمراجعة.',
  },
];

export function RecentActivity() {
  return (
    <Card>
      <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-sm">
        <h3 className="text-h2-ar font-h2-ar text-on-surface">سجل النشاط الحديث</h3>
        <button className="text-outline hover:text-primary transition-colors">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <div className="space-y-0 relative before:absolute before:inset-y-0 before:right-[1.1rem] before:w-px before:bg-outline-variant/30">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex gap-md py-sm relative">
            <IconBadge
              icon={activity.icon}
              size="sm"
              shape="circle"
              bgClass={`${activity.iconBg} border-4 border-white z-10`}
              iconClass={activity.iconColor}
            />
            <div
              className={`flex-1 bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/20 ${activity.hoverBorder} transition-colors`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-body-md-ar font-body-md-ar font-bold text-on-surface">
                  {activity.title}
                </h4>
                <span className="text-caption-ar font-caption-ar text-outline">
                  {activity.time}
                </span>
              </div>
              <p className="text-caption-ar font-caption-ar text-outline">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
