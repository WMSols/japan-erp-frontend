"use client";

import { useState } from "react";
import Link from "next/link";
import type { VehiclePurchase } from "@/types/types";

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_STYLES: Record<VehiclePurchase["status"], string> = {
  Draft:      "bg-gray-50 text-gray-500 border-gray-200",
  Purchased:  "bg-blue-50 text-blue-600 border-blue-100",
  "In Repair":"bg-amber-50 text-amber-600 border-amber-100",
  Ready:      "bg-emerald-50 text-emerald-600 border-emerald-100",
  Sold:       "bg-gray-100 text-gray-500 border-gray-200",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatYen(n: number) {
  return "¥" + n.toLocaleString();
}

// ── Car silhouette placeholder ─────────────────────────────────────────────
function CarPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200">
        <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
        <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
      </svg>
    </div>
  );
}

// ── Row component ──────────────────────────────────────────────────────────
function PurchaseRow({
  purchase,
  onDelete,
}: {
  purchase: VehiclePurchase;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const totalCost = purchase.purchasePrice + purchase.auctionFee;

  return (
    <tr className=" border-b border-gray-50 hover:bg-gray-50/60 transition-colors duration-100">
      {/* Thumbnail */}
      <td className="py-3 pl-5 pr-3 w-16">
        <div className="w-12 h-9 rounded-md overflow-hidden border border-gray-100 flex-shrink-0">
          {purchase.imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={purchase.imagePreview} alt={purchase.vehicleId} className="w-full h-full object-cover" />
          ) : (
            <CarPlaceholder />
          )}
        </div>
      </td>

      {/* Vehicle ID */}
      <td className="py-3 px-3">
        <p className="text-sm font-semibold text-gray-900 font-mono tracking-tight">{purchase.vehicleId}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(purchase.addedAt)}</p>
      </td>

      {/* Supplier */}
      <td className="py-3 px-3 hidden sm:table-cell">
        <p className="text-sm text-gray-600 leading-tight">{purchase.supplierName}</p>
      </td>

      {/* Warehouse */}
      <td className="py-3 px-3 hidden md:table-cell">
        <p className="text-xs text-gray-500 leading-tight">{purchase.warehouse}</p>
      </td>

      {/* Purchase Price */}
      <td className="py-3 px-3 hidden lg:table-cell">
        <p className="text-sm text-gray-700 tabular-nums">{formatYen(purchase.purchasePrice)}</p>
        {purchase.auctionFee > 0 && (
          <p className="text-[11px] text-gray-400 mt-0.5">+{formatYen(purchase.auctionFee)} fee</p>
        )}
      </td>

      {/* Total Cost */}
      <td className="py-3 px-3">
        <p className="text-sm font-semibold text-gray-900 tabular-nums">{formatYen(totalCost)}</p>
      </td>

      {/* Status */}
      <td className="py-3 px-3">
        <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md border ${STATUS_STYLES[purchase.status]}`}>
          {purchase.status}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 pl-3 pr-5">
        <div className="flex items-center justify-end gap-2">
          {/* Open button — always visible */}
          <Link
            href={`/vehicles/${purchase.id}`}
            className=" flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-150"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Open
          </Link>

          {/* Delete */}
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDelete(purchase.id)}
                className="text-[11px] font-medium text-red-500 hover:text-red-700"
              >
                Confirm
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-[11px] text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className=" p-1.5 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150"
              title="Remove"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <tr>
      <td colSpan={8} className="py-16 text-center">
        <div className="inline-flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
              <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
              <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No purchases yet</p>
          <p className="text-xs text-gray-300">Add your first vehicle above to get started</p>
        </div>
      </td>
    </tr>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
interface Props {
  purchases: VehiclePurchase[];
  onDelete: (id: string) => void;
}

type SortKey = "addedAt" | "totalCost" | "vehicleId";

export default function VehiclePurchaseList({ purchases, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("addedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const totalValue = purchases.reduce((acc, p) => acc + p.purchasePrice + p.auctionFee, 0);

  const filtered = purchases
    .filter((p) =>
      [p.vehicleId, p.supplierName, p.warehouse].some((v) =>
        v.toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortKey === "totalCost") { av = a.purchasePrice + a.auctionFee; bv = b.purchasePrice + b.auctionFee; }
      else if (sortKey === "vehicleId") { av = a.vehicleId; bv = b.vehicleId; }
      else { av = a.addedAt; bv = b.addedAt; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="ml-1 inline-flex">
      {sortKey === col ? (
        sortDir === "asc" ? "↑" : "↓"
      ) : (
        <span className="text-gray-200">↕</span>
      )}
    </span>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Purchase List</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {purchases.length} {purchases.length === 1 ? "vehicle" : "vehicles"} &mdash; Total{" "}
              <span className="font-medium text-gray-600">{formatYen(totalValue)}</span>
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicles…"
            className="w-full h-9 pl-8 pr-3 text-sm rounded-lg border border-gray-200 bg-gray-50 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:bg-white focus:border-gray-300 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="py-2.5 pl-5 pr-3 w-16" />
              <th className="py-2.5 px-3 text-left">
                <button
                  onClick={() => toggleSort("vehicleId")}
                  className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Vehicle ID <SortIcon col="vehicleId" />
                </button>
              </th>
              <th className="py-2.5 px-3 text-left hidden sm:table-cell">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Supplier</span>
              </th>
              <th className="py-2.5 px-3 text-left hidden md:table-cell">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Warehouse</span>
              </th>
              <th className="py-2.5 px-3 text-left hidden lg:table-cell">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Purchase</span>
              </th>
              <th className="py-2.5 px-3 text-left">
                <button
                  onClick={() => toggleSort("totalCost")}
                  className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Total <SortIcon col="totalCost" />
                </button>
              </th>
              <th className="py-2.5 px-3 text-left">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Status</span>
              </th>
              <th className="py-2.5 pl-3 pr-5" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map((p) => (
                <PurchaseRow key={p.id} purchase={p} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
          <p className="text-[11px] text-gray-300">
            Showing {filtered.length} of {purchases.length}
          </p>
          <div className="flex items-center gap-2">
            {(["Draft", "Purchased", "In Repair", "Ready", "Sold"] as VehiclePurchase["status"][]).map((s) => {
              const count = purchases.filter((p) => p.status === s).length;
              if (count === 0) return null;
              return (
                <span key={s} className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${STATUS_STYLES[s]}`}>
                  {count} {s}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}