"use client";

import type { CustomerReceivableRow } from "@/types/reports";
import { formatYen, getAgeingRisk, AGEING_RISK_CONFIG } from "../_utils/reportsUtils";

interface Props {
  rows: CustomerReceivableRow[];
}

export default function CustomerReceivableReport({ rows }: Props) {
  const sorted = [...rows].sort((a, b) => b.totalReceivable - a.totalReceivable);

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Customer Receivables (Accounts Receivable Ageing)</h2>
        <span className="text-xs text-gray-500">{rows.length} customers</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">31–60 Days</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">61–90 Days</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">90+ Days</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((row) => {
              const risk = getAgeingRisk(row.days90plus, row.totalReceivable);
              const cfg = AGEING_RISK_CONFIG[risk];
              return (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{row.customerName}</div>
                    {row.lastPaymentDate && (
                      <div className="text-xs text-gray-400">
                        Last paid: {formatYen(row.lastPaymentAmount ?? 0)} on {row.lastPaymentDate}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{row.country}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-700">
                    {(row.current + row.days30) > 0 ? formatYen(row.current + row.days30) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-yellow-700">
                    {row.days60 > 0 ? formatYen(row.days60) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-orange-700">
                    {row.days90plus > 0 && row.days60 === 0 ? <span className="text-gray-300">—</span> : null}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-red-700 font-semibold">
                    {row.days90plus > 0 ? formatYen(row.days90plus) : <span className="text-gray-300 font-normal">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">
                    {formatYen(row.totalReceivable)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-gray-200">
            <tr className="bg-gray-50">
              <td className="px-5 py-3 font-bold text-gray-900" colSpan={2}>TOTAL</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{formatYen(rows.reduce((s, r) => s + r.current + r.days30, 0))}</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-yellow-700">{formatYen(rows.reduce((s, r) => s + r.days60, 0))}</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-orange-700">—</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-red-700">{formatYen(rows.reduce((s, r) => s + r.days90plus, 0))}</td>
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-gray-900">{formatYen(rows.reduce((s, r) => s + r.totalReceivable, 0))}</td>
              <td className="px-4 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
