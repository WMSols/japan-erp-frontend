"use client";

import React, { useState } from "react";
import type { VehicleProfitRow } from "@/types/reports";
import {
  formatYen,
  getTotalCost,
  getProfit,
  getMargin,
  CHANNEL_CONFIG,
} from "../_utils/reportsUtils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  rows: VehicleProfitRow[];
}

export default function ProfitPerVehicleTable({ rows }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"profit" | "margin" | "saleDate">("saleDate");
  const [showInStock, setShowInStock] = useState(true);

  const filtered = rows.filter((r) => showInStock || r.status === "sold");

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === "profit") {
      return (getProfit(b) ?? -Infinity) - (getProfit(a) ?? -Infinity);
    }
    if (sortField === "margin") {
      return (getMargin(b) ?? -Infinity) - (getMargin(a) ?? -Infinity);
    }
    // saleDate
    return (b.saleDate ?? "").localeCompare(a.saleDate ?? "");
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Profit per Vehicle</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showInStock}
              onChange={(e) => setShowInStock(e.target.checked)}
              className="rounded"
            />
            Include in-stock
          </label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as typeof sortField)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none"
          >
            <option value="saleDate">Sort: Sale Date</option>
            <option value="profit">Sort: Profit ↓</option>
            <option value="margin">Sort: Margin ↓</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Price</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((row) => {
              const cost = getTotalCost(row);
              const profit = getProfit(row);
              const margin = getMargin(row);
              const expanded = expandedId === row.id;

              return (
                <React.Fragment key={row.id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setExpandedId(expanded ? null : row.id)}
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{row.year} {row.make} {row.model}</div>
                      <div className="text-xs text-gray-400 font-mono">{row.vin}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="text-xs">Bought: {row.purchaseDate}</div>
                      <div className="text-xs">{row.saleDate ? `Sold: ${row.saleDate}` : <span className="text-yellow-600">In Stock</span>}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-mono text-xs">{formatYen(cost)}</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-mono text-xs">
                      {row.salePrice ? formatYen(row.salePrice) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {profit !== null ? (
                        <span className={profit >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {profit >= 0 ? "+" : ""}{formatYen(profit)}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      {margin !== null ? (
                        <span className={margin >= 0 ? "text-green-600" : "text-red-600"}>
                          {margin.toFixed(1)}%
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {row.channel ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${CHANNEL_CONFIG[row.channel].className}`}>
                          {CHANNEL_CONFIG[row.channel].label}
                        </span>
                      ) : <span className="text-gray-400 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </td>
                  </tr>

                  {expanded && (
                    <tr key={`${row.id}-expanded`} className="bg-gray-50">
                      <td colSpan={8} className="px-5 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                          {[
                            { label: "Purchase Price", value: row.purchasePrice },
                            { label: "Auction Fees", value: row.auctionFees },
                            { label: "Transport", value: row.transportCost },
                            { label: "Import Duties", value: row.importDuties },
                            { label: "Workshop Cost", value: row.workshopCost },
                          ].map(({ label, value }) => (
                            <div key={label} className="bg-white rounded-lg p-3 border border-gray-100">
                              <div className="text-gray-500 mb-1">{label}</div>
                              <div className="font-semibold text-gray-900 font-mono">{formatYen(value)}</div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
