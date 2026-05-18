"use client";

import { useState, useEffect } from "react";
import type { RepairJob, RepairCharge, ChargeType } from "@/types/workShopTypes";
import { formatYen, CHARGE_TYPE_CONFIG } from "../utils/workshopUtils";
import { MECHANICS } from "@/data/workshop";
import { X, Plus, Trash2 } from "lucide-react";
import { PURCHASED_VEHICLES } from "@/data/vehiclesData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ─── Helper ────────────────────────────────────────────────────────────────

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function emptyCharge(): RepairCharge {
  return {
    id: generateId("CHG"),
    type: "labor",
    description: "",
    quantity: 1,
    unitCost: 0,
    totalCost: 0,
  };
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface AddRepairJobModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (job: RepairJob) => void;
  editJob?: RepairJob | null;
}

type FormData = {
  vehicleId: string;
  vehicleName: string;
  assignedTo: string;
  startDate: string;
  estimatedEndDate: string;
  description: string;
  notes: string;
  status: RepairJob["status"];
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function AddRepairJobModal({
  open,
  onClose,
  onSave,
  editJob,
}: AddRepairJobModalProps) {
  const isEdit = !!editJob;

  const defaultForm: FormData = {
    vehicleId: "",
    vehicleName: "",
    assignedTo: "In-house",
    startDate: new Date().toISOString().split("T")[0],
    estimatedEndDate: "",
    description: "",
    notes: "",
    status: "pending",
  };

  const [form, setForm] = useState<FormData>(defaultForm);
  const [charges, setCharges] = useState<RepairCharge[]>([emptyCharge()]);

  // Populate form when editing
  useEffect(() => {
    if (editJob) {
      setForm({
        vehicleId: editJob.vehicleId,
        vehicleName: editJob.vehicleName,
        assignedTo: editJob.assignedTo,
        startDate: editJob.startDate,
        estimatedEndDate: editJob.estimatedEndDate,
        description: editJob.description,
        notes: editJob.notes ?? "",
        status: editJob.status,
      });
      setCharges(editJob.charges.length > 0 ? editJob.charges : [emptyCharge()]);
    } else {
      setForm(defaultForm);
      setCharges([emptyCharge()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editJob, open]);

  const totalCost = charges.reduce((s, c) => s + c.totalCost, 0);

  // ── Charge helpers ──────────────────────────────────────────────────────

  function updateCharge<K extends keyof RepairCharge>(
    id: string,
    key: K,
    value: RepairCharge[K]
  ) {
    setCharges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, [key]: value };
        // Auto-recalc totalCost when qty or unitCost changes
        if (key === "quantity" || key === "unitCost") {
          const qty = key === "quantity" ? Number(value) : Number(updated.quantity ?? 1);
          const unit = key === "unitCost" ? Number(value) : Number(updated.unitCost);
          updated.totalCost = qty * unit;
        }
        return updated;
      })
    );
  }

  function addCharge() {
    setCharges((prev) => [...prev, emptyCharge()]);
  }

  function removeCharge(id: string) {
    setCharges((prev) => prev.filter((c) => c.id !== id));
  }

  // ── Submit ──────────────────────────────────────────────────────────────

  function handleSave() {
    const filledCharges = charges.filter((c) => c.description.trim() !== "");
    const job: RepairJob = {
      id: editJob?.id ?? generateId("WO"),
      ...form,
      charges: filledCharges,
      totalCost: filledCharges.reduce((s, c) => s + c.totalCost, 0),
    };
    onSave(job);
    onClose();
  }

  const isValid =
    form.vehicleId.trim() &&
    form.vehicleName.trim() &&
    form.estimatedEndDate &&
    form.description.trim();

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <Dialog  open={open} onOpenChange={onClose}>
      <DialogContent
      aria-describedby="Repair job adding modal"
      className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? "Edit Repair Job" : "New Repair Job"}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? "Update the repair job details and charges." : "Log a new workshop repair for a vehicle."}
          </p>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
         {/* ── Vehicle Info ── */}
