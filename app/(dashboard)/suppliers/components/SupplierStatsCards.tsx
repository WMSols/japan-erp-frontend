"use client";

import React from "react";
import { Building2, CreditCard, ShoppingBag, Clock } from "lucide-react";
import { formatYen } from "../_utils/utils";
import { SupplierStats } from "@/types/supplier";

interface SupplierStatsCardsProps {
  stats: SupplierStats;
}

export function SupplierStatsCards({ stats }: SupplierStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Suppliers</p>
            <h3 className="text-2xl font-semibold">{stats.totalSuppliers}</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Building2 className="w-5 h-5" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Payables</p>
            <h3 className="text-2xl font-semibold">{formatYen(stats.totalPayables)}</h3>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><CreditCard className="w-5 h-5" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Pending Dues</p>
            <h3 className="text-2xl font-semibold text-red-600">{formatYen(stats.pendingDues)}</h3>
          </div>
          <div className="p-2 bg-red-50 rounded-lg text-red-600"><Clock className="w-5 h-5" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Purchases (Month)</p>
            <h3 className="text-2xl font-semibold">{formatYen(stats.purchasesThisMonth)}</h3>
          </div>
          <div className="p-2 bg-green-50 rounded-lg text-green-600"><ShoppingBag className="w-5 h-5" /></div>
        </div>
      </div>
    </div>
  );
}