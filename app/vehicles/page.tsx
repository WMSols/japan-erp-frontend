"use client";

import { useState } from "react";
import type { VehiclePurchase } from "@/types/types";
import VehiclePurchaseForm from "./components/VehiclepurchaseForm";
import VehiclePurchaseList from "./components/VehiclepurchaseList";

// ── Dummy seed data ────────────────────────────────────────────────────────
const DUMMY_PURCHASES: VehiclePurchase[] = [
  {
    id: "d1",
    vehicleId: "JN1AAAZ32Z0000001",
    supplierName: "Yamamoto Auto Auctions",
    purchasePrice: 1_850_000,
    auctionFee: 55_000,
    warehouse: "Yard A — Tokyo",
    imagePreview: null,
    status: "Ready",
    addedAt: "2025-03-10T08:30:00Z",
  },
  {
    id: "d2",
    vehicleId: "JTDKB20U693354289",
    supplierName: "Tokyo Motor Exchange",
    purchasePrice: 2_400_000,
    auctionFee: 72_000,
    warehouse: "Yard B — Osaka",
    imagePreview: null,
    status: "In Repair",
    addedAt: "2025-03-18T11:15:00Z",
  },
  {
    id: "d3",
    vehicleId: "JHMCB7560SC000032",
    supplierName: "Nagoya JU Dealer Co.",
    purchasePrice: 980_000,
    auctionFee: 30_000,
    warehouse: "Workshop Bay — Nagoya",
    imagePreview: null,
    status: "Purchased",
    addedAt: "2025-04-01T09:00:00Z",
  },
  {
    id: "d4",
    vehicleId: "VNKKTUD33FA049421",
    supplierName: "Osaka USS Auctions",
    purchasePrice: 3_200_000,
    auctionFee: 95_000,
    warehouse: "Yard A — Tokyo",
    imagePreview: null,
    status: "Sold",
    addedAt: "2025-02-20T14:45:00Z",
  },
  {
    id: "d5",
    vehicleId: "KMHD341BPEU000189",
    supplierName: "Kobe Direct Imports",
    purchasePrice: 1_550_000,
    auctionFee: 48_000,
    warehouse: "Warehouse 1 — Fukuoka",
    imagePreview: null,
    status: "Ready",
    addedAt: "2025-04-10T07:20:00Z",
  },
];

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${accent ?? "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function VehiclesPage() {
  const [purchases, setPurchases] = useState<VehiclePurchase[]>(DUMMY_PURCHASES);

  const handleAdd = (
    data: Omit<VehiclePurchase, "id" | "addedAt" | "status">
  ) => {
    const newPurchase: VehiclePurchase = {
      ...data,
      id: `p_${Date.now()}`,
      status: "Purchased",
      addedAt: new Date().toISOString(),
    };
    setPurchases((prev) => [newPurchase, ...prev]);
  };

  const handleDelete = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Derived stats ──────────────────────────────────────────────────────
  const totalValue = purchases.reduce(
    (acc, p) => acc + p.purchasePrice + p.auctionFee,
    0
  );
  const inRepair = purchases.filter((p) => p.status === "In Repair").length;
  const ready = purchases.filter((p) => p.status === "Ready").length;
  const sold = purchases.filter((p) => p.status === "Sold").length;

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Vehicles
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Purchase & inventory management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {purchases.length} units tracked
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── Stats row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Fleet Value"
            value={`¥${(totalValue / 1_000_000).toFixed(1)}M`}
            sub={`${purchases.length} vehicles`}
          />
          <StatCard
            label="In Repair"
            value={String(inRepair)}
            sub="awaiting workshop"
            accent="text-amber-500"
          />
          <StatCard
            label="Ready"
            value={String(ready)}
            sub="available for sale"
            accent="text-emerald-500"
          />
          <StatCard
            label="Sold"
            value={String(sold)}
            sub="this cycle"
            accent="text-gray-400"
          />
        </div>

        {/* ── Purchase form ───────────────────────────────────────────── */}
        <VehiclePurchaseForm onAdd={handleAdd} />

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">
            Purchase History
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* ── Purchase list ───────────────────────────────────────────── */}
        <VehiclePurchaseList purchases={purchases} onDelete={handleDelete} />
      </main>
    </div>
  );
}