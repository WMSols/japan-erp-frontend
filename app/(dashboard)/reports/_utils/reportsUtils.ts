import type {
  VehicleProfitRow,
  VehicleProfitSummary,
  PnLMonthRow,
  InventoryValuationRow,
  InventoryValuationSummary,
} from "../types/reports";

// ── Currency ───────────────────────────────────────────────────────────────
export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export function formatYenCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `¥${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `¥${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `¥${(amount / 1_000).toFixed(0)}K`;
  }
  return formatYen(amount);
}

// ── Vehicle Profit Derivations ─────────────────────────────────────────────
export function getTotalCost(row: VehicleProfitRow): number {
  return (
    row.purchasePrice +
    row.auctionFees +
    row.transportCost +
    row.importDuties +
    row.workshopCost
  );
}

export function getProfit(row: VehicleProfitRow): number | null {
  if (row.salePrice === null) return null;
  return row.salePrice - getTotalCost(row);
}

export function getMargin(row: VehicleProfitRow): number | null {
  if (row.salePrice === null || row.salePrice === 0) return null;
  const profit = getProfit(row);
  if (profit === null) return null;
  return (profit / row.salePrice) * 100;
}

export function getVehicleProfitSummary(
  rows: VehicleProfitRow[]
): VehicleProfitSummary {
  const sold = rows.filter((r) => r.status === "sold");
  const totalRevenue = sold.reduce((s, r) => s + (r.salePrice ?? 0), 0);
  const totalCost = sold.reduce((s, r) => s + getTotalCost(r), 0);
  const totalProfit = totalRevenue - totalCost;

  return {
    totalVehicles: rows.length,
    soldVehicles: sold.length,
    totalRevenue,
    totalCost,
    totalProfit,
    avgProfitPerVehicle: sold.length > 0 ? totalProfit / sold.length : 0,
  };
}

// ── P&L Derivations ────────────────────────────────────────────────────────
export function getPnLSummary(rows: PnLMonthRow[]) {
  return rows.reduce(
    (acc, r) => ({
      totalRevenue: acc.totalRevenue + r.revenue + r.workshopRevenue,
      totalGrossProfit: acc.totalGrossProfit + r.grossProfit,
      totalNetProfit: acc.totalNetProfit + r.netProfit,
      totalVehiclesSold: acc.totalVehiclesSold + r.vehiclesSold,
    }),
    {
      totalRevenue: 0,
      totalGrossProfit: 0,
      totalNetProfit: 0,
      totalVehiclesSold: 0,
    }
  );
}

// ── Inventory Valuation ────────────────────────────────────────────────────
export function getInventoryValuationSummary(
  rows: InventoryValuationRow[]
): InventoryValuationSummary {
  return rows.reduce(
    (acc, r) => ({
      totalUnits: acc.totalUnits + 1,
      totalCost: acc.totalCost + r.totalCost,
      totalEstimatedValue: acc.totalEstimatedValue + r.estimatedValue,
      totalUnrealisedGain: acc.totalUnrealisedGain + r.unrealisedGain,
    }),
    { totalUnits: 0, totalCost: 0, totalEstimatedValue: 0, totalUnrealisedGain: 0 }
  );
}

// ── Ageing helpers ─────────────────────────────────────────────────────────
export function getAgeingRisk(
  days90plus: number,
  total: number
): "low" | "medium" | "high" {
  if (total === 0) return "low";
  const ratio = days90plus / total;
  if (ratio > 0.4) return "high";
  if (ratio > 0.1) return "medium";
  return "low";
}

export const AGEING_RISK_CONFIG = {
  low: { label: "Low Risk", className: "bg-green-50 text-green-700 border-green-200" },
  medium: { label: "Medium Risk", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  high: { label: "High Risk", className: "bg-red-50 text-red-700 border-red-200" },
} as const;

// ── Channel badge config ──────────────────────────────────────────────────
export const CHANNEL_CONFIG = {
  auction: { label: "Auction", className: "bg-purple-50 text-purple-700 border-purple-200" },
  direct: { label: "Direct", className: "bg-blue-50 text-blue-700 border-blue-200" },
  export: { label: "Export", className: "bg-orange-50 text-orange-700 border-orange-200" },
} as const;

// ── Supplier type config ──────────────────────────────────────────────────
export const SUPPLIER_TYPE_CONFIG = {
  auction_house: { label: "Auction House" },
  dealer: { label: "Dealer" },
  transporter: { label: "Transporter" },
  other: { label: "Other" },
} as const;
