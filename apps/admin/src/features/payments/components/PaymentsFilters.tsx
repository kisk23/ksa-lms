'use client';

import { Search, Calendar, Filter, User, SlidersHorizontal } from 'lucide-react';

import type { PaymentFilters } from '../types';

interface PaymentsFiltersProps {
  filters: PaymentFilters;
  onFiltersChange: (filters: Partial<PaymentFilters>) => void;
}

export function PaymentsFilters({ filters, onFiltersChange }: PaymentsFiltersProps) {
  return (
    <div className="p-md border-b border-outline-variant bg-surface-bright flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="relative w-full lg:w-96">
        <Search className="absolute right-3 top-2.5 text-outline w-4 h-4" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="w-full bg-white border border-outline-variant rounded-lg py-2 pr-10 pl-4 text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
          placeholder="Search by order ID..."
        />
      </div>

      <div className="flex flex-wrap gap-3 w-full lg:w-auto">
        <div className="relative">
          <select
            value={filters.dateRange}
            onChange={(e) =>
              onFiltersChange({
                dateRange: e.target.value as PaymentFilters['dateRange'],
              })
            }
            className="appearance-none bg-white border border-outline-variant rounded-lg py-2 pl-8 pr-4 text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer text-on-surface"
          >
            <option value="this_month">This month</option>
            <option value="last_month">Last month</option>
            <option value="last_3_months">Last 3 months</option>
            <option value="custom">Custom range</option>
          </select>
          <Calendar className="absolute left-2 top-2.5 text-outline w-4 h-4 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({
                status: e.target.value as PaymentFilters['status'],
              })
            }
            className="appearance-none bg-white border border-outline-variant rounded-lg py-2 pl-8 pr-4 text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer text-on-surface"
          >
            <option value="all">All statuses</option>
            <option value="initiated">Initiated</option>
            <option value="paid">Paid</option>
            <option value="authorized">Authorized</option>
            <option value="captured">Captured</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="voided">Voided</option>
          </select>
          <Filter className="absolute left-2 top-2.5 text-outline w-4 h-4 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filters.instructor}
            onChange={(e) => onFiltersChange({ instructor: e.target.value })}
            className="appearance-none bg-white border border-outline-variant rounded-lg py-2 pl-8 pr-4 text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer text-on-surface"
          >
            <option value="all">All instructors</option>
            <option value="instructor-1">Instructor 1</option>
            <option value="instructor-2">Instructor 2</option>
          </select>
          <User className="absolute left-2 top-2.5 text-outline w-4 h-4 pointer-events-none" />
        </div>

        <button
          type="button"
          className="bg-surface-container text-primary-container hover:bg-surface-container-high p-2 rounded-lg transition-colors border border-outline-variant"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
