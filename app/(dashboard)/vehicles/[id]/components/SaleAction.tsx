"use client";

import { useState } from "react";
import type { VehicleStatus, TimelineEntry } from "@/types/types";
import ActionButtons from "./ActionButtons";

const CUSTOMERS = [
  { id: "c1", name: "Ahmed Al-Rashid" },
  { id: "c2", name: "Tanaka Hiroshi" },
  { id: "c3", name: "Malik Traders Ltd" },
  { id: "c4", name: "Gulf Motors LLC" },
  { id: "c5", name: "Sato Kenji" },
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
function genInvoice() { return `INV-SAL-${Date.now().toString().slice(-5)}`; }

export default function SaleAction({ enabled, setVehicleStatus, addToTimeline, updateTimelineEntry, timeline }: Props) {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [flash, setFlash] = useState("");

  const existingDraft = timeline.find((e) => e.type === "sale" && e.status === "draft");

  const saleAmount  = Number(amount)   || 0;
  const discountAmt = Number(discount) || 0;
  const total       = Math.max(0, saleAmount - discountAmt);

  // Build invoice list from timeline
  const invoiceOptions = timeline.map((e) => e.invoiceNumber).filter(Boolean);

  function validate() {
    const e: Record<string, string> = {};
    if (!customerId) e.customerId = "Required";
    if (!amount || isNaN(Number(amount))) e.amount = "Enter a valid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleDraft() {
    if (!validate()) return;
    const customer = CUSTOMERS.find((c) => c.id === customerId)!;
    const id = genId();
    addToTimeline({
      id,
      type: "sale",
      date: new Date().toISOString().split("T")[0],
      description: `Sale to ${customer.name}`,
      amount: total,
      invoiceNumber: genInvoice(),
      status: "draft",
      details: discountAmt > 0 ? `Discount: ¥${discountAmt.toLocaleString()}` : undefined,
    });
    setDraftId(id);
    setFlash("Draft created successfully");
    setTimeout(() => setFlash(""), 2500);
  }

  function handleSubmit() {
    const targetId = existingDraft?.id ?? draftId;
    if (!targetId) {
      if (!validate()) return;
      const customer = CUSTOMERS.find((c) => c.id === customerId)!;
      const id = genId();
      addToTimeline({
        id,
        type: "sale",
        date: new Date().toISOString().split("T")[0],
        description: `Sale to ${customer.name}`,
        amount: total,
        invoiceNumber: genInvoice(),
        status: "submitted",
        details: discountAmt > 0 ? `Discount: ¥${discountAmt.toLocaleString()}` : undefined,
      });
      setVehicleStatus("Sold");
      setFlash("Submitted successfully");
      setTimeout(() => setFlash(""), 2500);
      return;
    }
    updateTimelineEntry(targetId, "submitted");
    setVehicleStatus("Sold");
    setDraftId(null);
    setFlash("Submitted successfully");
    setTimeout(() => setFlash(""), 2500);
  }

  if (!enabled) {
    return <p className="text-sm text-gray-400">Vehicle must be in yard or showroom to create a sale.</p>;
  }

  return (
    <div className="space-y-4 max-w-lg">
      {existingDraft && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 text-xs text-yellow-700">
          <span className="font-medium">Draft exists</span> — you can submit it directly below.
        </div>
      )}

      {/* Customer */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Customer *</label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full h-10 rounded-lg border border-gray-200 bg-white text-sm px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all appearance-none"
        >
          <option value="" disabled>Select customer…</option>
          {CUSTOMERS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.customerId && <p className="text-[11px] text-red-400">{errors.customerId}</p>}
      </div>

      {/* Invoice reference */}
      {invoiceOptions.length > 0 && (
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Invoice (optional)</label>
          <select
            className="w-full h-10 rounded-lg border border-gray-200 bg-white text-sm px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all appearance-none"
            defaultValue=""
          >
            <option value="" disabled>Link to existing invoice…</option>
            {invoiceOptions.map((inv) => <option key={inv} value={inv}>{inv}</option>)}
          </select>
        </div>
      )}

      {/* Amount + discount */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Amount *</label>
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
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">¥</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
              className="w-full h-10 pl-7 pr-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Live total */}
      {saleAmount > 0 && (
        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
          <span className="text-xs text-gray-500">Total After Discount</span>
          <span className="text-sm font-bold text-gray-900">¥{total.toLocaleString()}</span>
        </div>
      )}

      <ActionButtons
        onDraft={handleDraft}
        onSubmit={handleSubmit}
        flash={flash}
        hasDraft={!!existingDraft}
      />
    </div>
  );
}