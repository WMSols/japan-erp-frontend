"use client";

import { useState } from "react";
import { MOCK_CUSTOMER_LEDGERS } from "@/data/ledgers";
import type { CustomerLedger } from "@/types/types";
import { formatYen, formatDate, formatBalance } from "../_utils/ledgerUtils";
import ScrollableTable, { Th, Td } from "./ScrollableTable";
import { ChevronLeft, AlertCircle, Mail, Phone } from "lucide-react";

export default function CustomerLedgerTab() {
  const [selected, setSelected] = useState<CustomerLedger | null>(null);

  if (selected) {
    return <CustomerDetail customer={selected} onBack={() => setSelected(null)} />;
  }

  const totalReceivable = MOCK_CUSTOMER_LEDGERS.reduce((s, l) => s + l.outstandingReceivable, 0);
  const alerts = MOCK_CUSTOMER_LEDGERS.filter((l) => l.hasPendingAlert).length;

  return (
    <div className="space-y-4 py-2">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Customers",     value: MOCK_CUSTOMER_LEDGERS.length },
          { label: "Total Receivable",    value: formatYen(totalReceivable) },
          { label: "Pending Alerts",      value: alerts + " customers", alert: alerts > 0 },
        ].map((c) => (
          <div key={c.label} className={`bg-white rounded-xl border p-4 ${c.alert ? "border-orange-200" : "border-gray-100"}`}>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{c.label}</p>
            <p className={`text-lg font-semibold ${c.alert ? "text-orange-600" : "text-gray-900"}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Pending alerts banner */}
      {alerts > 0 && (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-sm text-orange-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            <strong>{alerts} customer{alerts > 1 ? "s have" : " has"}</strong> outstanding receivables requiring follow-up.
          </span>
        </div>
      )}

      {/* Customer table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Customer Accounts</h3>
          <p className="text-xs text-gray-400 mt-0.5">Click a row to view full statement</p>
        </div>
        <ScrollableTable>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Contact</Th>
              <Th right>Total Sales</Th>
              <Th right>Received</Th>
              <Th right>Outstanding</Th>
              <Th>Payment Status</Th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CUSTOMER_LEDGERS.map((c) => (
              <tr
                key={c.customerId}
                onClick={() => setSelected(c)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Td>
                  <div className="flex items-center gap-2">
                    {c.hasPendingAlert && (
                      <AlertCircle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{c.customerName}</p>
                      <p className="text-xs text-gray-400 font-mono">{c.customerId}</p>
                    </div>
                  </div>
                </Td>
                <Td muted>{c.email ?? c.phone ?? "—"}</Td>
                <Td right>{formatYen(c.totalSales)}</Td>
                <Td right className="text-green-600">{formatYen(c.totalReceived)}</Td>
                <Td right>
                  <span className={`font-semibold ${c.outstandingReceivable > 0 ? "text-orange-600" : "text-gray-400"}`}>
                    {formatYen(c.outstandingReceivable)}
                  </span>
                </Td>
                <Td>
                  <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border font-medium ${
                    c.outstandingReceivable === 0
                      ? "bg-green-50 text-green-700 border-green-200"
                      : c.totalReceived > 0
                      ? "bg-orange-50 text-orange-600 border-orange-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}>
                    {c.outstandingReceivable === 0 ? "Paid" : c.totalReceived > 0 ? "Partial" : "Unpaid"}
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

// ── Customer Detail ───────────────────────────────────────────────────────────

function CustomerDetail({ customer, onBack }: { customer: CustomerLedger; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <ChevronLeft className="w-4 h-4" /> All Customers
      </button>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{customer.customerName}</h2>
            <div className="flex items-center gap-4 mt-1">
              {customer.phone && (
                <span className="flex items-center gap-1 text-xs text-gray-400"><Phone className="w-3 h-3" />{customer.phone}</span>
              )}
              {customer.email && (
                <span className="flex items-center gap-1 text-xs text-gray-400"><Mail className="w-3 h-3" />{customer.email}</span>
              )}
            </div>
          </div>
          {customer.outstandingReceivable > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Receivable: <span className="font-bold ml-1">{formatYen(customer.outstandingReceivable)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-50">
          {[
            { label: "Total Sales",     value: formatYen(customer.totalSales),           color: "text-gray-900" },
            { label: "Received",        value: formatYen(customer.totalReceived),         color: "text-green-600" },
            { label: "Outstanding",     value: formatYen(customer.outstandingReceivable), color: customer.outstandingReceivable > 0 ? "text-orange-600" : "text-gray-400" },
            { label: "Credit Balance",  value: formatYen(customer.openingBalance),        color: "text-gray-500" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-sm font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statement table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Customer Statement</h3>
        </div>
        <ScrollableTable>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th>Reference</Th>
              <Th right>Debit (Sale)</Th>
              <Th right>Credit (Payment)</Th>
              <Th right>Balance</Th>
            </tr>
          </thead>
          <tbody>
            {customer.entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <Td mono muted>{formatDate(entry.date)}</Td>
                <Td>{entry.description}</Td>
                <Td mono muted>{entry.reference || "—"}</Td>
                <Td right className={entry.debit > 0 ? "text-gray-900 font-medium" : "text-gray-300"}>
                  {entry.debit > 0 ? formatYen(entry.debit) : "—"}
                </Td>
                <Td right className={entry.credit > 0 ? "text-green-600 font-medium" : "text-gray-300"}>
                  {entry.credit > 0 ? formatYen(entry.credit) : "—"}
                </Td>
                <Td right>
                  <span className={`font-semibold ${entry.balance > 0 ? "text-orange-600" : "text-gray-400"}`}>
                    {formatBalance(entry.balance)}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-700">Closing Balance</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">{formatYen(customer.totalSales)}</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-green-600">{formatYen(customer.totalReceived)}</td>
              <td className="px-4 py-3 text-right text-sm font-bold text-orange-600">{formatYen(customer.outstandingReceivable)}</td>
            </tr>
          </tfoot>
        </ScrollableTable>
      </div>
    </div>
  );
}