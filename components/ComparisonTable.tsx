'use client';

import React, { useState, useMemo } from 'react';
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

type SortableKey = 'propertyPrice' | 'monthlyPayment' | 'grandTotal' | 'totalInterest' | 'interestRate' | 'loanAmount' | 'durationYears';

export default function ComparisonTable({ scenarios, onDelete }: ComparisonTableProps) {
  const { t } = useLanguage();
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKey;
    direction: 'asc' | 'desc';
  }>({ key: 'monthlyPayment', direction: 'asc' });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const sortedScenarios = useMemo(() => {
    const sorted = [...scenarios];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [scenarios, sortConfig]);

  const handleSort = (key: SortableKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (columnKey: SortableKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>;
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
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
                  <th
                    onClick={() => handleSort('propertyPrice')}
                    className="group px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{t.comparison.propertyPrice}</span>
                      <span className="text-xs">{getSortIcon('propertyPrice')}</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.downPayment}
                  </th>
                  <th
                    onClick={() => handleSort('loanAmount')}
                    className="group px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{t.comparison.loanAmount}</span>
                      <span className="text-xs">{getSortIcon('loanAmount')}</span>
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('durationYears')}
                    className="group px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{t.comparison.duration}</span>
                      <span className="text-xs">{getSortIcon('durationYears')}</span>
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('interestRate')}
                    className="group px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{t.comparison.rate}</span>
                      <span className="text-xs">{getSortIcon('interestRate')}</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.type}
                  </th>
                  <th
                    onClick={() => handleSort('monthlyPayment')}
                    className="group px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-blue-700 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{t.comparison.monthly}</span>
                      <span className="text-sm">{getSortIcon('monthlyPayment')}</span>
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('totalInterest')}
                    className="group px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-blue-700 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{t.comparison.totalInterest}</span>
                      <span className="text-sm">{getSortIcon('totalInterest')}</span>
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('grandTotal')}
                    className="group px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-blue-700 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{t.comparison.grandTotal}</span>
                      <span className="text-sm">{getSortIcon('grandTotal')}</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-4 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {t.comparison.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedScenarios.map((scenario) => (
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
