"use client";

import { useState } from "react";
import type { PnLMonthRow, PnLPeriod } from "@/types/reports";
import { formatYen, formatYenCompact } from "../_utils/reportsUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

interface Props {
  monthlyRows: PnLMonthRow[];
  yearlyRows: PnLMonthRow[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-900">{formatYenCompact(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PnLReport({ monthlyRows, yearlyRows }: Props) {
  const [period, setPeriod] = useState<PnLPeriod>("monthly");
  const rows = period === "monthly" ? monthlyRows : yearlyRows;

  const chartData = rows.map((r) => ({
    name: r.label,
    Revenue: r.revenue + r.workshopRevenue,
    "Gross Profit": r.grossProfit,
    "Net Profit": r.netProfit,
  }));

  return (
    <div className="space-y-5">
      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-900">P&L Overview</h2>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(["monthly", "yearly"] as PnLPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p === "monthly" ? "Monthly" : "Yearly"}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatYenCompact(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
            <ReferenceLine y={0} stroke="#e5e7eb" />
            <Bar dataKey="Revenue" fill="#e5e7eb" radius={[3, 3, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Gross Profit" fill="#6b7280" radius={[3, 3, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Net Profit" fill="#111827" radius={[3, 3, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Detailed P&L Statement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Rev.</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Workshop Rev.</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">COGS</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Profit</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">OpEx</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row) => (
                <tr key={row.period} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{row.label}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{formatYen(row.revenue)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">{formatYen(row.workshopRevenue)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">({formatYen(row.cogs + row.workshopCost)})</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">
                    <span className={row.grossProfit >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {formatYen(row.grossProfit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">({formatYen(row.operatingExpenses)})</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">
                    <span className={row.netProfit >= 0 ? "text-green-700 font-bold" : "text-red-600 font-bold"}>
                      {row.netProfit >= 0 ? "+" : ""}{formatYen(row.netProfit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{row.vehiclesSold}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-200">
              <tr className="bg-gray-50">
                <td className="px-5 py-3 font-bold text-gray-900">TOTAL</td>
                <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{formatYen(rows.reduce((s, r) => s + r.revenue, 0))}</td>
                <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{formatYen(rows.reduce((s, r) => s + r.workshopRevenue, 0))}</td>
                <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">({formatYen(rows.reduce((s, r) => s + r.cogs + r.workshopCost, 0))})</td>
                <td className="px-4 py-3 text-right font-mono text-xs font-bold text-green-700">{formatYen(rows.reduce((s, r) => s + r.grossProfit, 0))}</td>
                <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">({formatYen(rows.reduce((s, r) => s + r.operatingExpenses, 0))})</td>
                <td className="px-4 py-3 text-right font-mono text-xs font-bold text-green-700">{formatYen(rows.reduce((s, r) => s + r.netProfit, 0))}</td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">{rows.reduce((s, r) => s + r.vehiclesSold, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
