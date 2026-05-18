"use client";

import type { TimelineEntry } from "@/types/types";

interface Props {
  entries: TimelineEntry[];
}

const TYPE_CONFIG = {
  purchase: { label: "Purchase",        className: "bg-blue-50 text-blue-700 border-blue-200" },
  repair:   { label: "Sent to Workshop",className: "bg-amber-50 text-amber-700 border-amber-200" },
  return:   { label: "Returned to Yard",className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  sale:     { label: "Sale",            className: "bg-purple-50 text-purple-700 border-purple-200" },
};

const STATUS_CONFIG = {
  draft:     { label: "Draft",     className: "bg-gray-50 text-gray-500 border-gray-200" },
  submitted: { label: "Submitted", className: "bg-green-50 text-green-700 border-green-200" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatYen(n: number) {
  return "¥" + n.toLocaleString();
}

export default function Timeline({ entries }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Vehicle Timeline</h2>
        <p className="text-xs text-gray-400 mt-0.5">Full movement and transaction history</p>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-50">
              {["Date", "Type", "Description", "Invoice No.", "Amount", "Details", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-300">
                  No timeline entries yet
                </td>
              </tr>
            ) : (
              entries.map((entry) => {
                const typeCfg   = TYPE_CONFIG[entry.type];
                const statusCfg = STATUS_CONFIG[entry.status];
                return (
                  <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${typeCfg.className}`}>
                        {typeCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px]">
                      {entry.description}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">
                      {entry.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {entry.amount ? formatYen(entry.amount) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px]">
                      {entry.details ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}