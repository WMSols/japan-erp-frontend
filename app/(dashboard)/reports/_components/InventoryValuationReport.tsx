"use client";

import type { InventoryValuationRow } from "@/types/reports";
import { formatYen } from "../_utils/reportsUtils";
import { AlertTriangle } from "lucide-react";

interface Props {
  rows: InventoryValuationRow[];
}

export default function InventoryValuationReport({ rows }: Props) {
  return (
    <div className="space-y-4">
      {/* Stale stock warning */}
      {rows.some((r) => r.daysInStock > 180) && (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
          <p className="text-xs text-yellow-800">
            <strong>{rows.filter((r) => r.daysInStock > 180).length} vehicle(s)</strong> have been in stock for over 180 days. Consider reviewing pricing or export options.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Inventory Valuation Report</h2>
          <span className="text-xs text-gray-500">{rows.length} units in stock</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Days in Stock</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fees & Costs</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Workshop</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Value</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Unrealised Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row) => {
                const gainPct = row.totalCost > 0 ? ((row.unrealisedGain / row.totalCost) * 100).toFixed(1) : "0.0";
                const stale = row.daysInStock > 180;
                return (
                  <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${stale ? "bg-yellow-50/30" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {stale && <AlertTriangle className="w-3 h-3 text-yellow-500 shrink-0" />}
                        <div>
                          <div className="font-medium text-gray-900">{row.year} {row.make} {row.model}</div>
                          <div className="text-xs text-gray-400 font-mono">{row.vin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs font-medium ${stale ? "text-yellow-700" : "text-gray-600"}`}>
                        {row.daysInStock}d
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{formatYen(row.purchasePrice)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">
                      {formatYen(row.auctionFees + row.transportCost + row.importDuties)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{formatYen(row.workshopCost)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-gray-900">{formatYen(row.totalCost)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-blue-700">{formatYen(row.estimatedValue)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      <span className={row.unrealisedGain >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {row.unrealisedGain >= 0 ? "+" : ""}{formatYen(row.unrealisedGain)}
                      </span>
                      <div className="text-gray-400 text-[10px]">{gainPct}%</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-gray-200">
              <tr className="bg-gray-50">
                <td className="px-5 py-3 font-bold text-gray-900" colSpan={5}>TOTAL</td>
                <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{formatYen(rows.reduce((s, r) => s + r.totalCost, 0))}</td>
                <td className="px-4 py-3 text-right font-mono text-xs font-bold text-blue-700">{formatYen(rows.reduce((s, r) => s + r.estimatedValue, 0))}</td>
                <td className="px-4 py-3 text-right font-mono text-xs font-bold text-green-700">+{formatYen(rows.reduce((s, r) => s + r.unrealisedGain, 0))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
