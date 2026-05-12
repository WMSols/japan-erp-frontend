"use client";

import type { WorkshopStats } from "@/types/types";
import { formatYen } from "@/data/workshop";

interface Props {
  stats: WorkshopStats;
}

interface CardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  dot?: string;
}

function StatCard({ label, value, sub, color = "text-gray-900", dot }: CardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {dot && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      </div>
      <p className={`text-2xl font-semibold leading-none ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function WorkshopStatsBar({ stats }: Props) {
  const totalCost = stats.totalLaborCost + stats.totalPartsCost + stats.totalExternalCharge;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard label="Total Jobs" value={stats.total} sub="all time" />
      <StatCard
        label="In Progress"
        value={stats.inProgress}
        sub="active now"
        color="text-blue-600"
        dot="bg-blue-400"
      />
      <StatCard
        label="Pending"
        value={stats.pending}
        sub="queued"
        color="text-amber-600"
        dot="bg-amber-400"
      />
      <StatCard
        label="On Hold"
        value={stats.onHold}
        sub="waiting"
        color="text-orange-500"
        dot="bg-orange-400"
      />
      <StatCard
        label="Completed"
        value={stats.completed}
        sub="done"
        color="text-emerald-600"
        dot="bg-emerald-400"
      />
      <StatCard
        label="Total Spend"
        value={formatYen(totalCost)}
        sub="labor + parts + ext."
        color="text-gray-900"
      />
    </div>
  );
}