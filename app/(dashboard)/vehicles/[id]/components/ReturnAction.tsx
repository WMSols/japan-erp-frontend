"use client";

import { useState } from "react";
import type { VehicleStatus, TimelineEntry } from "@/types/types";
import ActionButtons from "./ActionButtons";

const RETURN_LOCATIONS = [
  "Yard A — Tokyo",
  "Yard B — Osaka",
  "Warehouse 1 — Fukuoka",
  "Showroom — Tokyo",
  "Showroom — Osaka",
];

interface Props {
  enabled: boolean;
  vehicleStatus: VehicleStatus;
  setVehicleStatus: (s: VehicleStatus) => void;
  addToTimeline: (entry: TimelineEntry) => void;
  updateTimelineEntry: (id: string, status: "submitted") => void;
  timeline: TimelineEntry[];
}

function genId() { return `t-${Date.now()}`; }
function genInvoice() { return `INV-RET-${Date.now().toString().slice(-5)}`; }

export default function ReturnAction({ enabled, setVehicleStatus, addToTimeline, updateTimelineEntry, timeline }: Props) {
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [flash, setFlash] = useState("");

  const existingDraft = timeline.find((e) => e.type === "return" && e.status === "draft");

  function validate() {
    const e: Record<string, string> = {};
    if (!location) e.location = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleDraft() {
    if (!validate()) return;
    const id = genId();
    addToTimeline({
      id,
      type: "return",
      date: new Date().toISOString().split("T")[0],
      description: `Returned from workshop to: ${location}`,
      invoiceNumber: genInvoice(),
      status: "draft",
      details: notes || undefined,
    });
    setDraftId(id);
    setFlash("Draft created successfully");
    setTimeout(() => setFlash(""), 2500);
  }

  function handleSubmit() {
    const targetId = existingDraft?.id ?? draftId;
    if (!targetId) {
      if (!validate()) return;
      const id = genId();
      addToTimeline({
        id,
        type: "return",
        date: new Date().toISOString().split("T")[0],
        description: `Returned from workshop to: ${location}`,
        invoiceNumber: genInvoice(),
        status: "submitted",
        details: notes || undefined,
      });
      setVehicleStatus("Ready");
      setFlash("Submitted successfully");
      setTimeout(() => setFlash(""), 2500);
      return;
    }
    updateTimelineEntry(targetId, "submitted");
    setVehicleStatus("Ready");
    setDraftId(null);
    setFlash("Submitted successfully");
    setTimeout(() => setFlash(""), 2500);
  }

  if (!enabled) {
    return <p className="text-sm text-gray-400">Vehicle must be in workshop to use this action.</p>;
  }

  return (
    <div className="space-y-4 max-w-lg">
      {existingDraft && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 text-xs text-yellow-700">
          <span className="font-medium">Draft exists</span> — you can submit it directly below.
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Return Location *</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full h-10 rounded-lg border border-gray-200 bg-white text-sm px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all appearance-none"
        >
          <option value="" disabled>Select yard or showroom…</option>
          {RETURN_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        {errors.location && <p className="text-[11px] text-red-400">{errors.location}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about the return…"
          rows={2}
          className="w-full rounded-lg border border-gray-200 bg-white text-sm px-3 py-2 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all resize-none"
        />
      </div>

      <ActionButtons
        onDraft={handleDraft}
        onSubmit={handleSubmit}
        flash={flash}
        hasDraft={!!existingDraft}
      />
    </div>
  );
}