"use client";

import { useState } from "react";
import { MOCK_CASH_BANK_ACCOUNTS } from "@/data/ledgers";
import type { CashBankAccount } from "@/types/types";
import { formatYen, formatDate, formatBalance, ACCOUNT_KIND_CONFIG } from "../_utils/ledgerUtils";
import ScrollableTable, { Th, Td } from "./ScrollableTable";
import { Banknote, Building2 } from "lucide-react";

export default function CashBankLedgerTab() {
  const [selectedId, setSelectedId] = useState<string>(MOCK_CASH_BANK_ACCOUNTS[0].id);
  const selected = MOCK_CASH_BANK_ACCOUNTS.find((a) => a.id === selectedId)!;

  const totalBalance = MOCK_CASH_BANK_ACCOUNTS
    .filter((a) => a.currency === "JPY")
    .reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-4 py-2">
      {/* Total balance card */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total JPY Balance</p>
          <p className="text-lg font-bold text-gray-900">{formatYen(totalBalance)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cash Accounts</p>
          <p className="text-lg font-semibold text-gray-900">{MOCK_CASH_BANK_ACCOUNTS.filter((a) => a.kind === "cash").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bank Accounts</p>
          <p className="text-lg font-semibold text-gray-900">{MOCK_CASH_BANK_ACCOUNTS.filter((a) => a.kind === "bank").length}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Account selector sidebar */}
        <div className="w-full lg:w-56 flex-shrink-0 space-y-2">
          {MOCK_CASH_BANK_ACCOUNTS.map((acc) => {
            const cfg = ACCOUNT_KIND_CONFIG[acc.kind];
            const isActive = acc.id === selectedId;
            return (
              <button
                key={acc.id}
                onClick={() => setSelectedId(acc.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isActive
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "bg-white border-gray-100 hover:border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {acc.kind === "cash"
                    ? <Banknote className={`w-3.5 h-3.5 ${isActive ? "text-gray-300" : "text-gray-400"}`} />
                    : <Building2 className={`w-3.5 h-3.5 ${isActive ? "text-gray-300" : "text-gray-400"}`} />
                  }
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                    isActive ? "bg-white/10 text-white border-white/20" : cfg.className
                  }`}>
                    {cfg.label}
                  </span>
                </div>
                <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-gray-900"}`}>{acc.name}</p>
                <p className={`text-xs mt-0.5 font-mono ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                  {acc.currency} {formatYen(acc.balance, acc.currency)}
                </p>
              </button>
            );
          })}
        </div>

        {/* Account detail */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Account header */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{selected.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Currency: {selected.currency}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Current Balance</p>
                <p className={`text-xl font-bold ${selected.balance >= 0 ? "text-gray-900" : "text-red-500"}`}>
                  {formatBalance(selected.balance, selected.currency)}
                </p>
              </div>
            </div>

            {/* Mini summary */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50 text-center">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Opening</p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">{formatYen(selected.openingBalance, selected.currency)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total In</p>
                <p className="text-sm font-semibold text-green-600 mt-0.5">
                  {formatYen(selected.entries.reduce((s, e) => s + e.debit, 0), selected.currency)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total Out</p>
                <p className="text-sm font-semibold text-red-500 mt-0.5">
                  {formatYen(selected.entries.reduce((s, e) => s + e.credit, 0), selected.currency)}
                </p>
              </div>
            </div>
          </div>

          {/* Transactions table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Transaction History</h3>
            </div>
            <ScrollableTable>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th>Reference</Th>
                  <Th right>Money In</Th>
                  <Th right>Money Out</Th>
                  <Th right>Balance</Th>
                </tr>
              </thead>
              <tbody>
                {selected.entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <Td mono muted>{formatDate(entry.date)}</Td>
                    <Td>{entry.description}</Td>
                    <Td mono muted>{entry.reference || "—"}</Td>
                    <Td right className={entry.debit > 0 ? "text-green-600 font-medium" : "text-gray-300"}>
                      {entry.debit > 0 ? formatYen(entry.debit, selected.currency) : "—"}
                    </Td>
                    <Td right className={entry.credit > 0 ? "text-red-500 font-medium" : "text-gray-300"}>
                      {entry.credit > 0 ? formatYen(entry.credit, selected.currency) : "—"}
                    </Td>
                    <Td right>
                      <span className={`font-semibold ${entry.balance < 0 ? "text-red-500" : "text-gray-900"}`}>
                        {formatBalance(entry.balance, selected.currency)}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-700">Closing Balance</td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-green-600">
                    {formatYen(selected.entries.reduce((s, e) => s + e.debit, 0), selected.currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-red-500">
                    {formatYen(selected.entries.reduce((s, e) => s + e.credit, 0), selected.currency)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                    {formatBalance(selected.balance, selected.currency)}
                  </td>
                </tr>
              </tfoot>
            </ScrollableTable>
          </div>
        </div>
      </div>
    </div>
  );
}