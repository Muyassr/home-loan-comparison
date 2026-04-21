'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateAmortizationSchedule } from '@/lib/calculator';

interface AmortizationTableProps {
  loanAmount: number;
  interestRate: number;
  durationYears: number;
  interestType: string;
}

export default function AmortizationTable({
  loanAmount,
  interestRate,
  durationYears,
  interestType,
}: AmortizationTableProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (interestType !== 'REDUCING') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
          {t.amortization.title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center py-4">
          {t.amortization.notAvailable}
        </p>
      </div>
    );
  }

  const schedule = generateAmortizationSchedule(
    loanAmount,
    interestRate,
    durationYears
  );

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t.amortization.title}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base cursor-pointer"
        >
          {isOpen ? t.amortization.hide : t.amortization.show}
        </button>
      </div>

      {isOpen && (
        <div className="overflow-x-auto -mx-4 sm:mx-0 max-h-96 overflow-y-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {t.amortization.month}
                    </th>
                    <th className="px-3 sm:px-4 py-3 ltr:text-right rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {t.amortization.payment}
                    </th>
                    <th className="px-3 sm:px-4 py-3 ltr:text-right rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {t.amortization.principal}
                    </th>
                    <th className="px-3 sm:px-4 py-3 ltr:text-right rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {t.amortization.interest}
                    </th>
                    <th className="px-3 sm:px-4 py-3 ltr:text-right rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {t.amortization.balance}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedule.map(row => (
                    <tr key={row.month} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-left rtl:text-right">
                        {row.month}
                      </td>
                      <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-right rtl:text-right">
                        {formatCurrency(row.payment)}
                      </td>
                      <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-right rtl:text-right">
                        {formatCurrency(row.principal)}
                      </td>
                      <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-right rtl:text-right">
                        {formatCurrency(row.interest)}
                      </td>
                      <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-right rtl:text-right">
                        {formatCurrency(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
