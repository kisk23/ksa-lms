export type DateRange = 'today' | 'last_7' | 'last_30' | 'last_90' | 'year_to_date' | 'all_time';

export interface RegistrationsSummary {
  totalNewUsers: number;
  growthRate: number;
}
