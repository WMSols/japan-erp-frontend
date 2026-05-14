"use client";

import type { WorkshopStats } from "@/types/workShopTypes";
import { formatYen } from "../utils/workshopUtils";
import { Wrench, CheckCircle, DollarSign, BarChart2 } from "lucide-react";

interface WorkshopStatsCardsProps {
  stats: WorkshopStats;
}

interface StatCard {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  valueColor: string;
}

export default function WorkshopStatsCards({ stats }: WorkshopStatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: "In Repair",
      value: stats.inRepair,
      sub: "active jobs",
      icon: <Wrench className="w-4 h-4" />,
      valueColor: "text-orange-500",
    },
    {
      label: "Completed",
      value: stats.completed,
      sub: "this cycle",
      icon: <CheckCircle className="w-4 h-4" />,
      valueColor: "text-green-500",
    },
    {
      label: "Total Spend",
      value: formatYen(stats.totalSpent),
      sub: "all repair costs",
      icon: <DollarSign className="w-4 h-4" />,
      valueColor: "text-gray-900",
    },
    {
      label: "Avg. Repair Cost",
      value: formatYen(stats.avgRepairCost),
      sub: "per job",
      icon: <BarChart2 className="w-4 h-4" />,
      valueColor: "text-gray-900",
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