import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS loan_scenarios (
    id TEXT PRIMARY KEY,
    property_price REAL NOT NULL,
    down_payment REAL NOT NULL,
    loan_amount REAL NOT NULL,
    duration_years INTEGER NOT NULL,
    interest_rate REAL NOT NULL,
    interest_type TEXT NOT NULL,
    admin_fee REAL NOT NULL,
    apr REAL,
    monthly_payment REAL NOT NULL,
    total_interest REAL NOT NULL,
    total_payable REAL NOT NULL,
    grand_total REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface LoanScenario {
  id: string;
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  durationYears: number;
  interestRate: number;
  interestType: string;
  adminFee: number;
  apr?: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayable: number;
  grandTotal: number;
  createdAt: string;
}

export const loanScenarios = {
  findMany: (options?: { orderBy?: { createdAt: 'desc' | 'asc' } }) => {
    const order = options?.orderBy?.createdAt === 'desc' ? 'DESC' : 'ASC';
    const rows = db
      .prepare(`SELECT * FROM loan_scenarios ORDER BY created_at ${order}`)
      .all();

    return rows.map((row: any) => ({
      id: row.id,
      propertyPrice: row.property_price,
      downPayment: row.down_payment,
      loanAmount: row.loan_amount,
      durationYears: row.duration_years,
      interestRate: row.interest_rate,
      interestType: row.interest_type,
      adminFee: row.admin_fee,
      apr: row.apr,
      monthlyPayment: row.monthly_payment,
      totalInterest: row.total_interest,
      totalPayable: row.total_payable,
      grandTotal: row.grand_total,
      createdAt: row.created_at,
    }));
  },

  create: (data: Omit<LoanScenario, 'id' | 'createdAt'>) => {
    const id = crypto.randomUUID();
    const stmt = db.prepare(`
      INSERT INTO loan_scenarios (
        id, property_price, down_payment, loan_amount, duration_years,
        interest_rate, interest_type, admin_fee, apr, monthly_payment,
        total_interest, total_payable, grand_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.propertyPrice,
      data.downPayment,
      data.loanAmount,
      data.durationYears,
      data.interestRate,
      data.interestType,
      data.adminFee,
      data.apr || null,
      data.monthlyPayment,
      data.totalInterest,
      data.totalPayable,
      data.grandTotal
    );

    const row: any = db
      .prepare('SELECT * FROM loan_scenarios WHERE id = ?')
      .get(id);
    return {
      id: row.id,
      propertyPrice: row.property_price,
      downPayment: row.down_payment,
      loanAmount: row.loan_amount,
      durationYears: row.duration_years,
      interestRate: row.interest_rate,
      interestType: row.interest_type,
      adminFee: row.admin_fee,
      apr: row.apr,
      monthlyPayment: row.monthly_payment,
      totalInterest: row.total_interest,
      totalPayable: row.total_payable,
      grandTotal: row.grand_total,
      createdAt: row.created_at,
    };
  },

  delete: (id: string) => {
    const stmt = db.prepare('DELETE FROM loan_scenarios WHERE id = ?');
    stmt.run(id);
  },

  count: () => {
    const result: any = db
      .prepare('SELECT COUNT(*) as count FROM loan_scenarios')
      .get();
    return result.count;
  },
};

export default db;
