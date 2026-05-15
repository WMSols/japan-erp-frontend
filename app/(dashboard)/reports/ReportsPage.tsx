"use client";

import { useState } from "react";
import type { ReportTab } from "@/types/reports";
import { VEHICLE_PROFIT_DATA, PNL_MONTHLY_DATA, PNL_YEARLY_DATA, SUPPLIER_OUTSTANDING_DATA, CUSTOMER_RECEIVABLE_DATA, INVENTORY_VALUATION_DATA } from "@/data/reportsData";
import { getVehicleProfitSummary, getInventoryValuationSummary } from "./_utils/reportsUtils";
import ReportsStatsCards from "./_components/ReportsStatsCards";
import ProfitPerVehicleTable from "./_components/ProfitPerVehicleTable";
import PnLReport from "./_components/PnLReport";
import SupplierOutstandingReport from "./_components/SupplierOutstandingReport";
import CustomerReceivableReport from "./_components/CustomerReceivableReport";
import InventoryValuationReport from "./_components/InventoryValuationReport";
import { BarChart3, TrendingUp, Building2, Users, Package } from "lucide-react";

const TABS: { id: ReportTab; label: string; icon: React.ElementType }[] = [
  { id: "profit_per_vehicle", label: "Profit per Vehicle", icon: TrendingUp },
  { id: "pnl", label: "P&L", icon: BarChart3 },
  { id: "supplier_outstanding", label: "Supplier Outstanding", icon: Building2 },
  { id: "customer_receivable", label: "Customer Receivable", icon: Users },
  { id: "inventory_valuation", label: "Inventory Valuation", icon: Package },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("profit_per_vehicle");

  const vehicleSummary = getVehicleProfitSummary(VEHICLE_PROFIT_DATA);
  const inventorySummary = getInventoryValuationSummary(INVENTORY_VALUATION_DATA);

  return (
    <div className="flex-1 min-w-0 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Financial performance, ageing, and inventory insights</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <ReportsStatsCards
        activeTab={activeTab}
        vehicleSummary={vehicleSummary}
        pnlRows={PNL_MONTHLY_DATA}
        supplierRows={SUPPLIER_OUTSTANDING_DATA}
        customerRows={CUSTOMER_RECEIVABLE_DATA}
        inventorySummary={inventorySummary}
      />

      {/* Report content */}
      {activeTab === "profit_per_vehicle" && (
        <ProfitPerVehicleTable rows={VEHICLE_PROFIT_DATA} />
      )}
      {activeTab === "pnl" && (
        <PnLReport monthlyRows={PNL_MONTHLY_DATA} yearlyRows={PNL_YEARLY_DATA} />
      )}
      {activeTab === "supplier_outstanding" && (
        <SupplierOutstandingReport rows={SUPPLIER_OUTSTANDING_DATA} />
      )}
      {activeTab === "customer_receivable" && (
        <CustomerReceivableReport rows={CUSTOMER_RECEIVABLE_DATA} />
      )}
      {activeTab === "inventory_valuation" && (
        <InventoryValuationReport rows={INVENTORY_VALUATION_DATA} />
      )}
    </div>
  );
}
