'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateLoan } from '@/lib/calculator';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

interface LoanFormData {
  propertyPrice: string;
  downPayment: string;
  durationYears: string;
  interestRate: string;
  interestType: 'REDUCING' | 'FLAT';
  adminFee: string;
  apr: string;
}

interface LoanFormProps {
  onCalculate: (result: any) => void;
  onSave: (data: any) => void;
}

export default function LoanForm({ onCalculate, onSave }: LoanFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<LoanFormData>({
    propertyPrice: '',
    downPayment: '',
    durationYears: '',
    interestRate: '',
    interestType: 'REDUCING',
    adminFee: '',
    apr: '',
  });
  const [result, setResult] = useState<any>(null);

  // Auto-calculate down payment as 10% of property price
  const handlePropertyPriceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      propertyPrice: value,
      downPayment: value ? String(Number(value) * 0.1) : '',
    }));
  };

  // Format number with thousand separators
  const formatNumber = (value: string): string => {
    if (!value) return '';
    const num = value.replace(/,/g, '');
    if (isNaN(Number(num))) return value;
    return Number(num).toLocaleString('en-US');
  };

  // Remove formatting for calculations
  const parseNumber = (value: string): string => {
    return value.replace(/,/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'propertyPrice') {
      const cleanValue = parseNumber(value);
      handlePropertyPriceChange(cleanValue);
    } else {
      const cleanValue = parseNumber(value);
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      propertyPrice: Number(formData.propertyPrice),
      downPayment: Number(formData.downPayment),
      durationYears: Number(formData.durationYears),
      interestRate: Number(formData.interestRate),
      interestType: formData.interestType,
      adminFee: Number(formData.adminFee) || 0,
      apr: formData.apr ? Number(formData.apr) : undefined,
    };

    const calculationResult = calculateLoan(input);
    const fullResult = {
      ...input,
      ...calculationResult,
    };

    setResult(fullResult);
    onCalculate(fullResult);
  };

  const handleSave = async () => {
    if (!result) return;

    await onSave(result);
  };

  const handleClear = () => {
    setFormData({
      propertyPrice: '',
      downPayment: '',
      durationYears: '',
      interestRate: '',
      interestType: 'REDUCING',
      adminFee: '',
      apr: '',
    });
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <form onSubmit={handleCalculate} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.form.propertyPrice}
          </label>
          <input
            type="text"
            name="propertyPrice"
            value={formatNumber(formData.propertyPrice)}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.form.downPayment}
          </label>
          <input
            type="text"
            name="downPayment"
            value={formatNumber(formData.downPayment)}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {formData.propertyPrice && (
            <p className="mt-1 text-sm text-gray-500">
              {t.form.minimumDownPayment}: {formatNumber(String(Number(formData.propertyPrice) * 0.1))}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.form.loanDuration}
          </label>
          <input
            type="text"
            name="durationYears"
            value={formData.durationYears}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.form.interestRate}
          </label>
          <input
            type="text"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <Listbox
            value={formData.interestType}
            onChange={(value) => setFormData((prev) => ({ ...prev, interestType: value }))}
          >
            <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
              {t.form.interestType}
            </Listbox.Label>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white py-2 ltr:pl-3 ltr:pr-10 rtl:pr-3 rtl:pl-10 ltr:text-left rtl:text-right border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors">
                <span className="block truncate">
                  {formData.interestType === 'REDUCING' ? t.interestTypes.REDUCING : t.interestTypes.FLAT}
                </span>
                <span className="pointer-events-none absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center ltr:pr-2 rtl:pl-2">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Listbox.Option
                  value="REDUCING"
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 ${
                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {t.interestTypes.REDUCING}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-3 rtl:pr-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
                <Listbox.Option
                  value="FLAT"
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 ${
                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {t.interestTypes.FLAT}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-3 rtl:pr-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.form.adminFee}
          </label>
          <input
            type="text"
            name="adminFee"
            value={formatNumber(formData.adminFee)}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.form.apr}
          </label>
          <input
            type="text"
            name="apr"
            value={formData.apr}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 sm:py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium cursor-pointer"
          >
            {t.form.calculate}
          </button>
          {result && (
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white py-2 sm:py-2.5 px-4 rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base font-medium cursor-pointer"
            >
              {t.form.save}
            </button>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="sm:flex-shrink-0 px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium cursor-pointer"
          >
            {t.form.clear}
          </button>
        </div>
      </form>
    </div>
  );
}
