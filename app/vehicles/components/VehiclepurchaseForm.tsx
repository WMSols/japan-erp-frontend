"use client";

import { useState, useRef } from "react";
import type { VehiclePurchase } from "@/types/types";

// ── Dummy supplier data ────────────────────────────────────────────────────
const SUPPLIERS = [
  { id: "s1", name: "Yamamoto Auto Auctions" },
  { id: "s2", name: "Tokyo Motor Exchange" },
  { id: "s3", name: "Osaka USS Auctions" },
  { id: "s4", name: "Nagoya JU Dealer Co." },
  { id: "s5", name: "Fukuoka Vehicle Hub" },
  { id: "s6", name: "Kobe Direct Imports" },
];

const WAREHOUSES = [
  "Yard A — Tokyo",
  "Yard B — Osaka",
  "Workshop Bay — Nagoya",
  "Warehouse 1 — Fukuoka",
];

// ── Types ──────────────────────────────────────────────────────────────────
interface FormState {
  vehicleId: string;
  supplierId: string;
  purchasePrice: string;
  auctionFee: string;
  warehouse: string;
  imageFile: File | null;
  imagePreview: string | null;
}

const EMPTY_FORM: FormState = {
  vehicleId: "",
  supplierId: "",
  purchasePrice: "",
  auctionFee: "",
  warehouse: "",
  imageFile: null,
  imagePreview: null,
};

// ── Sub-components ─────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
      {children}
      {required && <span className="text-gray-300 ml-0.5">*</span>}
    </label>
  );
}

function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  prefix,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  prefix?: string;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium select-none">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "w-full h-10 rounded-lg border border-gray-200 bg-white text-sm text-gray-800",
          "placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10",
          "focus:border-gray-400 transition-all duration-150",
          prefix ? "pl-7 pr-3" : "px-3",
        ].join(" ")}
      />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
interface Props {
  onAdd: (purchase: Omit<VehiclePurchase, "id" | "addedAt" | "status">) => void;
}

export default function VehiclePurchaseForm({ onAdd }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imageFile: file, imagePreview: preview }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.vehicleId.trim()) e.vehicleId = "Required";
    if (!form.supplierId) e.supplierId = "Required";
    if (!form.purchasePrice || isNaN(Number(form.purchasePrice))) e.purchasePrice = "Enter a valid amount";
    if (!form.warehouse) e.warehouse = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate async

    const supplier = SUPPLIERS.find((s) => s.id === form.supplierId)!;
    onAdd({
      vehicleId: form.vehicleId.trim().toUpperCase(),
      supplierName: supplier.name,
      purchasePrice: Number(form.purchasePrice),
      auctionFee: Number(form.auctionFee) || 0,
      warehouse: form.warehouse,
      imagePreview: form.imagePreview,
    });

    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const totalCost =
    (Number(form.purchasePrice) || 0) + (Number(form.auctionFee) || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Add Vehicle Purchase</h2>
          <p className="text-xs text-gray-400 mt-0.5">Record a new acquisition to inventory</p>
        </div>
        {totalCost > 0 && (
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total Cost</p>
            <p className="text-sm font-semibold text-gray-900">
              ¥{totalCost.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Form body */}
      <div className="px-6 py-5 space-y-5">
        {/* Row 1: Vehicle ID + Supplier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>Vehicle ID</Label>
            <Input
              value={form.vehicleId}
              onChange={set("vehicleId")}
              placeholder="VIN / Chassis No."
            />
            {errors.vehicleId && (
              <p className="text-[11px] text-red-400 mt-1">{errors.vehicleId}</p>
            )}
          </div>

          <div>
            <Label required>Supplier Name</Label>
            <select
              value={form.supplierId}
              onChange={(e) => setForm((f) => ({ ...f, supplierId: e.target.value }))}
              className={[
                "w-full h-10 rounded-lg border border-gray-200 bg-white text-sm px-3",
                "text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10",
                "focus:border-gray-400 transition-all duration-150 appearance-none",
                !form.supplierId ? "text-gray-300" : "",
              ].join(" ")}
            >
              <option value="" disabled>Select supplier…</option>
              {SUPPLIERS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="text-[11px] text-red-400 mt-1">{errors.supplierId}</p>
            )}
          </div>
        </div>

        {/* Row 2: Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>Purchase Price</Label>
            <Input
              value={form.purchasePrice}
              onChange={set("purchasePrice")}
              placeholder="0"
              type="number"
              prefix="¥"
            />
            {errors.purchasePrice && (
              <p className="text-[11px] text-red-400 mt-1">{errors.purchasePrice}</p>
            )}
          </div>

          <div>
            <Label>Auction Fee</Label>
            <Input
              value={form.auctionFee}
              onChange={set("auctionFee")}
              placeholder="0"
              type="number"
              prefix="¥"
            />
          </div>
        </div>

        {/* Row 3: Warehouse */}
        <div>
          <Label required>Warehouse / Location</Label>
          <select
            value={form.warehouse}
            onChange={(e) => setForm((f) => ({ ...f, warehouse: e.target.value }))}
            className={[
              "w-full h-10 rounded-lg border border-gray-200 bg-white text-sm px-3",
              "text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10",
              "focus:border-gray-400 transition-all duration-150 appearance-none",
              !form.warehouse ? "text-gray-300" : "",
            ].join(" ")}
          >
            <option value="" disabled>Select warehouse…</option>
            {WAREHOUSES.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {errors.warehouse && (
            <p className="text-[11px] text-red-400 mt-1">{errors.warehouse}</p>
          )}
        </div>

        {/* Row 4: Image upload */}
        <div>
          <Label>Vehicle Image</Label>
          <div
            onClick={() => fileRef.current?.click()}
            className={[
              "relative flex items-center gap-4 h-20 rounded-lg border border-dashed border-gray-200",
              "bg-gray-50/50 cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all duration-150",
              "overflow-hidden",
            ].join(" ")}
          >
            {form.imagePreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imagePreview}
                  alt="preview"
                  className="h-full w-24 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-xs font-medium text-gray-700 truncate">{form.imageFile?.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Click to change</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 px-4 w-full">
                <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Upload vehicle photo</p>
                  <p className="text-[11px] text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 flex items-center justify-between gap-3">
        <button
          onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear form
        </button>

        <div className="flex items-center gap-3">
          {success && (
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Added to list
            </span>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={[
              "flex items-center gap-2 h-9 px-5 rounded-lg text-sm font-medium transition-all duration-150",
              submitting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98]",
            ].join(" ")}
          >
            {submitting ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Adding…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Purchase
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}