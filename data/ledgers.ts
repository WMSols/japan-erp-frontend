import type {
  SupplierLedger,
  CustomerLedger,
  GLAccount,
  GLEntry,
  CashBankAccount,
} from "@/types/types";

// ─── 4.1 Supplier Ledgers ────────────────────────────────────────────────────

export const MOCK_SUPPLIER_LEDGERS: SupplierLedger[] = [
  {
    supplierId: "SUP-001",
    supplierName: "Tanaka Auto Auctions",
    phone: "+81 3-1234-5678",
    openingBalance: 500000,
    totalPurchases: 3200000,
    totalPayments: 2800000,
    outstandingBalance: 900000,
    agingCurrent: 400000,
    aging30: 300000,
    aging60: 200000,
    aging90: 0,
    entries: [
      { id: "e1",  date: "2025-03-01", description: "Opening Balance",                    debit: 0,       credit: 0,       balance: 500000,  reference: "" },
      { id: "e2",  date: "2025-03-15", description: "Purchase – Nissan Patrol Y61",       debit: 1200000, credit: 0,       balance: 1700000, reference: "PO-2025-001" },
      { id: "e3",  date: "2025-03-28", description: "Payment via Bank Transfer",           debit: 0,       credit: 1000000, balance: 700000,  reference: "PAY-001" },
      { id: "e4",  date: "2025-04-10", description: "Purchase – Toyota Land Cruiser 200", debit: 2000000, credit: 0,       balance: 2700000, reference: "PO-2025-002" },
      { id: "e5",  date: "2025-04-22", description: "Payment via Bank Transfer",           debit: 0,       credit: 1800000, balance: 900000,  reference: "PAY-002" },
    ],
  },
  {
    supplierId: "SUP-002",
    supplierName: "Osaka Vehicle Dealers",
    phone: "+81 6-9876-5432",
    openingBalance: 0,
    totalPurchases: 1800000,
    totalPayments: 1800000,
    outstandingBalance: 0,
    agingCurrent: 0,
    aging30: 0,
    aging60: 0,
    aging90: 0,
    entries: [
      { id: "e6",  date: "2025-04-05", description: "Opening Balance",                    debit: 0,       credit: 0,       balance: 0,       reference: "" },
      { id: "e7",  date: "2025-04-05", description: "Purchase – Honda Accord 2015",       debit: 900000,  credit: 0,       balance: 900000,  reference: "PO-2025-003" },
      { id: "e8",  date: "2025-04-12", description: "Purchase – Kia Sportage 2013",       debit: 900000,  credit: 0,       balance: 1800000, reference: "PO-2025-004" },
      { id: "e9",  date: "2025-04-20", description: "Full Settlement",                    debit: 0,       credit: 1800000, balance: 0,       reference: "PAY-003" },
    ],
  },
  {
    supplierId: "SUP-003",
    supplierName: "Yamamoto Heavy Machinery",
    phone: "+81 72-555-0101",
    openingBalance: 200000,
    totalPurchases: 950000,
    totalPayments: 300000,
    outstandingBalance: 850000,
    agingCurrent: 200000,
    aging30: 350000,
    aging60: 300000,
    aging90: 0,
    entries: [
      { id: "e10", date: "2025-02-01", description: "Opening Balance",                    debit: 0,       credit: 0,       balance: 200000,  reference: "" },
      { id: "e11", date: "2025-02-20", description: "Purchase – Forklift Unit",            debit: 650000,  credit: 0,       balance: 850000,  reference: "PO-2025-005" },
      { id: "e12", date: "2025-03-10", description: "Partial Payment",                    debit: 0,       credit: 300000,  balance: 550000,  reference: "PAY-004" },
      { id: "e13", date: "2025-04-15", description: "Purchase – Spare Parts Batch",       debit: 300000,  credit: 0,       balance: 850000,  reference: "PO-2025-006" },
    ],
  },
];

// ─── 4.2 Customer Ledgers ────────────────────────────────────────────────────

