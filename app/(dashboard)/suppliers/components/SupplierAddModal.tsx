"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupplierType } from "@/types/supplier";

export interface NewSupplierPayload {
  name: string;
  type: SupplierType;
  bankName: string;
  bankAccount: string;
}

interface SellerAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: NewSupplierPayload) => void;
}

export function SupplierAddModal({ isOpen, onClose, onSave }: SellerAddModalProps) {
  const [formData, setFormData] = useState<NewSupplierPayload>({
    name: "",
    type: "local_supplier",
    bankName: "",
    bankAccount: "",
  });

  const handleSave = () => {
    if (!formData.name) return;
    onSave(formData);
    setFormData({ name: "", type: "local_supplier", bankName: "", bankAccount: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-gray-500">Supplier Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. USS Tokyo"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-gray-500">Supplier Type</label>
            <Select
              value={formData.type}
              onValueChange={(val: SupplierType) => setFormData({...formData, type: val})}
            >
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auction">Auction House</SelectItem>
                <SelectItem value="dealer">Dealer</SelectItem>
                <SelectItem value="local_supplier">Local Supplier</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-500">Bank Name</label>
              <Input
                value={formData.bankName}
                onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                placeholder="e.g. Mitsubishi UFJ"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-500">Account No.</label>
              <Input
                value={formData.bankAccount}
                onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                placeholder="Ordinary 1234567"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-gray-900 text-white hover:bg-gray-800">Save Supplier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}