"use client";

import { useState } from "react";
import type { RepairJob, RepairStatus } from '@/types/types' ;
import { calcPartsCost, calcTotalCost, formatYen, formatDate } from "@/data/workshop";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ── Status config ──────────────────────────────────────────────────────────
export const STATUS_CONFIG: Record<RepairStatus, { label: string; className: string; dot: string }> = {
  Pending:       { label: "Pending",     className: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400"  },
  "In Progress": { label: "In Progress", className: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-400"   },
  Completed:     { label: "Completed",   className: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  "On Hold":     { label: "On Hold",     className: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-400" },
};

const STATUS_OPTIONS: RepairStatus[] = ["Pending", "In Progress", "Completed", "On Hold"];

// ── Icons ──────────────────────────────────────────────────────────────────
const WrenchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

// ── Component ──────────────────────────────────────────────────────────────
interface Props {
  job: RepairJob;
  onStatusChange: (id: string, status: RepairStatus) => void;
  onDelete: (id: string) => void;
}

export default function RepairJobCard({ job, onStatusChange, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cfg = STATUS_CONFIG[job.status];
  const partsCost = calcPartsCost(job.parts);
  const totalCost = calcTotalCost(job);

  return (
    <div className={`bg-white rounded-xl border shadow-sm transition-shadow hover:shadow-md ${
      job.status === "Completed" ? "border-gray-100 opacity-80" : "border-gray-100"
    }`}>
      {/* Card header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
              {job.vehicleId}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md border ${cfg.className}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 mt-1.5 leading-tight">{job.vehicleName}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{job.description}</p>
        </div>

        {/* Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <div className="px-2 py-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Change Status</p>
            </div>
            {STATUS_OPTIONS.filter((s) => s !== job.status).map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => onStatusChange(job.id, s)}
                className="text-sm cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${STATUS_CONFIG[s].dot}`} />
                {s}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-600 focus:bg-red-50 text-sm cursor-pointer"
              onClick={() => setConfirmDelete(true)}
            >
              Delete job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Meta row */}
      <div className="px-4 pb-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <WrenchIcon />
          {job.assignedTo}
        </div>
        <span className="text-gray-200">·</span>
        <span className="text-xs text-gray-400">{formatDate(job.createdAt)}</span>
        {job.completedAt && (
          <>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-emerald-500">Done {formatDate(job.completedAt)}</span>
          </>
        )}
      </div>

      {/* Cost summary */}
      <div className="mx-4 mb-3 bg-gray-50 rounded-lg px-3 py-2.5 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Labor</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5">{formatYen(job.laborCost)}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Parts</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5">{formatYen(partsCost)}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">External</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5">{formatYen(job.externalCharge)}</p>
        </div>
      </div>

      {/* Total + expand parts */}
      <div className="border-t border-gray-50 px-4 py-2.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wide mr-2">Total Cost</span>
          <span className="text-sm font-bold text-gray-900">{formatYen(totalCost)}</span>
        </div>

        {job.parts.length > 0 && (
          <Collapsible open={expanded} onOpenChange={setExpanded}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
                {job.parts.length} part{job.parts.length > 1 ? "s" : ""}
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="absolute left-0 right-0 z-10 mx-4">
              {/* parts detail shown inline via next section */}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Parts detail (inline expand) */}
      {expanded && job.parts.length > 0 && (
        <div className="border-t border-gray-50 mx-0">
          <div className="px-4 py-2 space-y-1">
            {job.parts.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{p.name}</span>
                <span className="text-gray-400 tabular-nums">
                  {p.quantity}× {formatYen(p.unitCost)} = <span className="font-medium text-gray-700">{formatYen(p.quantity * p.unitCost)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="border-t border-red-50 bg-red-50/50 px-4 py-3 flex items-center justify-between gap-3 rounded-b-xl">
          <p className="text-xs text-red-600">Remove this repair job?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(job.id)}
              className="text-xs font-medium text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}