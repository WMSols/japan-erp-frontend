"use client";

import { useState, useEffect } from "react";
import type { SaleItem } from "@/types/types";
import { MOCK_CUSTOMERS } from "@/data/sales";
import { MOCK_VEHICLES } from "@/data/vehiclesData"
import {
  formatYen,
  computeNetRevenue,
  computeProfit,
  computeAmountDue,
  derivePaymentStatus,
  generateInvoiceNumber,
} from "../_utils/salesUtils";
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

function generateId() {
  return `SAL-${Date.now().toString().slice(-6)}`;
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface AddSaleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (sale: SaleItem) => void;
  editSale?: SaleItem | null;
  existingInvoiceNumbers: string[];
}

interface FormState {
  vehicleId: string;
  vehicleName: string;
  channel: SaleItem["channel"];
  status: SaleItem["status"];
  saleDate: string;
  sellingPrice: string;
  commission: string;
  discount: string;
  totalCost: string;
  customerId: string;
  customerName: string;
  amountPaid: string;
  notes: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function AddSaleModal({
  open,
  onClose,
  onSave,
  editSale,
  existingInvoiceNumbers,
}: AddSaleModalProps) {
  const isEdit = !!editSale;
  const availableVehicles = MOCK_VEHICLES.filter(
  (v) => v.location === "yard" || v.location === "showroom"
)

  const defaultForm: FormState = {
    vehicleId: "",
    vehicleName: "",
    channel: "direct",
    status: "pending",
    saleDate: new Date().toISOString().split("T")[0],
    sellingPrice: "",
    commission: "0",
    discount: "0",
    totalCost: "",
    customerId: "",
    customerName: "",
    amountPaid: "0",
    notes: "",
  };

  const [form, setForm] = useState<FormState>(defaultForm);

  useEffect(() => {
    if (editSale) {
      setForm({
        vehicleId: editSale.vehicleId,
        vehicleName: editSale.vehicleName,
        channel: editSale.channel,
        status: editSale.status,
        saleDate: editSale.saleDate,
        sellingPrice: String(editSale.sellingPrice),
        commission: String(editSale.commission),
        discount: String(editSale.discount),
        totalCost: String(editSale.totalCost),
        customerId: editSale.customerId,
        customerName: editSale.customerName,
        amountPaid: String(editSale.amountPaid),
        notes: editSale.notes ?? "",
      });
    } else {
      setForm(defaultForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSale, open]);

  // ── Live calculated values ──────────────────────────────────────────────

  const sp = parseFloat(form.sellingPrice) || 0;
  const comm = parseFloat(form.commission) || 0;
  const disc = parseFloat(form.discount) || 0;
  const cost = parseFloat(form.totalCost) || 0;
  const paid = parseFloat(form.amountPaid) || 0;

  const netRevenue = computeNetRevenue(sp, comm, disc);
  const profit = computeProfit(netRevenue, cost);
  const amountDue = computeAmountDue(netRevenue, paid);
  const paymentStatus = derivePaymentStatus(netRevenue, paid);

  // ── Helpers ─────────────────────────────────────────────────────────────

  function set(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCustomerSelect(customerId: string) {
    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    setForm((prev) => ({
      ...prev,
      customerId,
      customerName: customer?.name ?? "",
    }));
  }
  function handleVehicleByVin(vin: string) {
  const vehicle = availableVehicles.find((v) => v.id === vin);
  setForm((prev) => ({
    ...prev,
    vehicleId: vin,
    vehicleName: vehicle?.name ?? "",
  }));
}

function handleVehicleByName(name: string) {
  const vehicle = availableVehicles.find((v) => v.name === name);
  setForm((prev) => ({
    ...prev,
    vehicleName: name,
    vehicleId: vehicle?.id ?? "",
  }));
}

  function handleSave() {
    const netRev = computeNetRevenue(sp, comm, disc);
    const sale: SaleItem = {
      id: editSale?.id ?? generateId(),
      vehicleId: form.vehicleId.trim(),
      vehicleName: form.vehicleName.trim(),
      channel: form.channel,
      status: form.status,
      saleDate: form.saleDate,
      sellingPrice: sp,
      commission: comm,
      discount: disc,
      netRevenue: netRev,
      totalCost: cost,
      profit: computeProfit(netRev, cost),
      customerId: form.customerId,
      customerName: form.customerName.trim(),
      paymentStatus: derivePaymentStatus(netRev, paid),
      amountPaid: paid,
      amountDue: computeAmountDue(netRev, paid),
      invoiceNumber: editSale?.invoiceNumber ?? generateInvoiceNumber(existingInvoiceNumbers),
      notes: form.notes.trim() || undefined,
    };
    onSave(sale);
    onClose();
  }

  const isValid =
    form.vehicleId.trim() &&
    form.vehicleName.trim() &&
    form.sellingPrice &&
    form.customerName.trim() &&
    form.saleDate;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
       aria-describedby="Add sale modal"
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? "Edit Sale" : "Record New Sale"}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? "Update sale details." : "Log a vehicle sale with full financial breakdown."}
          </p>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
       {/* ── Vehicle ── */}
<section>
  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
    Vehicle
  </h3>
  <div className="grid grid-cols-1 gap-4">
    {/* VIN dropdown */}
    <div className="space-y-1.5">
      <Label className="text-xs">VIN / Chassis No. *</Label>
      <Select value={form.vehicleId} onValueChange={handleVehicleByVin}>
        <SelectTrigger className="h-9 text-sm font-mono">
          <SelectValue placeholder="Select VIN..." />
        </SelectTrigger>
        <SelectContent>
          {availableVehicles.map((v) => (
            <SelectItem key={v.id} value={v.id} className="text-sm font-mono">
              <span className="font-mono">{v.id}</span>
              <span className="ml-2 text-[10px] text-gray-400 font-sans normal-case">
                {v.locationLabel}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Vehicle Name dropdown */}
    <div className="space-y-1.5">
      <Label className="text-xs">Vehicle Name *</Label>
      <Select value={form.vehicleName} onValueChange={handleVehicleByName}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Select vehicle..." />
        </SelectTrigger>
        <SelectContent>
          {availableVehicles.map((v) => (
            <SelectItem key={v.id} value={v.name} className="text-sm">
              {v.name}
              <span className="ml-2 text-[10px] text-gray-400">
                — {v.locationLabel}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>

  {/* Location badge — shown once a vehicle is selected */}
  {form.vehicleId && (() => {
    const selected = availableVehicles.find((v) => v.id === form.vehicleId);
    if (!selected) return null;
    const isShowroom = selected.location === "showroom";
    return (
      <p className="mt-2 text-[11px] text-gray-500">
        📍 Location:{" "}
        <span className={`font-medium ${isShowroom ? "text-blue-600" : "text-amber-600"}`}>
          {selected.locationLabel}
        </span>
        <span className="ml-1.5 capitalize text-gray-400">({selected.location})</span>
      </p>
    );
  })()}
</section>

          {/* ── Sale Details ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sale Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Channel</Label>
                <Select value={form.channel} onValueChange={(v) => set("channel", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="auction">Auction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sale Date *</Label>
                <Input
                  type="date"
                  value={form.saleDate}
                  onChange={(e) => set("saleDate", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </section>

          {/* ── Financials ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Financials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Selling Price (¥) *</Label>
                <Input
                  type="number" min={0}
                  placeholder="0"
                  value={form.sellingPrice}
                  onChange={(e) => set("sellingPrice", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Total Cost (¥)</Label>
                <Input
                  type="number" min={0}
                  placeholder="0"
                  value={form.totalCost}
                  onChange={(e) => set("totalCost", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Commission (¥)</Label>
                <Input
                  type="number" min={0}
                  value={form.commission}
                  onChange={(e) => set("commission", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Discount (¥)</Label>
                <Input
                  type="number" min={0}
                  value={form.discount}
                  onChange={(e) => set("discount", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            {/* Live summary */}
            <div className="mt-4 rounded-lg bg-gray-50 border border-gray-100 p-3 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Net Revenue</p>
                <p className="text-sm font-semibold text-gray-900">{formatYen(netRevenue)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Gross Profit</p>
                <p className={`text-sm font-bold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {profit >= 0 ? "+" : ""}{formatYen(profit)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Amount Due</p>
                <p className={`text-sm font-semibold ${amountDue > 0 ? "text-orange-600" : "text-gray-900"}`}>
                  {formatYen(amountDue)}
                </p>
              </div>
            </div>
          </section>

          {/* ── Customer & Payment ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Customer & Payment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Select Customer</Label>
                <Select value={form.customerId} onValueChange={handleCustomerSelect}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Choose existing..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CUSTOMERS.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-sm">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Customer Name *</Label>
                <Input
                  placeholder="Or type name manually"
                  value={form.customerName}
                  onChange={(e) => set("customerName", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs">Amount Paid (¥)</Label>
                <Input
                  type="number" min={0}
                  value={form.amountPaid}
                  onChange={(e) => set("amountPaid", e.target.value)}
                  className="h-9 text-sm"
                />
                <p className="text-[10px] text-gray-400">
                  Payment status will auto-set to:{" "}
                  <span className="font-medium capitalize">{paymentStatus}</span>
                </p>
              </div>
            </div>
          </section>

          {/* ── Notes ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Notes (optional)</h3>
            <Textarea
              placeholder="Any additional notes about this sale..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="text-sm resize-none"
              rows={2}
            />
          </section>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="text-sm h-9">Cancel</Button>
          <Button
            disabled={!isValid}
            onClick={handleSave}
            className="text-sm h-9 bg-gray-900 text-white hover:bg-gray-800"
          >
            {isEdit ? "Save Changes" : "Record Sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}