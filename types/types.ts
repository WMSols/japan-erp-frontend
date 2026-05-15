export interface VehiclePurchase {
  id: string;
  vehicleId: string;
  supplierName: string;
  purchasePrice: number;
  auctionFee: number;
  warehouse: string;
  imagePreview: string | null;
  status: "Purchased" | "In Repair" | "Ready" | "Sold";
  addedAt: string; // ISO date string
}
// ─── Sales Types ────────────────────────────────────────────────────────────

export type SaleChannel = "auction" | "direct";
export type SaleStatus = "pending" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "partial" | "paid";

export interface SaleItem {
  id: string;
  vehicleId: string;       // VIN / Chassis No.
  vehicleName: string;     // e.g. "Toyota Land Cruiser 200"

  // Sale details
  channel: SaleChannel;
  status: SaleStatus;
  saleDate: string;        // ISO date

  // Financials
  sellingPrice: number;
  commission: number;      // agent / auction commission
  discount: number;
  netRevenue: number;      // sellingPrice - commission - discount

  // Cost reference (from costing engine)
  totalCost: number;       // purchase + repair + fees
  profit: number;          // netRevenue - totalCost

  // Customer
  customerId: string;
  customerName: string;

  // Payment
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountDue: number;       // netRevenue - amountPaid

  // Documents
  invoiceNumber: string;
  notes?: string;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  outstanding: number;     // total amount still unpaid
  avgProfit: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}


// ─── Ledger Types ────────────────────────────────────────────────────────────

export type LedgerTab = "supplier" | "customer" | "general" | "cash_bank";

// ── Shared ────────────────────────────────────────────────────────────────────

export type LedgerEntryType = "debit" | "credit" | "opening";

export interface LedgerEntry {
  id: string;
  date: string;            // ISO
  description: string;
  debit: number;           // money going out / purchases / expenses
  credit: number;          // money coming in / payments received
  balance: number;         // running balance
  reference?: string;      // invoice / receipt number
}

// ── 4.1 Supplier Ledger (Accounts Payable) ────────────────────────────────────

export interface SupplierLedger {
  supplierId: string;
  supplierName: string;
  phone?: string;
  openingBalance: number;
  entries: LedgerEntry[];
  // Derived
  totalPurchases: number;
  totalPayments: number;
  outstandingBalance: number;
  // Aging
  agingCurrent: number;    // 0-30 days
  aging30: number;         // 31-60 days
  aging60: number;         // 61-90 days
  aging90: number;         // 90+ days
}

// ── 4.2 Customer Ledger (Accounts Receivable) ─────────────────────────────────

export interface CustomerLedger {
  customerId: string;
  customerName: string;
  phone?: string;
  email?: string;
  openingBalance: number;
  entries: LedgerEntry[];
  // Derived
  totalSales: number;
  totalReceived: number;
  outstandingReceivable: number;
  hasPendingAlert: boolean;
}

// ── 4.3 General Ledger ────────────────────────────────────────────────────────

export type GLAccountType = "asset" | "liability" | "income" | "expense";

export interface GLAccount {
  code: string;            // e.g. "1001"
  name: string;
  type: GLAccountType;
  openingBalance: number;
  entries: LedgerEntry[];
  balance: number;
}

export interface GLEntry {
  id: string;
  date: string;
  description: string;
  reference?: string;
  lines: GLLine[];         // double-entry: debits must equal credits
}

export interface GLLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

// ── 4.4 Cash & Bank Ledger ────────────────────────────────────────────────────

export type AccountKind = "cash" | "bank";

export interface CashBankAccount {
  id: string;
  name: string;            // e.g. "Main Cash", "Mitsubishi UFJ - JPY"
  kind: AccountKind;
  currency: string;        // "JPY", "USD", etc.
  openingBalance: number;
  entries: LedgerEntry[];
  balance: number;
}