export const MOCK_CUSTOMER_LEDGERS: CustomerLedger[] = [
  {
    customerId: "CUS-001",
    customerName: "Ahmed Al-Rashid",
    phone: "+92 300 1234567",
    email: "ahmed@example.com",
    openingBalance: 0,
    totalSales: 4700000,
    totalReceived: 4700000,
    outstandingReceivable: 0,
    hasPendingAlert: false,
    entries: [
      { id: "c1", date: "2025-04-24", description: "Sale – Toyota Land Cruiser 200", debit: 4700000, credit: 0,       balance: 4700000, reference: "INV-2025-001" },
      { id: "c2", date: "2025-04-25", description: "Payment Received – Bank Transfer", debit: 0,       credit: 4700000, balance: 0,       reference: "REC-001" },
    ],
  },
  {
    customerId: "CUS-003",
    customerName: "Malik Traders Ltd",
    phone: "+92 21 3456789",
    email: "info@maliktraders.com",
    openingBalance: 0,
    totalSales: 1550000,
    totalReceived: 800000,
    outstandingReceivable: 750000,
    hasPendingAlert: true,
    entries: [
      { id: "c3", date: "2025-05-08", description: "Sale – Kia Sportage 2013",        debit: 1550000, credit: 0,      balance: 1550000, reference: "INV-2025-003" },
      { id: "c4", date: "2025-05-09", description: "Advance Payment Received",         debit: 0,       credit: 800000, balance: 750000,  reference: "REC-002" },
    ],
  },
  {
    customerId: "CUS-005",
    customerName: "Gulf Motors LLC",
    phone: "+971 4 123 4567",
    email: "info@gulfmotors.ae",
    openingBalance: 0,
    totalSales: 2200000,
    totalReceived: 0,
    outstandingReceivable: 2200000,
    hasPendingAlert: true,
    entries: [
      { id: "c5", date: "2025-05-10", description: "Sale – BMW 3 Series 2013",         debit: 2200000, credit: 0,      balance: 2200000, reference: "INV-2025-005" },
    ],
  },
];

// ─── 4.3 General Ledger ──────────────────────────────────────────────────────

export const MOCK_GL_ACCOUNTS: GLAccount[] = [
  { code: "1001", name: "Cash in Hand",          type: "asset",     openingBalance: 500000,  balance: 850000,  entries: [] },
  { code: "1002", name: "Bank – Mitsubishi UFJ", type: "asset",     openingBalance: 2000000, balance: 3450000, entries: [] },
  { code: "1003", name: "Inventory – Vehicles",  type: "asset",     openingBalance: 0,       balance: 8200000, entries: [] },
  { code: "2001", name: "Accounts Payable",      type: "liability", openingBalance: 700000,  balance: 1750000, entries: [] },
  { code: "2002", name: "Tax Payable (消費税)",  type: "liability", openingBalance: 0,       balance: 380000,  entries: [] },
  { code: "3001", name: "Sales Revenue",         type: "income",    openingBalance: 0,       balance: 10137500,entries: [] },
  { code: "3002", name: "Auction Income",        type: "income",    openingBalance: 0,       balance: 2118500, entries: [] },
  { code: "4001", name: "Cost of Goods Sold",    type: "expense",   openingBalance: 0,       balance: 7080000, entries: [] },
  { code: "4002", name: "Repair & Maintenance",  type: "expense",   openingBalance: 0,       balance: 408900,  entries: [] },
  { code: "4003", name: "Salaries",              type: "expense",   openingBalance: 0,       balance: 600000,  entries: [] },
  { code: "4004", name: "Rent",                  type: "expense",   openingBalance: 0,       balance: 180000,  entries: [] },
  { code: "4005", name: "Utilities",             type: "expense",   openingBalance: 0,       balance: 45000,   entries: [] },
];

export const MOCK_GL_ENTRIES: GLEntry[] = [
  {
    id: "GL-001", date: "2025-04-24",
    description: "Sale of Toyota Land Cruiser 200",
    reference: "INV-2025-001",
    lines: [
      { accountCode: "1002", accountName: "Bank – Mitsubishi UFJ", debit: 4700000, credit: 0 },
      { accountCode: "3001", accountName: "Sales Revenue",          debit: 0,       credit: 4700000 },
    ],
  },
  {
    id: "GL-002", date: "2025-04-24",
    description: "COGS – Toyota Land Cruiser 200",
    reference: "INV-2025-001",
    lines: [
      { accountCode: "4001", accountName: "Cost of Goods Sold",    debit: 3950000, credit: 0 },
      { accountCode: "1003", accountName: "Inventory – Vehicles",  debit: 0,       credit: 3950000 },
    ],
  },
  {
    id: "GL-003", date: "2025-04-22",
    description: "Payment to Tanaka Auto Auctions",
    reference: "PAY-002",
    lines: [
      { accountCode: "2001", accountName: "Accounts Payable",      debit: 1800000, credit: 0 },
      { accountCode: "1002", accountName: "Bank – Mitsubishi UFJ", debit: 0,       credit: 1800000 },
    ],
  },
  {
    id: "GL-004", date: "2025-05-01",
    description: "Monthly Salaries",
    reference: "PAY-SAL-05",
    lines: [
      { accountCode: "4003", accountName: "Salaries",              debit: 300000,  credit: 0 },
      { accountCode: "1002", accountName: "Bank – Mitsubishi UFJ", debit: 0,       credit: 300000 },
    ],
  },
];

