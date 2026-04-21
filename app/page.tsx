'use client';

import { useState, useEffect } from 'react';
import LoanForm from '@/components/LoanForm';
import SummaryCard from '@/components/SummaryCard';
import ComparisonTable from '@/components/ComparisonTable';
import AmortizationTable from '@/components/AmortizationTable';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Fetch scenarios on mount
  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await fetch('/api/scenarios');
      if (response.ok) {
        const data = await response.json();
        setScenarios(data);
      }
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const handleCalculate = (calculationResult: any) => {
    setResult(calculationResult);
  };

  const handleSave = async (data: any) => {
    try {
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t.messages.scenarioSaved });
        fetchScenarios();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || t.messages.error });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error saving scenario:', error);
      setMessage({ type: 'error', text: t.messages.error });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/scenarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t.messages.scenarioDeleted });
        fetchScenarios();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: t.messages.error });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error deleting scenario:', error);
      setMessage({ type: 'error', text: t.messages.error });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-4 sm:py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div className="text-center sm:text-start">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {t.app.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              {t.app.subtitle}
            </p>
          </div>
          <div className="flex gap-2 justify-center sm:justify-end flex-shrink-0">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t.language.english}
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                language === 'ar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t.language.arabic}
            </button>
          </div>
        </div>

        {/* Message notification */}
        {message && (
          <div
            className={`p-4 rounded-md mb-4 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left column: Form */}
          <div>
            <LoanForm onCalculate={handleCalculate} onSave={handleSave} />
          </div>

          {/* Right column: Summary */}
          <div>
            <SummaryCard result={result} />
          </div>
        </div>

        {/* Amortization Table */}
        {result && (
          <div className="mb-6">
            <AmortizationTable
              loanAmount={result.loanAmount}
              interestRate={result.interestRate}
              durationYears={result.durationYears}
              interestType={result.interestType}
            />
          </div>
        )}

        {/* Comparison Table */}
        <div>
          <ComparisonTable scenarios={scenarios} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
