"use client";

import type { RepairJob } from "@/types/workShopTypes";
import {
  formatYen,
  formatDate,
  getDaysElapsed,
  isOverdue,
  STATUS_CONFIG,
  CHARGE_TYPE_CONFIG,
} from "../utils/workshopUtils";
import { ChevronDown, ChevronUp, Car, Calendar, User, AlertCircle } from "lucide-react";
import { useState } from "react";

interface RepairJobCardProps {
  job: RepairJob;
  onEdit: (job: RepairJob) => void;
  onStatusChange: (jobId: string, status: RepairJob["status"]) => void;
}

export default function RepairJobCard({ job, onEdit, onStatusChange }: RepairJobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[job.status];
  const overdue = isOverdue(job);
  const daysElapsed = getDaysElapsed(job.startDate);

  // Group charges by type for the breakdown
  const laborCost = job.charges.filter((c) => c.type === "labor").reduce((s, c) => s + c.totalCost, 0);
  const partsCost = job.charges.filter((c) => c.type === "parts").reduce((s, c) => s + c.totalCost, 0);
  const externalCost = job.charges.filter((c) => c.type === "external").reduce((s, c) => s + c.totalCost, 0);

  return (
    <div className={`bg-white rounded-xl border ${overdue ? "border-red-200" : "border-gray-100"} overflow-hidden`}>
      {/* ── Header ── */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <Car className="w-4 h-4 text-gray-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm">{job.vehicleName}</p>
                <span className="text-xs text-gray-400 font-mono">{job.id}</span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{job.vehicleId}</p>
            </div>
          </div>

          {/* Right – status badge */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium flex-shrink-0 ${statusCfg.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{job.description}</p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <User className="w-3.5 h-3.5" />
            {job.assignedTo}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            Started {formatDate(job.startDate)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {job.status === "completed" && job.actualEndDate
              ? `Completed ${formatDate(job.actualEndDate)}`
              : `Due ${formatDate(job.estimatedEndDate)}`}
          </span>
          {job.status !== "completed" && (
            <span className="text-xs text-gray-400">{daysElapsed}d elapsed</span>
          )}
        </div>

        {/* Overdue banner */}
        {overdue && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Overdue – estimated end date passed
          </div>
        )}

        {/* Cost row + actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Total Cost</p>
            <p className="text-base font-semibold text-gray-900">{formatYen(job.totalCost)}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick status update */}
            {job.status === "pending" && (
              <button
                onClick={() => onStatusChange(job.id, "in_progress")}
                className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-100"
              >
                Start
              </button>
            )}
            {job.status === "in_progress" && (
              <button
                onClick={() => onStatusChange(job.id, "completed")}
                className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-100"
              >
                Mark Complete
              </button>
            )}
            <button
              onClick={() => onEdit(job)}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => setExpanded((p) => !p)}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100 flex items-center gap-1"
            >
              {expanded ? (
                <>Hide <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Details <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Expandable Charges Breakdown ── */}
      {expanded && (
        <div className="border-t border-gray-50 bg-gray-50/60 px-5 py-4">
          {/* Cost breakdown pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {laborCost > 0 && (
              <span className={`text-xs px-2.5 py-1 rounded-full border ${CHARGE_TYPE_CONFIG.labor.className}`}>
                Labor: {formatYen(laborCost)}
              </span>
            )}
            {partsCost > 0 && (
              <span className={`text-xs px-2.5 py-1 rounded-full border ${CHARGE_TYPE_CONFIG.parts.className}`}>
                Parts: {formatYen(partsCost)}
              </span>
            )}
            {externalCost > 0 && (
              <span className={`text-xs px-2.5 py-1 rounded-full border ${CHARGE_TYPE_CONFIG.external.className}`}>
                External: {formatYen(externalCost)}
              </span>
            )}
          </div>

          {/* Line items table */}
          <div className="rounded-lg border border-gray-100 overflow-hidden bg-white">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-3 py-2.5 font-medium text-gray-500">Description</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-500">Type</th>
                  <th className="text-right px-3 py-2.5 font-medium text-gray-500">Qty</th>
                  <th className="text-right px-3 py-2.5 font-medium text-gray-500">Unit</th>
                  <th className="text-right px-3 py-2.5 font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {job.charges.map((charge) => (
                  <tr key={charge.id}>
                    <td className="px-3 py-2.5 text-gray-700">{charge.description}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-medium ${CHARGE_TYPE_CONFIG[charge.type].className}`}>
                        {CHARGE_TYPE_CONFIG[charge.type].label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-600">{charge.quantity ?? "—"}</td>
                    <td className="px-3 py-2.5 text-right text-gray-600">{formatYen(charge.unitCost)}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-gray-900">{formatYen(charge.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td colSpan={4} className="px-3 py-2.5 text-right font-semibold text-gray-700">Total</td>
                  <td className="px-3 py-2.5 text-right font-bold text-gray-900">{formatYen(job.totalCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="mt-3 text-xs text-gray-500 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
              <span className="font-medium text-yellow-700">Note: </span>
              {job.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}