// ─── 4.4 Cash & Bank Accounts ────────────────────────────────────────────────

export const MOCK_CASH_BANK_ACCOUNTS: CashBankAccount[] = [
  {
    id: "ACC-001",
    name: "Main Cash",
    kind: "cash",
    currency: "JPY",
    openingBalance: 500000,
    balance: 850000,
    entries: [
      { id: "cb1", date: "2025-03-01", description: "Opening Balance",         debit: 0,      credit: 0,      balance: 500000, reference: "" },
      { id: "cb2", date: "2025-03-20", description: "Cash Sales – Parts",      debit: 150000, credit: 0,      balance: 650000, reference: "REC-CASH-01" },
      { id: "cb3", date: "2025-04-01", description: "Office Supplies",         debit: 0,      credit: 15000,  balance: 635000, reference: "" },
      { id: "cb4", date: "2025-04-10", description: "Cash Received from Sale", debit: 300000, credit: 0,      balance: 935000, reference: "REC-003" },
      { id: "cb5", date: "2025-04-30", description: "Utility Bills",           debit: 0,      credit: 45000,  balance: 890000, reference: "" },
      { id: "cb6", date: "2025-05-05", description: "Petty Cash Expense",      debit: 0,      credit: 40000,  balance: 850000, reference: "" },
    ],
  },
  {
    id: "ACC-002",
    name: "Mitsubishi UFJ – JPY",
    kind: "bank",
    currency: "JPY",
    openingBalance: 2000000,
    balance: 3450000,
    entries: [
      { id: "cb7",  date: "2025-03-01", description: "Opening Balance",                    debit: 0,       credit: 0,       balance: 2000000, reference: "" },
      { id: "cb8",  date: "2025-03-28", description: "Payment to Tanaka Auto Auctions",    debit: 0,       credit: 1000000, balance: 1000000, reference: "PAY-001" },
      { id: "cb9",  date: "2025-04-22", description: "Payment to Tanaka Auto Auctions",    debit: 0,       credit: 1800000, balance: -800000, reference: "PAY-002" },
      { id: "cb10", date: "2025-04-24", description: "Receipt – Toyota LC200 Sale",        debit: 4700000, credit: 0,       balance: 3900000, reference: "REC-001" },
      { id: "cb11", date: "2025-05-01", description: "Salary Payment",                     debit: 0,       credit: 300000,  balance: 3600000, reference: "PAY-SAL-05" },
      { id: "cb12", date: "2025-05-09", description: "Partial Receipt – Malik Traders",   debit: 150000,  credit: 0,       balance: 3750000, reference: "REC-002" },
      { id: "cb13", date: "2025-05-12", description: "Rent Payment",                       debit: 0,       credit: 180000,  balance: 3570000, reference: "" },
      { id: "cb14", date: "2025-05-14", description: "Payment – Yamamoto Machinery",       debit: 0,       credit: 120000,  balance: 3450000, reference: "PAY-004" },
    ],
  },
  {
    id: "ACC-003",
    name: "Sumitomo – USD",
    kind: "bank",
    currency: "USD",
    openingBalance: 10000,
    balance: 22500,
    entries: [
      { id: "cb15", date: "2025-03-01", description: "Opening Balance",                    debit: 0,      credit: 0,      balance: 10000, reference: "" },
      { id: "cb16", date: "2025-04-15", description: "Export Sale Receipt",                debit: 15000,  credit: 0,      balance: 25000, reference: "INV-EXP-01" },
      { id: "cb17", date: "2025-05-02", description: "International Wire Fee",             debit: 0,      credit: 2500,   balance: 22500, reference: "" },
    ],
  },
];