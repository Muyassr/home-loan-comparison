export interface LoanInput {
  propertyPrice: number;
  downPayment: number;
  durationYears: number;
  interestRate: number;
  interestType: 'REDUCING' | 'FLAT';
  adminFee: number;
  apr?: number;
}

export interface LoanResult {
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayable: number;
  grandTotal: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

/**
 * Calculate loan using reducing balance method
 */
function calculateReducingBalance(
  loanAmount: number,
  annualRate: number,
  durationYears: number
): { monthlyPayment: number; totalInterest: number; totalPayable: number } {
  const n = durationYears * 12;
  const r = annualRate / 100 / 12;

  let monthlyPayment: number;

  // Edge case: 0% interest
  if (r === 0) {
    monthlyPayment = loanAmount / n;
  } else {
    // Standard reducing balance formula
    monthlyPayment = (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayable = monthlyPayment * n;
  const totalInterest = totalPayable - loanAmount;

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalPayable: Number(totalPayable.toFixed(2)),
  };
}

/**
 * Calculate loan using flat rate method
 */
function calculateFlatRate(
  loanAmount: number,
  annualRate: number,
  durationYears: number
): { monthlyPayment: number; totalInterest: number; totalPayable: number } {
  const totalInterest = loanAmount * (annualRate / 100) * durationYears;
  const totalPayable = loanAmount + totalInterest;
  const monthlyPayment = totalPayable / (durationYears * 12);

  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalPayable: Number(totalPayable.toFixed(2)),
  };
}

/**
 * Main calculation function
 */
export function calculateLoan(input: LoanInput): LoanResult {
  const loanAmount = input.propertyPrice - input.downPayment;

  let result: { monthlyPayment: number; totalInterest: number; totalPayable: number };

  if (input.interestType === 'REDUCING') {
    result = calculateReducingBalance(loanAmount, input.interestRate, input.durationYears);
  } else {
    result = calculateFlatRate(loanAmount, input.interestRate, input.durationYears);
  }

  const grandTotal = result.totalPayable + input.adminFee;

  return {
    loanAmount: Number(loanAmount.toFixed(2)),
    monthlyPayment: result.monthlyPayment,
    totalInterest: result.totalInterest,
    totalPayable: result.totalPayable,
    grandTotal: Number(grandTotal.toFixed(2)),
  };
}

/**
 * Generate amortization schedule (for reducing balance only)
 */
export function generateAmortizationSchedule(
  loanAmount: number,
  annualRate: number,
  durationYears: number
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  const n = durationYears * 12;
  const r = annualRate / 100 / 12;

  let balance = loanAmount;
  let monthlyPayment: number;

  if (r === 0) {
    monthlyPayment = loanAmount / n;
  } else {
    monthlyPayment = (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }

  for (let month = 1; month <= n; month++) {
    const interestPayment = balance * r;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    // Handle rounding for final payment
    if (month === n) {
      balance = 0;
    }

    schedule.push({
      month,
      payment: Number(monthlyPayment.toFixed(2)),
      principal: Number(principalPayment.toFixed(2)),
      interest: Number(interestPayment.toFixed(2)),
      balance: Number(Math.max(0, balance).toFixed(2)),
    });
  }

  return schedule;
}

/**
 * Validate loan input
 */
export function validateLoanInput(input: LoanInput): string[] {
  const errors: string[] = [];

  if (input.propertyPrice <= 0) {
    errors.push('Property price must be greater than 0');
  }

  if (input.downPayment < 0) {
    errors.push('Down payment cannot be negative');
  }

  if (input.downPayment > input.propertyPrice) {
    errors.push('Down payment cannot exceed property price');
  }

  if (input.durationYears < 1 || input.durationYears > 40) {
    errors.push('Duration must be between 1 and 40 years');
  }

  if (input.interestRate < 0 || input.interestRate > 20) {
    errors.push('Interest rate must be between 0 and 20%');
  }

  if (input.adminFee < 0) {
    errors.push('Admin fee cannot be negative');
  }

  if (!['REDUCING', 'FLAT'].includes(input.interestType)) {
    errors.push('Interest type must be either REDUCING or FLAT');
  }

  return errors;
}
