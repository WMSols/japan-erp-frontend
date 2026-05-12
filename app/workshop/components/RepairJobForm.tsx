"use client";

import { useState } from "react";
import type { RepairJob, RepairPart } from "@/types/types";
import { MECHANICS, formatYen } from "@/data/workshop";
import { nanoid } from "nanoid"; // or replace with Date.now() if nanoid not installed

// ── shadcn primitives (adjust import paths to your project structure) ──────
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ── Types ──────────────────────────────────────────────────────────────────
type FormData = {
  vehicleId: string;
  vehicleName: string;
  assignedTo: string;
  description: string;
  laborCost: string;
  externalCharge: string;
};

const EMPTY_FORM: FormData = {
  vehicleId: "",
  vehicleName: "",
  assignedTo: "",
  description: "",
  laborCost: "",
  externalCharge: "",
};

type PartDraft = { name: string; quantity: string; unitCost: string };
const EMPTY_PART: PartDraft = { name: "", quantity: "1", unitCost: "" };

// ── Parts sub-form ─────────────────────────────────────────────────────────
function PartsEditor({
  parts,
  onChange,
}: {
  parts: RepairPart[];
  onChange: (parts: RepairPart[]) => void;
}) {
  const [draft, setDraft] = useState<PartDraft>(EMPTY_PART);
  const [draftError, setDraftError] = useState("");

  const addPart = () => {
    if (!draft.name.trim()) { setDraftError("Part name is required"); return; }
    if (!draft.unitCost || isNaN(Number(draft.unitCost))) { setDraftError("Enter a valid unit cost"); return; }
    onChange([
      ...parts,
      {
        id: `p_${Date.now()}`,
        name: draft.name.trim(),
        quantity: Math.max(1, Number(draft.quantity) || 1),
        unitCost: Number(draft.unitCost),
      },
    ]);
    setDraft(EMPTY_PART);
    setDraftError("");
  };

  const removePart = (id: string) => onChange(parts.filter((p) => p.id !== id));

  const totalParts = parts.reduce((a, p) => a + p.quantity * p.unitCost, 0);

  return (
    <div className="space-y-3 ">
      {/* Existing parts */}
      {parts.length > 0 && (
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Part</th>
                <th className="text-right px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Qty</th>
                <th className="text-right px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Unit</th>
                <th className="text-right px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Total</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-2 text-gray-700">{p.name}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{p.quantity}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{formatYen(p.unitCost)}</td>
                  <td className="px-3 py-2 text-right font-medium text-gray-800">{formatYen(p.quantity * p.unitCost)}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => removePart(p.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end px-3 py-2 bg-gray-50 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-700">Parts Total: {formatYen(totalParts)}</span>
          </div>
        </div>
      )}

      {/* Add part row */}
      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-5">
          <Label className="text-xs text-gray-500 mb-1 block">Part Name</Label>
          <Input
            placeholder="e.g. Brake Pad Set"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="h-9 text-sm"
          />
        </div>
        <div className="col-span-2">
          <Label className="text-xs text-gray-500 mb-1 block">Qty</Label>
          <Input
            type="number"
            min={1}
            value={draft.quantity}
            onChange={(e) => setDraft((d) => ({ ...d, quantity: e.target.value }))}
            className="h-9 text-sm"
          />
        </div>
        <div className="col-span-3">
          <Label className="text-xs text-gray-500 mb-1 block">Unit Cost (¥)</Label>
          <Input
            type="number"
            placeholder="0"
            value={draft.unitCost}
            onChange={(e) => setDraft((d) => ({ ...d, unitCost: e.target.value }))}
            className="h-9 text-sm"
          />
        </div>
        <div className="col-span-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full h-9 text-xs"
            onClick={addPart}
          >
            + Add
          </Button>
        </div>
      </div>
      {draftError && <p className="text-[11px] text-red-400">{draftError}</p>}
    </div>
  );
}

// ── Main form dialog ───────────────────────────────────────────────────────
interface Props {
  onAdd: (job: RepairJob) => void;
}

export default function RepairJobForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [parts, setParts] = useState<RepairPart[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof FormData) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.vehicleId.trim()) e.vehicleId = "Required";
    if (!form.vehicleName.trim()) e.vehicleName = "Required";
    if (!form.assignedTo) e.assignedTo = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (form.laborCost && isNaN(Number(form.laborCost))) e.laborCost = "Invalid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const now = new Date().toISOString();
    onAdd({
      id: `rj-${Date.now()}`,
      vehicleId: form.vehicleId.trim().toUpperCase(),
      vehicleName: form.vehicleName.trim(),
      assignedTo: form.assignedTo,
      status: "Pending",
      description: form.description.trim(),
      laborCost: Number(form.laborCost) || 0,
      externalCharge: Number(form.externalCharge) || 0,
      parts,
      createdAt: now,
      updatedAt: now,
    });
    setForm(EMPTY_FORM);
    setParts([]);
    setErrors({});
    setSubmitting(false);
    setOpen(false);
  };

  const totalPreview =
    (Number(form.laborCost) || 0) +
    (Number(form.externalCharge) || 0) +
    parts.reduce((a, p) => a + p.quantity * p.unitCost, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1.5 bg-gray-900 hover:bg-gray-700 text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Repair Job
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby="Repair adding form" className="max-w-2xl max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Create Repair Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Vehicle details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">Vehicle ID <span className="text-red-400">*</span></Label>
              <Input
                placeholder="VIN / Chassis No."
                value={form.vehicleId}
                onChange={(e) => set("vehicleId")(e.target.value)}
                className="h-10"
              />
              {errors.vehicleId && <p className="text-[11px] text-red-400">{errors.vehicleId}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">Vehicle Name <span className="text-red-400">*</span></Label>
              <Input
                placeholder="e.g. Toyota Land Cruiser"
                value={form.vehicleName}
                onChange={(e) => set("vehicleName")(e.target.value)}
                className="h-10"
              />
              {errors.vehicleName && <p className="text-[11px] text-red-400">{errors.vehicleName}</p>}
            </div>
          </div>

          {/* Assign mechanic */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500 uppercase tracking-wide">Assigned Mechanic <span className="text-red-400">*</span></Label>
            <Select value={form.assignedTo} onValueChange={set("assignedTo")}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select mechanic…" />
              </SelectTrigger>
              <SelectContent>
                {MECHANICS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assignedTo && <p className="text-[11px] text-red-400">{errors.assignedTo}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500 uppercase tracking-wide">Repair Description <span className="text-red-400">*</span></Label>
            <Textarea
              placeholder="Describe the repair work to be done…"
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              rows={3}
              className="resize-none"
            />
            {errors.description && <p className="text-[11px] text-red-400">{errors.description}</p>}
          </div>

          {/* Costs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">Labor Cost (¥)</Label>
              <Input
                type="number"
                placeholder="0"
                value={form.laborCost}
                onChange={(e) => set("laborCost")(e.target.value)}
                className="h-10"
              />
              {errors.laborCost && <p className="text-[11px] text-red-400">{errors.laborCost}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500 uppercase tracking-wide">External Charge (¥)</Label>
              <Input
                type="number"
                placeholder="0"
                value={form.externalCharge}
                onChange={(e) => set("externalCharge")(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <Separator />

          {/* Parts */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-500 uppercase tracking-wide">Parts Used</Label>
            <PartsEditor parts={parts} onChange={setParts} />
          </div>

          <Separator />

          {/* Footer summary + submit */}
          <div className="flex items-center justify-between gap-4">
            {totalPreview > 0 && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Estimated Total</p>
                <p className="text-sm font-semibold text-gray-900">{formatYen(totalPreview)}</p>
              </div>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-gray-900 hover:bg-gray-700 text-white"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Creating…" : "Create Job"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}