<section>
  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
    Vehicle Info
  </h3>
  <div className="grid grid-cols-2 gap-4">
    {/* VIN dropdown */}
    <div className="space-y-1.5">
      <Label className="text-xs">VIN / Chassis No. *</Label>
      <Select
        value={form.vehicleId}
        onValueChange={(selectedVin) => {
          const match = PURCHASED_VEHICLES.find((v) => v.vehicleId === selectedVin);
          setForm({
            ...form,
            vehicleId: selectedVin,
            vehicleName: match?.vehicleName ?? "",
          });
        }}
      >
        <SelectTrigger className="h-9 text-sm font-mono">
          <SelectValue placeholder="Select VIN…" />
        </SelectTrigger>
        <SelectContent>
          {PURCHASED_VEHICLES.map((v) => (
            <SelectItem key={v.vehicleId} value={v.vehicleId} className="text-sm font-mono">
              <div className="flex flex-col">
                <span>{v.vehicleId}</span>
                <span className="text-[10px] text-gray-400 font-sans">{v.location}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Vehicle name dropdown */}
    <div className="space-y-1.5">
      <Label className="text-xs">Vehicle Name *</Label>
      <Select
        value={form.vehicleName}
        onValueChange={(selectedName) => {
          const match = PURCHASED_VEHICLES.find((v) => v.vehicleName === selectedName);
          setForm({
            ...form,
            vehicleName: selectedName,
            vehicleId: match?.vehicleId ?? "",
          });
        }}
      >
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Select vehicle…" />
        </SelectTrigger>
        <SelectContent>
          {PURCHASED_VEHICLES.map((v) => (
            <SelectItem key={v.vehicleId} value={v.vehicleName} className="text-sm">
              <div className="flex flex-col">
                <span>{v.vehicleName}</span>
                <span className="text-[10px] text-gray-400">{v.location}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>

  {/* Show selected vehicle location as a hint */}
  {form.vehicleId && (
    <p className="text-[11px] text-gray-400 mt-2">
      📍 {PURCHASED_VEHICLES.find((v) => v.vehicleId === form.vehicleId)?.location ?? ""}
    </p>
  )}
</section>

          {/* ── Job Details ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Job Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Fault / Work Description *</Label>
                <Textarea
                  placeholder="Describe the repair work required..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="text-sm resize-none"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Assigned To</Label>
                  <Select
                    value={form.assignedTo}
                    onValueChange={(v) => setForm({ ...form, assignedTo: v })}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MECHANICS.map((m) => (
                        <SelectItem key={m} value={m} className="text-sm">
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Start Date</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Est. End Date *</Label>
                  <Input
                    type="date"
                    value={form.estimatedEndDate}
                    onChange={(e) => setForm({ ...form, estimatedEndDate: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              {isEdit && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v as RepairJob["status"] })}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </section>

          {/* ── Charges ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Charges
              </h3>
              <button
                onClick={addCharge}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line
              </button>
            </div>

            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-[1fr_90px_90px_90px_32px] gap-2 text-[10px] font-medium text-gray-400 uppercase tracking-wider px-1">
                <span>Description</span>
                <span>Type</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Unit (¥)</span>
                <span />
              </div>

              {charges.map((charge) => (
                <div key={charge.id} className="grid grid-cols-[1fr_90px_90px_90px_32px] gap-2 items-center">
                  <Input
                    placeholder="e.g. Oil seal replacement"
                    value={charge.description}
                    onChange={(e) => updateCharge(charge.id, "description", e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Select
                    value={charge.type}
                    onValueChange={(v) => updateCharge(charge.id, "type", v as ChargeType)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="labor" className="text-xs">Labor</SelectItem>
                      <SelectItem value="parts" className="text-xs">Parts</SelectItem>
                      <SelectItem value="external" className="text-xs">External</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={charge.quantity ?? ""}
                    onChange={(e) => updateCharge(charge.id, "quantity", parseFloat(e.target.value) || 0)}
                    className="h-8 text-xs text-right"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={charge.unitCost || ""}
                    onChange={(e) => updateCharge(charge.id, "unitCost", parseFloat(e.target.value) || 0)}
                    className="h-8 text-xs text-right"
                  />
                  <button
                    onClick={() => removeCharge(charge.id)}
                    disabled={charges.length === 1}
                    className="flex items-center justify-center w-8 h-8 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Running total */}
            <div className="mt-3 flex justify-end">
              <div className="text-right">
                <p className="text-xs text-gray-400">Estimated Total</p>
                <p className="text-base font-bold text-gray-900">{formatYen(totalCost)}</p>
              </div>
            </div>
          </section>

          {/* ── Notes ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Notes (optional)
            </h3>
            <Textarea
              placeholder="Any additional notes, waiting on parts, etc."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="text-sm resize-none"
              rows={2}
            />
          </section>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="text-sm h-9">
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            onClick={handleSave}
            className="text-sm h-9 bg-gray-900 text-white hover:bg-gray-800"
          >
            {isEdit ? "Save Changes" : "Log Repair Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}