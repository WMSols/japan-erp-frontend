"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockSuppliers, mockSupplierStats } from "@/data/suppliers";
import { Supplier } from "@/types/supplier";
import { SupplierStatsCards } from "./components/SupplierStatsCards";
import { SupplierList } from "./components/SupplierList";
import { SupplierAddModal, NewSupplierPayload } from "./components/SupplierAddModal";

export default function SuppliersPage() {
  const [Suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSupplier = (payload: NewSupplierPayload) => {
    const SupplierToAdd: Supplier = {
      id: `SUP-00${Suppliers.length + 1}`,
      name: payload.name,
      type: payload.type,
      contactPerson: "Pending Contact",
      email: "pending@email.com",
      phone: "000-0000-0000",
      bankName: payload.bankName || "Pending Bank",
      bankAccount: payload.bankAccount || "Pending Acc",
      openingBalance: 0,
      purchasesMade: 0,
      paymentsMade: 0,
      outstandingBalance: 0,
      status: "active",
    };

    setSuppliers([SupplierToAdd, ...Suppliers]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 min-w-0 p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500">Manage accounts payable and vendor ledgers</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-gray-900 text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <SupplierStatsCards stats={mockSupplierStats} />
      <SupplierList Suppliers={Suppliers} />

      <SupplierAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSupplier}
      />
    </div>
  );
}