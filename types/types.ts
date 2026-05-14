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