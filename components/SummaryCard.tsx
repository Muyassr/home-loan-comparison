'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SummaryCardProps {
  result: {
    loanAmount: number;
    monthlyPayment: number;
    totalInterest: number;
    totalPayable: number;
    grandTotal: number;
    interestType: string;
    apr?: number;
    adminFee: number;
  } | null;
}

export default function SummaryCard({ result }: SummaryCardProps) {
  const { t } = useLanguage();

  if (!result) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const summaryItems = [
    { label: t.summary.loanAmount, value: result.loanAmount },
    {
      label: t.summary.monthlyPayment,
      value: result.monthlyPayment,
      highlight: true,
    },
    { label: t.summary.totalInterest, value: result.totalInterest },
    { label: t.summary.totalPayable, value: result.totalPayable },
    { label: t.summary.adminFee, value: result.adminFee },
    { label: t.summary.grandTotal, value: result.grandTotal, highlight: true },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        {t.summary.title}
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-2 sm:p-3 rounded ${
              item.highlight
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50'
            }`}
          >
            <span
              className={`text-sm sm:text-base font-medium ${item.highlight ? 'text-blue-900' : 'text-gray-700'}`}
            >
              {item.label}
            </span>
            <span
              className={`text-sm sm:text-base font-bold ${item.highlight ? 'text-blue-600 sm:text-lg' : 'text-gray-900'}`}
            >
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}

        <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded">
          <span className="text-sm sm:text-base font-medium text-gray-700">
            {t.summary.interestType}
          </span>
          <span className="text-sm sm:text-base font-semibold text-gray-900">
            {result.interestType === 'REDUCING'
              ? t.interestTypes.REDUCING
              : t.interestTypes.FLAT}
          </span>
        </div>

        {result.apr && (
          <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded">
            <span className="text-sm sm:text-base font-medium text-gray-700">
              {t.summary.apr}
            </span>
            <span className="text-sm sm:text-base font-semibold text-gray-900">
              {result.apr}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
