export interface ReportCardData {
  id: string;
  title: string;
  description: string;
  icon: string; // Material symbol name
  iconBg: string;
  iconColor: string;
  action: string;
  href?: string;
}

export type IconVariant = 'primary' | 'secondary' | 'tertiary' | 'error' | 'custom';
