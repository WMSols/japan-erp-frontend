import type { SaleItem, SalesStats } from "@/types/types";

// ─── Formatting ────────────────────────────────────────────────────────────

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Derived fields ────────────────────────────────────────────────────────

export function computeNetRevenue(
  sellingPrice: number,
  commission: number,
  discount: number
): number {
  return sellingPrice - commission - discount;
}

export function computeProfit(netRevenue: number, totalCost: number): number {
  return netRevenue - totalCost;
}

export function computeAmountDue(netRevenue: number, amountPaid: number): number {
  return Math.max(0, netRevenue - amountPaid);
}

export function derivePaymentStatus(
  netRevenue: number,
  amountPaid: number
): SaleItem["paymentStatus"] {
  if (amountPaid <= 0) return "unpaid";
  if (amountPaid >= netRevenue) return "paid";
  return "partial";
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export function computeSalesStats(sales: SaleItem[]): SalesStats {
  const completed = sales.filter((s) => s.status !== "cancelled");
  const totalRevenue = completed.reduce((s, i) => s + i.netRevenue, 0);
  const totalProfit = completed.reduce((s, i) => s + i.profit, 0);
  const outstanding = completed.reduce((s, i) => s + i.amountDue, 0);
  const avgProfit = completed.length > 0 ? Math.round(totalProfit / completed.length) : 0;

  return {
    totalSales: completed.length,
    totalRevenue,
    totalProfit,
    outstanding,
    avgProfit,
  };
}

// ─── Status config ─────────────────────────────────────────────────────────

export const SALE_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
  },
  completed: {
    label: "Completed",
    className: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-50 text-gray-400 border-gray-200",
    dot: "bg-gray-300",
  },
} as const;

export const PAYMENT_STATUS_CONFIG = {
  unpaid: {
    label: "Unpaid",
    className: "bg-red-50 text-red-600 border-red-200",
  },
  partial: {
    label: "Partial",
    className: "bg-orange-50 text-orange-600 border-orange-200",
  },
  paid: {
    label: "Paid",
    className: "bg-green-50 text-green-700 border-green-200",
  },
} as const;

export const CHANNEL_CONFIG = {
  auction: {
    label: "Auction",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  direct: {
    label: "Direct",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
} as const;

// ─── Invoice number generator ──────────────────────────────────────────────

export function generateInvoiceNumber(existing: string[]): string {
  const nums = existing
    .map((n) => parseInt(n.replace(/\D/g, "").slice(-3)))
    .filter(Boolean);
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `INV-${new Date().getFullYear()}-${String(next).padStart(3, "0")}`;
}