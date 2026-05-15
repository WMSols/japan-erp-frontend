"use client";

import React from "react";
import { Users, Wallet, AlertCircle, TrendingUp } from "lucide-react";
import { formatYen } from "../_utils/utils"; // or wherever your shared formatters are
import { CustomerStats } from "@/types/customer";

interface CustomerStatsCardsProps {
  stats: CustomerStats;
}

export function CustomerStatsCards({ stats }: CustomerStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Customers</p>
            <h3 className="text-2xl font-semibold">{stats.totalCustomers}</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-5 h-5" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Receivables</p>
            <h3 className="text-2xl font-semibold">{formatYen(stats.totalReceivables)}</h3>
          </div>
          <div className="p-2 bg-green-50 rounded-lg text-green-600"><Wallet className="w-5 h-5" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Overdue Payments</p>
            <h3 className="text-2xl font-semibold text-red-600">{formatYen(stats.overduePayments)}</h3>
          </div>
          <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertCircle className="w-5 h-5" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Active Clients</p>
            <h3 className="text-2xl font-semibold">{stats.activeCustomers}</h3>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><TrendingUp className="w-5 h-5" /></div>
        </div>
      </div>
    </div>
  );
}