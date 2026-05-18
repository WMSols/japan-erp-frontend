"use client";

import { useState } from "react";
import type { VehicleStatus, TimelineEntry } from "@/types/types";
import ActionButtons from "./ActionButtons";

const WORKSHOPS = [
  "Tanaka Auto Workshop — Tokyo",
  "Yamamoto Garage — Osaka",
  "AutoCool Ltd — Nagoya",
  "Suzuki Paint Works — Kobe",
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
function genInvoice() { return `INV-REP-${Date.now().toString().slice(-5)}`; }

export default function RepairAction({ enabled, setVehicleStatus, addToTimeline, updateTimelineEntry, timeline }: Props) {
  const [workshop, setWorkshop] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [flash, setFlash] = useState("");

  // Find existing draft for this action type
  const existingDraft = timeline.find((e) => e.type === "repair" && e.status === "draft");

  function validate() {
    const e: Record<string, string> = {};
    if (!workshop) e.workshop = "Required";
    if (!amount || isNaN(Number(amount))) e.amount = "Enter a valid amount";
    if (!details.trim()) e.details = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleDraft() {
    if (!validate()) return;
    const id = genId();
    addToTimeline({
      id,
      type: "repair",
      date: new Date().toISOString().split("T")[0],
      description: `Move to workshop: ${workshop}`,
      amount: Number(amount),
      invoiceNumber: genInvoice(),
      status: "draft",
      details,
    });
    setDraftId(id);
    setFlash("Draft created successfully");
    setTimeout(() => setFlash(""), 2500);
  }

  function handleSubmit() {
    const targetId = existingDraft?.id ?? draftId;
    if (!targetId) {
      if (!validate()) return;
      // No draft — create and submit directly
      const id = genId();
      addToTimeline({
        id,
        type: "repair",
        date: new Date().toISOString().split("T")[0],
        description: `Move to workshop: ${workshop}`,
        amount: Number(amount),
        invoiceNumber: genInvoice(),
        status: "submitted",
        details,
      });
      setVehicleStatus("In Repair");
      setFlash("Submitted successfully");
      setTimeout(() => setFlash(""), 2500);
      return;
    }
    updateTimelineEntry(targetId, "submitted");
    setVehicleStatus("In Repair");
    setDraftId(null);
    setFlash("Submitted successfully");
    setTimeout(() => setFlash(""), 2500);
  }

  if (!enabled) {
    return <p className="text-sm text-gray-400">Not available in current vehicle status.</p>;
  }

  return (
    <div className="space-y-4 max-w-lg">
      {existingDraft && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 text-xs text-yellow-700">
          <span className="font-medium">Draft exists</span> — you can submit it directly below.
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Workshop *</label>
        <select
          value={workshop}
          onChange={(e) => setWorkshop(e.target.value)}
          className="w-full h-10 rounded-lg border border-gray-200 bg-white text-sm px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all appearance-none"
        >
          <option value="" disabled>Select workshop…</option>
          {WORKSHOPS.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
        {errors.workshop && <p className="text-[11px] text-red-400">{errors.workshop}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Repair Amount *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">¥</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full h-10 pl-7 pr-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
          />
        </div>
        {errors.amount && <p className="text-[11px] text-red-400">{errors.amount}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Repair Details *</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe the repair work required…"
          rows={3}
          className="w-full rounded-lg border border-gray-200 bg-white text-sm px-3 py-2 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all resize-none"
        />
        {errors.details && <p className="text-[11px] text-red-400">{errors.details}</p>}
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