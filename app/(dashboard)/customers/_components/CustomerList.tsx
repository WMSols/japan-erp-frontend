"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatYen, CUSTOMER_STATUS_CONFIG } from "../_utils/utils";
import { Customer } from "@/types/customer";

interface CustomerListProps {
  customers: Customer[];
}

export function CustomerList({ customers }: CustomerListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openLedger = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsLedgerModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search customers by name or company..."
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
                <th className="px-6 py-4 font-medium">Customer Details</th>
                <th className="px-6 py-4 font-medium">Total Sales</th>
                <th className="px-6 py-4 font-medium">Received</th>
                <th className="px-6 py-4 font-medium">Outstanding</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No customers found.</td></tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const status = CUSTOMER_STATUS_CONFIG[customer.status];
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        {customer.companyName && <p className="text-xs text-gray-500">{customer.companyName}</p>}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{formatYen(customer.totalSales)}</td>
                      <td className="px-6 py-4 text-green-600">{formatYen(customer.paymentsReceived)}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{formatYen(customer.outstandingBalance)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`}></span>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button onClick={() => openLedger(customer)} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
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
            <DialogTitle>Ledger Statement: {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-600">Current Outstanding:</span>
              <span className="text-lg font-bold text-gray-900">{selectedCustomer ? formatYen(selectedCustomer.outstandingBalance) : "¥0"}</span>
            </div>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Ref</th>
                    <th className="px-4 py-2 text-right">Debit (Sale)</th>
                    <th className="px-4 py-2 text-right">Credit (Pay)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3">2026-05-12</td>
                    <td className="px-4 py-3">INV-2026-101</td>
                    <td className="px-4 py-3 text-right">¥1,200,000</td>
                    <td className="px-4 py-3 text-right">-</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">2026-05-14</td>
                    <td className="px-4 py-3">RCPT-099</td>
                    <td className="px-4 py-3 text-right">-</td>
                    <td className="px-4 py-3 text-right text-green-600">¥1,200,000</td>
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