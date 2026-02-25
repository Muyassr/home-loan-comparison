'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Scenario {
  id: string;
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  durationYears: number;
  interestRate: number;
  interestType: string;
  monthlyPayment: number;
  totalInterest: number;
  grandTotal: number;
}

interface ComparisonTableProps {
  scenarios: Scenario[];
  onDelete: (id: string) => void;
}

export default function ComparisonTable({ scenarios, onDelete }: ComparisonTableProps) {
  const { t } = useLanguage();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (scenarios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">{t.comparison.title}</h2>
        <p className="text-sm sm:text-base text-gray-600 text-center py-8">{t.comparison.noScenarios}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">{t.comparison.title}</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {t.comparison.propertyPrice}
              </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.downPayment}
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.loanAmount}
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.duration}
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.rate}
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.type}
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.monthly}
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.totalInterest}
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.grandTotal}
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scenarios.map((scenario) => (
                  <tr key={scenario.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-left rtl:text-right">
                      {formatCurrency(scenario.propertyPrice)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-left rtl:text-right">
                      {formatCurrency(scenario.downPayment)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-left rtl:text-right">
                      {formatCurrency(scenario.loanAmount)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-left rtl:text-right">
                      {scenario.durationYears} {t.comparison.years}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-left rtl:text-right">
                      {scenario.interestRate}%
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-left rtl:text-right">
                      {scenario.interestType === 'REDUCING' ? t.interestTypes.REDUCING : t.interestTypes.FLAT}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-semibold text-blue-600 ltr:text-left rtl:text-right">
                      {formatCurrency(scenario.monthlyPayment)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 ltr:text-left rtl:text-right">
                      {formatCurrency(scenario.totalInterest)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-semibold text-green-600 ltr:text-left rtl:text-right">
                      {formatCurrency(scenario.grandTotal)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm ltr:text-left rtl:text-right">
                      <button
                        onClick={() => onDelete(scenario.id)}
                        className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                      >
                        {t.comparison.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
