"use client";

import { useState } from "react";
import { MOCK_GL_ACCOUNTS, MOCK_GL_ENTRIES } from "@/data/ledgers";
import { formatYen, groupGLByType, glTypeTotal, GL_TYPE_CONFIG } from "../_utils/ledgerUtils";
import ScrollableTable, { Th, Td } from "./ScrollableTable";
import { formatDate } from "../_utils/ledgerUtils";

type GLView = "chart" | "journal";

export default function GeneralLedgerTab() {
  const [view, setView] = useState<GLView>("chart");
  const grouped = groupGLByType(MOCK_GL_ACCOUNTS);

  const totalAssets     = glTypeTotal(grouped.asset);
  const totalLiabilities= glTypeTotal(grouped.liability);
  const totalIncome     = glTypeTotal(grouped.income);
  const totalExpenses   = glTypeTotal(grouped.expense);
  const netProfit       = totalIncome - totalExpenses;

  return (
    <div className="space-y-4 py-2">
      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Assets",      value: formatYen(totalAssets),      color: "text-blue-600" },
          { label: "Total Liabilities", value: formatYen(totalLiabilities), color: "text-red-500" },
          { label: "Total Income",      value: formatYen(totalIncome),       color: "text-green-600" },
          { label: "Net Profit",        value: formatYen(netProfit),         color: netProfit >= 0 ? "text-green-600" : "text-red-500" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{c.label}</p>
            <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(["chart", "journal"] as GLView[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === v ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {v === "chart" ? "Chart of Accounts" : "Journal Entries"}
          </button>
        ))}
      </div>

      {/* Chart of Accounts */}
      {view === "chart" && (
        <div className="space-y-4">
          {(["asset", "liability", "income", "expense"] as const).map((type) => {
            const accounts = grouped[type];
            const cfg = GL_TYPE_CONFIG[type];
            const total = glTypeTotal(accounts);
            return (
              <div key={type} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{formatYen(total)}</span>
                </div>
                <ScrollableTable>
                  <thead>
                    <tr>
                      <Th>Code</Th>
                      <Th>Account Name</Th>
                      <Th>Type</Th>
                      <Th right>Opening Balance</Th>
                      <Th right>Current Balance</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr key={acc.code} className="hover:bg-gray-50 transition-colors">
                        <Td mono muted>{acc.code}</Td>
                        <Td><span className="font-medium text-gray-900">{acc.name}</span></Td>
                        <Td>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.className}`}>
                            {cfg.label}
                          </span>
                        </Td>
                        <Td right muted>{formatYen(acc.openingBalance)}</Td>
                        <Td right>
                          <span className={`font-semibold ${
                            type === "income" ? "text-green-600" :
                            type === "expense" ? "text-red-500" :
                            type === "liability" ? "text-red-500" : "text-gray-900"
                          }`}>
                            {formatYen(acc.balance)}
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </ScrollableTable>
              </div>
            );
          })}
        </div>
      )}

      {/* Journal Entries (double-entry) */}
      {view === "journal" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Journal Entries</h3>
            <p className="text-xs text-gray-400 mt-0.5">Double-entry — debits equal credits per transaction</p>
          </div>
          <ScrollableTable>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Reference</Th>
                <Th>Description</Th>
                <Th>Account</Th>
                <Th right>Debit</Th>
                <Th right>Credit</Th>
              </tr>
            </thead>
            <tbody>
              {MOCK_GL_ENTRIES.map((entry) => (
                entry.lines.map((line, i) => (
                  <tr key={`${entry.id}-${i}`} className={`hover:bg-gray-50 transition-colors ${i === 0 ? "border-t-2 border-gray-100" : ""}`}>
                    <Td mono muted>{i === 0 ? formatDate(entry.date) : ""}</Td>
                    <Td mono muted>{i === 0 ? (entry.reference ?? "—") : ""}</Td>
                    <Td>{i === 0 ? entry.description : ""}</Td>
                    <Td>
                      <div>
                        <span className="font-mono text-xs text-gray-400 mr-2">{line.accountCode}</span>
                        <span className={`text-sm ${line.debit > 0 ? "font-medium text-gray-900" : "text-gray-500 pl-4"}`}>
                          {line.accountName}
                        </span>
                      </div>
                    </Td>
                    <Td right className={line.debit > 0 ? "text-gray-900 font-medium" : "text-gray-300"}>
                      {line.debit > 0 ? formatYen(line.debit) : "—"}
                    </Td>
                    <Td right className={line.credit > 0 ? "text-gray-900 font-medium" : "text-gray-300"}>
                      {line.credit > 0 ? formatYen(line.credit) : "—"}
                    </Td>
                  </tr>
                ))
              ))}
            </tbody>
          </ScrollableTable>
        </div>
      )}
    </div>
  );
}