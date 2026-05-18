"use client";

import type { VehicleStatus } from "@/types/types";

const STATUS_CONFIG: Record<VehicleStatus, { label: string; className: string; dot: string }> = {
  Purchased:  { label: "Purchased",  className: "bg-blue-50 text-blue-700 border-blue-200",   dot: "bg-blue-400" },
  "In Repair":{ label: "In Repair",  className: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  Ready:      { label: "Ready",      className: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  Sold:       { label: "Sold",       className: "bg-gray-100 text-gray-500 border-gray-200",   dot: "bg-gray-400" },
};

interface Vehicle {
  vehicleId: string;
  vehicleName?: string;
  supplierName: string;
  purchasePrice: number;
  auctionFee: number;
  warehouse: string;
  imagePreview: string | null;
  addedAt: string;
}

interface Props {
  vehicle: Vehicle;
  vehicleStatus: VehicleStatus;
}

function formatYen(n: number) {
  return "¥" + n.toLocaleString();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function VehicleHeader({ vehicle, vehicleStatus }: Props) {
  const statusCfg = STATUS_CONFIG[vehicleStatus];
  const totalCost = vehicle.purchasePrice + vehicle.auctionFee;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Left — identity */}
        <div className="flex items-start gap-4">
          {/* Thumbnail */}
          <div className="w-16 h-12 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
            {vehicle.imagePreview ? (
              <img src={vehicle.imagePreview} alt={vehicle.vehicleId} className="w-full h-full object-cover" />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200">
                <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
              </svg>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold text-gray-900">
                {vehicle.vehicleName ?? vehicle.vehicleId}
              </h1>
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${statusCfg.className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{vehicle.vehicleId}</p>
            <p className="text-xs text-gray-400 mt-1">{vehicle.supplierName} · {vehicle.warehouse}</p>
          </div>
        </div>

        {/* Right — financials */}
        <div className="flex items-start gap-6 flex-wrap text-right">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Purchase Price</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatYen(vehicle.purchasePrice)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Auction Fee</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatYen(vehicle.auctionFee)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total Cost</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{formatYen(totalCost)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Purchased</p>
            <p className="text-sm text-gray-600 mt-0.5">{formatDate(vehicle.addedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}