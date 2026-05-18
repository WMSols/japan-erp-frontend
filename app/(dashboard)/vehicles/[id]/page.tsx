"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import VehicleHeader from "./components/VehicleHeader";
import ActionsPanel from "./components/ActionsPanel";
import Timeline from "./components/Timeline";
import type { TimelineEntry, VehicleStatus } from "@/types/types";

// ── Mock vehicle data ──────────────────────────────────────────────────────
const MOCK_VEHICLE = {
  id: "v1",
  vehicleId: "JN1TANY31A0000001",
  vehicleName: "Nissan Patrol Y61",
  supplierName: "Yamamoto Auto Auctions",
  purchasePrice: 1200000,
  auctionFee: 60000,
  warehouse: "Yard A — Tokyo",
  imagePreview: null as string | null,
  addedAt: "2025-05-01",
};

// ── Initial timeline entry (purchase) ─────────────────────────────────────
const INITIAL_TIMELINE: TimelineEntry[] = [
  {
    id: "t-001",
    type: "purchase",
    date: "2025-05-01",
    description: "Vehicle purchased from Yamamoto Auto Auctions",
    amount: 1260000,
    invoiceNumber: "INV-PUR-001",
    status: "submitted",
  },
];

export default function VehicleDetailPage() {
  const { id } = useParams();

  const [vehicleStatus, setVehicleStatus] = useState<VehicleStatus>("Purchased");
  const [timeline, setTimeline] = useState<TimelineEntry[]>(INITIAL_TIMELINE);

  function addToTimeline(entry: TimelineEntry) {
    setTimeline((prev) => [...prev, entry]);
  }

  function updateTimelineEntry(id: string, status: "submitted") {
    setTimeline((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  }

  return (
    <div className="flex-1 min-w-0 p-6 space-y-6">
      <VehicleHeader vehicle={MOCK_VEHICLE} vehicleStatus={vehicleStatus} />

      <ActionsPanel
        vehicleStatus={vehicleStatus}
        setVehicleStatus={setVehicleStatus}
        addToTimeline={addToTimeline}
        updateTimelineEntry={updateTimelineEntry}
        timeline={timeline}
      />

      <Timeline entries={timeline} />
    </div>
  );
}