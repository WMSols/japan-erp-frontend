"use client";

import type { SalesStats } from "@/types/types";
import { formatYen } from "../_utils/salesUtils";
import { ShoppingBag, TrendingUp, Wallet, AlertCircle } from "lucide-react";

interface SalesStatsCardsProps {
  stats: SalesStats;
}

export default function SalesStatsCards({ stats }: SalesStatsCardsProps) {
  const cards = [
    {
      label: "Total Sales",
      value: stats.totalSales,
      sub: "this cycle",
      icon: <ShoppingBag className="w-4 h-4" />,
      valueColor: "text-gray-900",
    },
    {
      label: "Total Revenue",
      value: formatYen(stats.totalRevenue),
      sub: "net of commission & discount",
      icon: <Wallet className="w-4 h-4" />,
      valueColor: "text-gray-900",
    },
    {
      label: "Total Profit",
      value: formatYen(stats.totalProfit),
      sub: "revenue minus cost",
      icon: <TrendingUp className="w-4 h-4" />,
      valueColor: stats.totalProfit >= 0 ? "text-green-600" : "text-red-500",
    },
    {
      label: "Outstanding",
      value: formatYen(stats.outstanding),
      sub: "unpaid receivables",
      icon: <AlertCircle className="w-4 h-4" />,
      valueColor: stats.outstanding > 0 ? "text-orange-500" : "text-gray-900",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium tracking-widest uppercase">
              {card.label}
            </span>
            {card.icon}
          </div>
          <div>
            <p className={`text-2xl font-semibold ${card.valueColor}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}