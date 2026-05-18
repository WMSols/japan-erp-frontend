"use client";

import { useState } from "react";
import type { VehicleStatus, TimelineEntry } from "@/types/types";
import RepairAction from "./RepairAction";
import ReturnAction from "./ReturnAction";
import SaleAction from "./SaleAction";

interface Props {
  vehicleStatus: VehicleStatus;
  setVehicleStatus: (s: VehicleStatus) => void;
  addToTimeline: (entry: TimelineEntry) => void;
  updateTimelineEntry: (id: string, status: "submitted") => void;
  timeline: TimelineEntry[];
}

type ActionTab = "repair" | "return" | "sale";

export default function ActionsPanel({
  vehicleStatus,
  setVehicleStatus,
  addToTimeline,
  updateTimelineEntry,
  timeline,
}: Props) {
  const [activeTab, setActiveTab] = useState<ActionTab>("repair");

  const canRepair = vehicleStatus === "Purchased" || vehicleStatus === "Ready";
  const canReturn = vehicleStatus === "In Repair";
  const canSell   = vehicleStatus === "Ready" || vehicleStatus === "Purchased";

  const tabs: { id: ActionTab; label: string; enabled: boolean }[] = [
    { id: "repair", label: "Send to Workshop", enabled: canRepair },
    { id: "return", label: "Return to Yard",   enabled: canReturn },
    { id: "sale",   label: "Create Sale",       enabled: canSell   },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Actions</h2>
        <p className="text-xs text-gray-400 mt-0.5">Move vehicle through its lifecycle</p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            disabled={!tab.enabled}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex-1 py-3 text-xs font-medium transition-all border-b-2 -mb-px",
              activeTab === tab.id && tab.enabled
                ? "border-gray-900 text-gray-900"
                : "border-transparent",
              tab.enabled
                ? "text-gray-500 hover:text-gray-800"
                : "text-gray-300 cursor-not-allowed",
            ].join(" ")}
          >
            {tab.label}
            {!tab.enabled && (
              <span className="ml-1.5 text-[10px] text-gray-300">
                {tab.id === "repair" && vehicleStatus === "In Repair" ? "(In Repair)" : ""}
                {tab.id === "repair" && vehicleStatus === "Sold" ? "(Sold)" : ""}
                {tab.id === "return" && vehicleStatus !== "In Repair" ? "(Not in Workshop)" : ""}
                {tab.id === "sale"   && vehicleStatus === "In Repair" ? "(In Repair)" : ""}
                {tab.id === "sale"   && vehicleStatus === "Sold" ? "(Sold)" : ""}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === "repair" && (
          <RepairAction
            enabled={canRepair}
            vehicleStatus={vehicleStatus}
            setVehicleStatus={setVehicleStatus}
            addToTimeline={addToTimeline}
            updateTimelineEntry={updateTimelineEntry}
            timeline={timeline}
          />
        )}
        {activeTab === "return" && (
          <ReturnAction
            enabled={canReturn}
            vehicleStatus={vehicleStatus}
            setVehicleStatus={setVehicleStatus}
            addToTimeline={addToTimeline}
            updateTimelineEntry={updateTimelineEntry}
            timeline={timeline}
          />
        )}
        {activeTab === "sale" && (
          <SaleAction
            enabled={canSell}
            vehicleStatus={vehicleStatus}
            setVehicleStatus={setVehicleStatus}
            addToTimeline={addToTimeline}
            updateTimelineEntry={updateTimelineEntry}
            timeline={timeline}
          />
        )}
      </div>
    </div>
  );
}