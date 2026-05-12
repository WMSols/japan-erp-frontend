import type { RepairJob, WorkshopStats } from '@/types/types'

export const MECHANICS = [
  "Kenji Tanaka",
  "Hiroshi Yamada",
  "Satoshi Inoue",
  "Ryo Nakamura",
  "Takeshi Abe",
];

export const SEED_JOBS: RepairJob[] = [
  {
    id: "rj-001",
    vehicleId: "JN1AAAZ32Z0000001",
    vehicleName: "Nissan Skyline GT-R",
    assignedTo: "Kenji Tanaka",
    status: "In Progress",
    description: "Full engine overhaul — replace head gasket, timing belt, and coolant flush.",
    laborCost: 85_000,
    externalCharge: 0,
    parts: [
      { id: "p1", name: "Head Gasket Set", quantity: 1, unitCost: 24_000 },
      { id: "p2", name: "Timing Belt Kit", quantity: 1, unitCost: 18_500 },
      { id: "p3", name: "Coolant 5L", quantity: 2, unitCost: 3_200 },
    ],
    createdAt: "2025-04-02T09:00:00Z",
    updatedAt: "2025-04-10T14:30:00Z",
  },
  {
    id: "rj-002",
    vehicleId: "JTDKB20U693354289",
    vehicleName: "Toyota Prius",
    assignedTo: "Hiroshi Yamada",
    status: "Pending",
    description: "Replace front bumper, left headlight unit, and realign hood panel.",
    laborCost: 35_000,
    externalCharge: 12_000,
    parts: [
      { id: "p4", name: "Front Bumper Assembly", quantity: 1, unitCost: 48_000 },
      { id: "p5", name: "Headlight Unit (L)", quantity: 1, unitCost: 22_000 },
    ],
    createdAt: "2025-04-08T11:15:00Z",
    updatedAt: "2025-04-08T11:15:00Z",
  },
  {
    id: "rj-003",
    vehicleId: "JHMCB7560SC000032",
    vehicleName: "Honda CR-V",
    assignedTo: "Satoshi Inoue",
    status: "Completed",
    description: "AC regas, cabin filter replacement, and brake pad replacement (all four corners).",
    laborCost: 28_000,
    externalCharge: 8_500,
    parts: [
      { id: "p6", name: "Brake Pad Set (Front)", quantity: 1, unitCost: 9_800 },
      { id: "p7", name: "Brake Pad Set (Rear)", quantity: 1, unitCost: 8_200 },
      { id: "p8", name: "Cabin Air Filter", quantity: 1, unitCost: 2_400 },
      { id: "p9", name: "Refrigerant R134a", quantity: 1, unitCost: 4_500 },
    ],
    createdAt: "2025-03-25T08:00:00Z",
    updatedAt: "2025-04-01T16:00:00Z",
    completedAt: "2025-04-01T16:00:00Z",
  },
  {
    id: "rj-004",
    vehicleId: "VNKKTUD33FA049421",
    vehicleName: "Toyota Alphard",
    assignedTo: "Ryo Nakamura",
    status: "On Hold",
    description: "Transmission rebuild — waiting for imported parts from dealer.",
    laborCost: 120_000,
    externalCharge: 45_000,
    parts: [
      { id: "p10", name: "Transmission Rebuild Kit", quantity: 1, unitCost: 95_000 },
    ],
    createdAt: "2025-03-30T10:00:00Z",
    updatedAt: "2025-04-05T09:00:00Z",
  },
  {
    id: "rj-005",
    vehicleId: "KMHD341BPEU000189",
    vehicleName: "Hyundai Tucson",
    assignedTo: "Takeshi Abe",
    status: "In Progress",
    description: "Full detailing, paint correction, scratch repair on rear quarter panel.",
    laborCost: 42_000,
    externalCharge: 18_000,
    parts: [
      { id: "p11", name: "Paint (Pearl White)", quantity: 2, unitCost: 8_800 },
      { id: "p12", name: "Clear Coat", quantity: 1, unitCost: 5_200 },
    ],
    createdAt: "2025-04-11T08:30:00Z",
    updatedAt: "2025-04-12T12:00:00Z",
  },
];

// ── Derived helpers ────────────────────────────────────────────────────────
export function calcPartsCost(parts: RepairJob["parts"]): number {
  return parts.reduce((acc, p) => acc + p.quantity * p.unitCost, 0);
}

export function calcTotalCost(job: RepairJob): number {
  return job.laborCost + job.externalCharge + calcPartsCost(job.parts);
}

export function deriveStats(jobs: RepairJob[]): WorkshopStats {
  return {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "Pending").length,
    inProgress: jobs.filter((j) => j.status === "In Progress").length,
    completed: jobs.filter((j) => j.status === "Completed").length,
    onHold: jobs.filter((j) => j.status === "On Hold").length,
    totalLaborCost: jobs.reduce((a, j) => a + j.laborCost, 0),
    totalPartsCost: jobs.reduce((a, j) => a + calcPartsCost(j.parts), 0),
    totalExternalCharge: jobs.reduce((a, j) => a + j.externalCharge, 0),
  };
}

export function formatYen(n: number) {
  return "¥" + n.toLocaleString();
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}