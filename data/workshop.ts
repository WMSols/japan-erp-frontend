import type { RepairJob } from "@/types/workShopTypes";

// ─── Mock Repair Jobs ──────────────────────────────────────────────────────

export const MOCK_REPAIR_JOBS: RepairJob[] = [
  {
    id: "WO-001",
    vehicleId: "JN1TANY31A0000001",
    vehicleName: "Nissan Patrol Y61",
    status: "in_progress",
    assignedTo: "Tanaka Auto Workshop",
    startDate: "2025-05-01",
    estimatedEndDate: "2025-05-12",
    description: "Engine oil leak, front brake pads replacement, AC recharge",
    charges: [
      { id: "c1", type: "labor", description: "Engine inspection & oil seal replacement", quantity: 4, unitCost: 8000, totalCost: 32000 },
      { id: "c2", type: "parts", description: "Oil seal kit", quantity: 1, unitCost: 12000, totalCost: 12000 },
      { id: "c3", type: "parts", description: "Front brake pads (set)", quantity: 1, unitCost: 9500, totalCost: 9500 },
      { id: "c4", type: "labor", description: "Brake pad installation", quantity: 1.5, unitCost: 6000, totalCost: 9000 },
      { id: "c5", type: "external", description: "AC system recharge – AutoCool Ltd", quantity: 1, unitCost: 15000, totalCost: 15000 },
    ],
    totalCost: 77500,
    notes: "Waiting for oil seal kit delivery – expected May 10",
  },
  {
    id: "WO-002",
    vehicleId: "JTMBE33V585007842",
    vehicleName: "Toyota Land Cruiser 200",
    status: "completed",
    assignedTo: "Yamamoto Garage",
    startDate: "2025-04-18",
    estimatedEndDate: "2025-04-25",
    actualEndDate: "2025-04-24",
    description: "Full body respray, rust treatment underbody",
    charges: [
      { id: "c6", type: "external", description: "Full body respray – Suzuki Paint Works", quantity: 1, unitCost: 95000, totalCost: 95000 },
      { id: "c7", type: "labor", description: "Rust treatment & underbody seal", quantity: 8, unitCost: 7500, totalCost: 60000 },
      { id: "c8", type: "parts", description: "Underbody sealant & primer", quantity: 3, unitCost: 4800, totalCost: 14400 },
    ],
    totalCost: 169400,
  },
  {
    id: "WO-003",
    vehicleId: "KNDJN2A2XD7567294",
    vehicleName: "Kia Sportage 2013",
    status: "pending",
    assignedTo: "In-house",
    startDate: "2025-05-10",
    estimatedEndDate: "2025-05-18",
    description: "Gearbox service, tyres replacement x4, interior deep clean",
    charges: [
      { id: "c9", type: "labor", description: "Gearbox service", quantity: 6, unitCost: 7000, totalCost: 42000 },
      { id: "c10", type: "parts", description: "ATF fluid & filter", quantity: 1, unitCost: 8500, totalCost: 8500 },
      { id: "c11", type: "parts", description: "Tyres 235/60R17 x4", quantity: 4, unitCost: 18000, totalCost: 72000 },
      { id: "c12", type: "external", description: "Interior detail – CleanPro", quantity: 1, unitCost: 12000, totalCost: 12000 },
    ],
    totalCost: 134500,
    notes: "Waiting for tyre stock confirmation",
  },
  {
    id: "WO-004",
    vehicleId: "1HGCM82633A004352",
    vehicleName: "Honda Accord 2015",
    status: "completed",
    assignedTo: "In-house",
    startDate: "2025-04-10",
    estimatedEndDate: "2025-04-14",
    actualEndDate: "2025-04-13",
    description: "Engine tune-up, spark plugs, air filter",
    charges: [
      { id: "c13", type: "labor", description: "Tune-up service", quantity: 3, unitCost: 6500, totalCost: 19500 },
      { id: "c14", type: "parts", description: "Spark plugs x4", quantity: 4, unitCost: 1200, totalCost: 4800 },
      { id: "c15", type: "parts", description: "Air filter", quantity: 1, unitCost: 3200, totalCost: 3200 },
    ],
    totalCost: 27500,
  },
];

export const MECHANICS = [
  "In-house",
  "Tanaka Auto Workshop",
  "Yamamoto Garage",
  "AutoCool Ltd",
  "Suzuki Paint Works",
  "CleanPro",
];

export const CHARGE_TYPE_LABELS: Record<string, string> = {
  labor: "Labor",
  parts: "Parts",
  external: "External",
};