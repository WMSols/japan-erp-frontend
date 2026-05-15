"use client";

import { useState } from "react";
import { MOCK_SUPPLIER_LEDGERS } from "@/data/ledgers";
import type { SupplierLedger } from "@/types/types";
import { formatYen, formatDate, formatBalance } from "../_utils/ledgerUtils";
import ScrollableTable, { Th, Td } from "./ScrollableTable";
import { ChevronLeft, AlertCircle, Phone } from "lucide-react";

export default function SupplierLedgerTab() {
  const [selected, setSelected] = useState<SupplierLedger | null>(null);

  if (selected) {
    return <SupplierDetail supplier={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-4 py-2">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Suppliers",  value: MOCK_SUPPLIER_LEDGERS.length },
          { label: "Total Payable",    value: formatYen(MOCK_SUPPLIER_LEDGERS.reduce((s, l) => s + l.outstandingBalance, 0)) },
          { label: "Settled",          value: MOCK_SUPPLIER_LEDGERS.filter((l) => l.outstandingBalance === 0).length + " suppliers" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{c.label}</p>
            <p className="text-lg font-semibold text-gray-900">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Supplier table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Supplier Accounts</h3>
          <p className="text-xs text-gray-400 mt-0.5">Click a row to view full ledger statement</p>
        </div>
        <ScrollableTable>
          <thead>
            <tr>
              <Th>Supplier</Th>
              <Th>Phone</Th>
              <Th right>Opening Balance</Th>
              <Th right>Total Purchases</Th>
              <Th right>Total Payments</Th>
              <Th right>Outstanding</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SUPPLIER_LEDGERS.map((s) => (
              <tr
                key={s.supplierId}
                onClick={() => setSelected(s)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Td>
                  <div>
                    <p className="font-medium text-gray-900">{s.supplierName}</p>
                    <p className="text-xs text-gray-400 font-mono">{s.supplierId}</p>
                  </div>
                </Td>
                <Td muted>{s.phone ?? "—"}</Td>
                <Td right>{formatYen(s.openingBalance)}</Td>
                <Td right className="text-red-500">{formatYen(s.totalPurchases)}</Td>
                <Td right className="text-green-600">{formatYen(s.totalPayments)}</Td>
                <Td right>
                  <span className={`font-semibold ${s.outstandingBalance > 0 ? "text-orange-600" : "text-gray-400"}`}>
                    {formatYen(s.outstandingBalance)}
                  </span>
                </Td>
                <Td>
                  <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border font-medium ${
                    s.outstandingBalance === 0
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-orange-50 text-orange-600 border-orange-200"
                  }`}>
                    {s.outstandingBalance === 0 ? "Settled" : "Outstanding"}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      </div>
    </div>
  );
}

// ── Supplier Detail ───────────────────────────────────────────────────────────

function SupplierDetail({ supplier, onBack }: { supplier: SupplierLedger; onBack: () => void }) {
  return (
    <div className="space-y-4">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> All Suppliers
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{supplier.supplierName}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
              <Phone className="w-3 h-3" /> {supplier.phone ?? "—"}
            </div>
          </div>
          {supplier.outstandingBalance > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Outstanding: <span className="font-bold ml-1">{formatYen(supplier.outstandingBalance)}</span>
            </div>
          )}
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-50">
          {[
            { label: "Opening Balance", value: formatYen(supplier.openingBalance), color: "text-gray-900" },
            { label: "Total Purchases", value: formatYen(supplier.totalPurchases), color: "text-red-500" },
            { label: "Total Payments",  value: formatYen(supplier.totalPayments),  color: "text-green-600" },
            { label: "Outstanding",     value: formatYen(supplier.outstandingBalance), color: supplier.outstandingBalance > 0 ? "text-orange-600" : "text-gray-400" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-sm font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Aging report */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Aging Report (Pending Dues)</h3>
        <ScrollableTable>
          <thead>
            <tr>
              <Th>0–30 Days</Th>
              <Th>31–60 Days</Th>
              <Th>61–90 Days</Th>
              <Th>90+ Days</Th>
              <Th right>Total Outstanding</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className={supplier.agingCurrent > 0 ? "text-yellow-600 font-medium" : ""}>{formatYen(supplier.agingCurrent)}</Td>
              <Td className={supplier.aging30 > 0 ? "text-orange-600 font-medium" : ""}>{formatYen(supplier.aging30)}</Td>
              <Td className={supplier.aging60 > 0 ? "text-red-500 font-medium" : ""}>{formatYen(supplier.aging60)}</Td>
              <Td className={supplier.aging90 > 0 ? "text-red-700 font-bold" : ""}>{formatYen(supplier.aging90)}</Td>
              <Td right><span className="font-bold text-gray-900">{formatYen(supplier.outstandingBalance)}</span></Td>
            </tr>
          </tbody>
        </ScrollableTable>
      </div>

      {/* Full ledger entries */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Ledger Statement</h3>
        </div>
        <ScrollableTable>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th>Reference</Th>
              <Th right>Debit (Purchase)</Th>
              <Th right>Credit (Payment)</Th>
              <Th right>Balance</Th>
            </tr>
          </thead>
          <tbody>
            {supplier.entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <Td mono muted>{formatDate(entry.date)}</Td>
                <Td>{entry.description}</Td>
                <Td mono muted>{entry.reference || "—"}</Td>
                <Td right className={entry.debit > 0 ? "text-red-500 font-medium" : "text-gray-300"}>
                  {entry.debit > 0 ? formatYen(entry.debit) : "—"}
                </Td>
                <Td right className={entry.credit > 0 ? "text-green-600 font-medium" : "text-gray-300"}>
                  {entry.credit > 0 ? formatYen(entry.credit) : "—"}
                </Td>
                <Td right>
                  <span className={`font-semibold ${entry.balance < 0 ? "text-red-500" : "text-gray-900"}`}>
                    {formatBalance(entry.balance)}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-700">Closing Balance</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-red-500">{formatYen(supplier.totalPurchases)}</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-green-600">{formatYen(supplier.totalPayments)}</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">{formatYen(supplier.outstandingBalance)}</td>
            </tr>
          </tfoot>
        </ScrollableTable>
      </div>
    </div>
  );
}