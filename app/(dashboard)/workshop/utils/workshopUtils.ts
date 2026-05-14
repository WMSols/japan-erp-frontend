import type { RepairJob, WorkshopStats } from "@/types/workShopTypes";

// ─── Formatting Helpers ────────────────────────────────────────────────────

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getDaysElapsed(start: string): number {
  const now = new Date();
  const s = new Date(start);
  return Math.floor((now.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(job: RepairJob): boolean {
  if (job.status === "completed" || job.status === "cancelled") return false;
  return new Date() > new Date(job.estimatedEndDate);
}

// ─── Statistics ────────────────────────────────────────────────────────────

export function computeWorkshopStats(jobs: RepairJob[]): WorkshopStats {
  const active = jobs.filter((j) => j.status === "in_progress" || j.status === "pending");
  const completed = jobs.filter((j) => j.status === "completed");
  const totalSpent = jobs.reduce((sum, j) => sum + j.totalCost, 0);
  const avgRepairCost = jobs.length > 0 ? Math.round(totalSpent / jobs.length) : 0;

  return {
    inRepair: active.length,
    completed: completed.length,
    totalSpent,
    avgRepairCost,
  };
}

// ─── Status Helpers ────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  completed: {
    label: "Completed",
    className: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-50 text-gray-500 border-gray-200",
    dot: "bg-gray-300",
  },
} as const;

export const CHARGE_TYPE_CONFIG = {
  labor: { label: "Labor", className: "bg-purple-50 text-purple-700 border-purple-200" },
  parts: { label: "Parts", className: "bg-sky-50 text-sky-700 border-sky-200" },
  external: { label: "External", className: "bg-orange-50 text-orange-700 border-orange-200" },
} as const;