// ─── Reports & Analytics — Type Definitions ───────────────────────────────

export type ReportTab =
  | "profit_per_vehicle"
  | "pnl"
  | "supplier_outstanding"
  | "customer_receivable"
  | "inventory_valuation";

export type PnLPeriod = "monthly" | "yearly";

// ── Profit Per Vehicle ─────────────────────────────────────────────────────
export interface VehicleProfitRow {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  purchaseDate: string;
  saleDate: string | null;
  purchasePrice: number;
  auctionFees: number;
  transportCost: number;
  importDuties: number;
  workshopCost: number;
  salePrice: number | null;
  channel: "auction" | "direct" | "export" | null;
  status: "in_stock" | "sold";
}

export interface VehicleProfitSummary {
  totalVehicles: number;
  soldVehicles: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  avgProfitPerVehicle: number;
}

// ── P&L ───────────────────────────────────────────────────────────────────
export interface PnLMonthRow {
  period: string; // "2024-01" or "2024"
  label: string;  // "Jan 2024" or "2024"
  revenue: number;
  cogs: number;
  workshopRevenue: number;
  workshopCost: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  vehiclesSold: number;
}

// ── Supplier Outstanding ───────────────────────────────────────────────────
export interface SupplierOutstandingRow {
  id: string;
  supplierName: string;
  supplierType: "auction_house" | "dealer" | "transporter" | "other";
  current: number;      // 0–30 days
  days30: number;       // 31–60
  days60: number;       // 61–90
  days90plus: number;   // 90+
  totalOutstanding: number;
  creditLimit: number;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
}

// ── Customer Receivable ───────────────────────────────────────────────────
export interface CustomerReceivableRow {
  id: string;
  customerName: string;
  country: string;
  current: number;
  days30: number;
  days60: number;
  days90plus: number;
  totalReceivable: number;
  lastPaymentDate: string | null;
  lastPaymentAmount: number | null;
}

// ── Inventory Valuation ───────────────────────────────────────────────────
export interface InventoryValuationRow {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  purchaseDate: string;
  daysInStock: number;
  purchasePrice: number;
  auctionFees: number;
  transportCost: number;
  importDuties: number;
  workshopCost: number;
  totalCost: number;
  estimatedValue: number;
  unrealisedGain: number;
}

export interface InventoryValuationSummary {
  totalUnits: number;
  totalCost: number;
  totalEstimatedValue: number;
  totalUnrealisedGain: number;
}
