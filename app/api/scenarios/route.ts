import { NextRequest, NextResponse } from 'next/server';
import { loanScenarios } from '@/lib/db';
import { calculateLoan, validateLoanInput, LoanInput } from '@/lib/calculator';

// GET /api/scenarios - Get all scenarios
export async function GET() {
  try {
    const scenarios = loanScenarios.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(scenarios);
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json({ error: 'Failed to fetch scenarios' }, { status: 500 });
  }
}

// POST /api/scenarios - Create a new scenario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const input: LoanInput = {
      propertyPrice: Number(body.propertyPrice),
      downPayment: Number(body.downPayment),
      durationYears: Number(body.durationYears),
      interestRate: Number(body.interestRate),
      interestType: body.interestType,
      adminFee: Number(body.adminFee) || 0,
      apr: body.apr ? Number(body.apr) : undefined,
    };

    const errors = validateLoanInput(input);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    // Check if we already have 10 scenarios
    const count = loanScenarios.count();
    if (count >= 10) {
      return NextResponse.json(
        { error: 'Maximum of 10 scenarios allowed. Please delete some scenarios first.' },
        { status: 400 }
      );
    }

    // Calculate loan
    const result = calculateLoan(input);

    // Save to database
    const scenario = loanScenarios.create({
      propertyPrice: input.propertyPrice,
      downPayment: input.downPayment,
      loanAmount: result.loanAmount,
      durationYears: input.durationYears,
      interestRate: input.interestRate,
      interestType: input.interestType,
      adminFee: input.adminFee,
      apr: input.apr,
      monthlyPayment: result.monthlyPayment,
      totalInterest: result.totalInterest,
      totalPayable: result.totalPayable,
      grandTotal: result.grandTotal,
    });

    return NextResponse.json(scenario, { status: 201 });
  } catch (error) {
    console.error('Error creating scenario:', error);
    return NextResponse.json({ error: 'Failed to create scenario' }, { status: 500 });
  }
}
