"use client";

import React, { useState } from "react";
import { CompanyProfile } from "@/types/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CompanyProfileTab({ profile }: { profile: CompanyProfile }) {
  const [formData, setFormData] = useState<CompanyProfile>(profile);

  const handleSave = () => {
    // In a real app, this would trigger an API call to update the database
    console.log("Saving company profile:", formData);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 max-w-3xl">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Company Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-500">Legal Company Name</label>
          <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-500">Trading Name (DBA)</label>
          <Input value={formData.tradingName} onChange={(e) => setFormData({...formData, tradingName: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-500">Registration Number</label>
          <Input value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-500">Tax ID (Invoice System)</label>
          <Input value={formData.taxId} onChange={(e) => setFormData({...formData, taxId: e.target.value})} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs uppercase tracking-wider text-gray-500">Registered Address</label>
          <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-500">Contact Phone</label>
          <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-500">Billing Email</label>
          <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <Button onClick={handleSave} className="bg-gray-900 text-white hover:bg-gray-800">Save Changes</Button>
      </div>
    </div>
  );
}