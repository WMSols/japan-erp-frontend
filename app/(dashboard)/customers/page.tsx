"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockCustomers, mockCustomerStats } from "@/data/customers";
import { Customer } from "@/types/customer";
import { CustomerStatsCards } from "./_components/CustomerStatsCards";
import { CustomerList } from "./_components/CustomerList";
import { CustomerAddModal, NewCustomerPayload } from "./_components/CustomerAddModal";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCustomer = (payload: NewCustomerPayload) => {
    const customerToAdd: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: payload.name,
      companyName: payload.companyName,
      email: payload.email,
      phone: payload.phone,
      address: "Pending Address",
      totalSales: 0,
      paymentsReceived: 0,
      outstandingBalance: 0,
      creditLimit: 0,
      status: "active",
      lastActive: new Date().toISOString(),
    };

    setCustomers([customerToAdd, ...customers]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 min-w-0 p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">Manage client ledgers and accounts receivable</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-gray-900 text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <CustomerStatsCards stats={mockCustomerStats} />
      <CustomerList customers={customers} />

      <CustomerAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCustomer}
      />
    </div>
  );
}