"use client";

import type { ReportTab } from "@/types/reports";
import type { VehicleProfitSummary, PnLMonthRow, InventoryValuationSummary } from "@/types/reports";
import type { SupplierOutstandingRow, CustomerReceivableRow } from "@/types/reports";
import { formatYen } from "../_utils/reportsUtils";
import { TrendingUp, TrendingDown, Car, DollarSign, Package, Users, Building2, BarChart3 } from "lucide-react";

interface Props {
  activeTab: ReportTab;
  vehicleSummary?: VehicleProfitSummary;
  pnlRows?: PnLMonthRow[];
  supplierRows?: SupplierOutstandingRow[];
  customerRows?: CustomerReceivableRow[];
  inventorySummary?: InventoryValuationSummary;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  positive?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</p>
        {sub && (
          <p className={`text-xs mt-1 ${positive === undefined ? "text-gray-500" : positive ? "text-green-600" : "text-red-600"}`}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ReportsStatsCards({
  activeTab,
  vehicleSummary,
  pnlRows,
  supplierRows,
  customerRows,
  inventorySummary,
}: Props) {
  if (activeTab === "profit_per_vehicle" && vehicleSummary) {
    const margin =
      vehicleSummary.totalRevenue > 0
        ? ((vehicleSummary.totalProfit / vehicleSummary.totalRevenue) * 100).toFixed(1)
        : "0.0";
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Vehicles Sold" value={`${vehicleSummary.soldVehicles} / ${vehicleSummary.totalVehicles}`} sub="sold vs total" icon={Car} />
        <StatCard label="Total Revenue" value={formatYen(vehicleSummary.totalRevenue)} sub="from sold vehicles" icon={DollarSign} />
        <StatCard label="Total Profit" value={formatYen(vehicleSummary.totalProfit)} sub={`${margin}% margin`} icon={TrendingUp} positive={vehicleSummary.totalProfit >= 0} />
        <StatCard label="Avg Profit / Vehicle" value={formatYen(Math.round(vehicleSummary.avgProfitPerVehicle))} sub="per vehicle sold" icon={BarChart3} positive />
      </div>
    );
  }

  if (activeTab === "pnl" && pnlRows) {
    const totalRev = pnlRows.reduce((s, r) => s + r.revenue + r.workshopRevenue, 0);
    const totalNet = pnlRows.reduce((s, r) => s + r.netProfit, 0);
    const totalGross = pnlRows.reduce((s, r) => s + r.grossProfit, 0);
    const vehicles = pnlRows.reduce((s, r) => s + r.vehiclesSold, 0);
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={formatYen(totalRev)} icon={DollarSign} />
        <StatCard label="Gross Profit" value={formatYen(totalGross)} sub={`${((totalGross / totalRev) * 100).toFixed(1)}% margin`} icon={TrendingUp} positive={totalGross >= 0} />
        <StatCard label="Net Profit" value={formatYen(totalNet)} sub={totalNet >= 0 ? "Profitable period" : "Loss period"} icon={totalNet >= 0 ? TrendingUp : TrendingDown} positive={totalNet >= 0} />
        <StatCard label="Vehicles Sold" value={`${vehicles}`} sub="units" icon={Car} />
      </div>
    );
  }

  if (activeTab === "supplier_outstanding" && supplierRows) {
    const total = supplierRows.reduce((s, r) => s + r.totalOutstanding, 0);
    const overdue = supplierRows.reduce((s, r) => s + r.days60 + r.days90plus, 0);
    const count = supplierRows.length;
    const overdueCount = supplierRows.filter((r) => r.days90plus > 0).length;
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Payable" value={formatYen(total)} sub={`across ${count} suppliers`} icon={Building2} />
        <StatCard label="Overdue (60+ days)" value={formatYen(overdue)} sub={`${overdueCount} suppliers overdue`} icon={TrendingDown} positive={overdue === 0} />
        <StatCard label="Active Suppliers" value={`${count}`} sub="with open balances" icon={Users} />
        <StatCard label="Critical Overdue (90+)" value={formatYen(supplierRows.reduce((s, r) => s + r.days90plus, 0))} sub="requires immediate action" icon={TrendingDown} positive={false} />
      </div>
    );
  }

  if (activeTab === "customer_receivable" && customerRows) {
    const total = customerRows.reduce((s, r) => s + r.totalReceivable, 0);
    const overdue = customerRows.reduce((s, r) => s + r.days60 + r.days90plus, 0);
    const count = customerRows.length;
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Receivable" value={formatYen(total)} sub={`from ${count} customers`} icon={Users} />
        <StatCard label="Current (0-30 days)" value={formatYen(customerRows.reduce((s, r) => s + r.current + r.days30, 0))} sub="on-time collections" icon={TrendingUp} positive />
        <StatCard label="Overdue (60+ days)" value={formatYen(overdue)} sub="requires follow-up" icon={TrendingDown} positive={overdue === 0} />
        <StatCard label="Active Customers" value={`${count}`} sub="with open balances" icon={Building2} />
      </div>
    );
  }

  if (activeTab === "inventory_valuation" && inventorySummary) {
    const gainPct =
      inventorySummary.totalCost > 0
        ? ((inventorySummary.totalUnrealisedGain / inventorySummary.totalCost) * 100).toFixed(1)
        : "0.0";
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Units in Stock" value={`${inventorySummary.totalUnits}`} sub="vehicles" icon={Car} />
        <StatCard label="Total Cost Basis" value={formatYen(inventorySummary.totalCost)} sub="landed cost" icon={DollarSign} />
        <StatCard label="Estimated Value" value={formatYen(inventorySummary.totalEstimatedValue)} sub="market value" icon={BarChart3} />
        <StatCard label="Unrealised Gain" value={formatYen(inventorySummary.totalUnrealisedGain)} sub={`+${gainPct}% on cost`} icon={TrendingUp} positive />
      </div>
    );
  }

  return null;
}
