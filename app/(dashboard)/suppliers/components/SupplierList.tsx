"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatYen, SUPPLIER_TYPE_CONFIG } from "../_utils/utils";
import { Supplier } from "@/types/supplier";

interface SupplierListProps {
  Suppliers: Supplier[];
}

export function SupplierList({ Suppliers }: SupplierListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = Suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.bankName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openLedger = (Supplier: Supplier) => {
    setSelectedSupplier(Supplier);
    setIsLedgerModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search suppliers by name or bank..."
            className="pl-9 bg-gray-50 border-transparent focus-visible:ring-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-w-[640px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Supplier Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Purchases</th>
                <th className="px-6 py-4 font-medium">Payments Made</th>
                <th className="px-6 py-4 font-medium">Outstanding Balance</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSuppliers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No suppliers found.</td></tr>
              ) : (
                filteredSuppliers.map((Supplier) => {
                  const typeConfig = SUPPLIER_TYPE_CONFIG[Supplier.type];
                  return (
                    <tr key={Supplier.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{Supplier.name}</p>
                        <p className="text-xs text-gray-500">{Supplier.bankName} - {Supplier.bankAccount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${typeConfig.className}`}>
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{formatYen(Supplier.purchasesMade)}</td>
                      <td className="px-6 py-4 text-gray-600">{formatYen(Supplier.paymentsMade)}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{formatYen(Supplier.outstandingBalance)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button onClick={() => openLedger(Supplier)} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          View Ledger
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dummy Ledger Modal */}
      <Dialog open={isLedgerModalOpen} onOpenChange={setIsLedgerModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Supplier Ledger: {selectedSupplier?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-600">Pending Payables:</span>
              <span className="text-lg font-bold text-red-600">{selectedSupplier ? formatYen(selectedSupplier.outstandingBalance) : "¥0"}</span>
            </div>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2 text-right">Debit (Purchase)</th>
                    <th className="px-4 py-2 text-right">Credit (Payment)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3">2026-05-10</td>
                    <td className="px-4 py-3">Auction Purchase (Toyota Prius)</td>
                    <td className="px-4 py-3 text-right text-gray-900">¥850,000</td>
                    <td className="px-4 py-3 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}