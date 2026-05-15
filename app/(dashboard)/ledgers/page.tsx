"use client";

import { useState } from "react";
import type { LedgerTab } from "@/types/types";
import SupplierLedgerTab from "./_components/SupplierLedgerTab";
import CustomerLedgerTab from "./_components/CustomerLedgerTab";
import GeneralLedgerTab from "./_components/GeneralLedgerTab";
import CashBankLedgerTab from "./_components/CashBankLedgerTab";

const TABS: { id: LedgerTab; label: string; sub: string }[] = [
  { id: "supplier",   label: "Supplier Ledger",  sub: "Accounts Payable" },
  { id: "customer",   label: "Customer Ledger",  sub: "Accounts Receivable" },
  { id: "general",    label: "General Ledger",   sub: "Chart of Accounts" },
  { id: "cash_bank",  label: "Cash & Bank",      sub: "Multi-account" },
];

export default function LedgersPage() {
  const [activeTab, setActiveTab] = useState<LedgerTab>("supplier");

  return (
    <div className="flex-1 min-w-0  space-y-6">
      {/* ── Page Header ── */}
      <div className="bg-white p-6">
        <h1 className="text-xl font-semibold text-gray-900">Ledgers</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Supplier, customer, general &amp; cash/bank accounts
        </p>
      </div>

      {/* ── Tab Bar ── */}
      <div className="p-6">


      <div className="w-full overflow-x-auto">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit min-w-full sm:min-w-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex-1 sm:flex-none flex flex-col items-center sm:items-start px-4 py-2.5 rounded-lg text-left transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700",
              ].join(" ")}
            >
              <span className="text-sm font-medium">{tab.label}</span>
              <span className={`text-[10px] ${activeTab === tab.id ? "text-gray-400" : "text-gray-400"}`}>
                {tab.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "supplier"  && <SupplierLedgerTab />}
      {activeTab === "customer"  && <CustomerLedgerTab />}
      {activeTab === "general"   && <GeneralLedgerTab />}
      {activeTab === "cash_bank" && <CashBankLedgerTab />}
    </div>
    </div>
  );
}