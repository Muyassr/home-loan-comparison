import { NextRequest, NextResponse } from 'next/server';
import { loanScenarios } from '@/lib/db';

// DELETE /api/scenarios/[id] - Delete a scenario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    loanScenarios.delete(id);

    return NextResponse.json({ message: 'Scenario deleted successfully' });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    return NextResponse.json({ error: 'Failed to delete scenario' }, { status: 500 });
  }
}
