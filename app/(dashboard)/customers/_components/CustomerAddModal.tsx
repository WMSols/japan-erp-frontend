"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface NewCustomerPayload {
  name: string;
  companyName: string;
  email: string;
  phone: string;
}

interface CustomerAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: NewCustomerPayload) => void;
}

export function CustomerAddModal({ isOpen, onClose, onSave }: CustomerAddModalProps) {
  const [formData, setFormData] = useState<NewCustomerPayload>({
    name: "",
    companyName: "",
    email: "",
    phone: "",
  });

  const handleSave = () => {
    if (!formData.name) return; // Prevent empty names
    onSave(formData);
    setFormData({ name: "", companyName: "", email: "", phone: "" }); // Reset on save
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-gray-500">Full Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Kenji Sato"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-gray-500">Company Name</label>
            <Input
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              placeholder="e.g. Sato Motors K.K."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-500">Email</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-500">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="03-XXXX-XXXX"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-gray-900 text-white hover:bg-gray-800">Save Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}