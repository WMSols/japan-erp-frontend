// ─── Workshop Types ────────────────────────────────────────────────────────

export type RepairStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type ChargeType = "labor" | "parts" | "external";

export interface RepairCharge {
  id: string;
  type: ChargeType;
  description: string;
  quantity?: number;
  unitCost: number;
  totalCost: number;
}

export interface RepairJob {
  id: string;
  vehicleId: string;        // VIN / Chassis No.
  vehicleName: string;      // e.g. "Toyota Land Cruiser"
  vehicleImage?: string;
  status: RepairStatus;
  assignedTo: string;       // mechanic / workshop name
  startDate: string;        // ISO date string
  estimatedEndDate: string;
  actualEndDate?: string;
  description: string;      // fault description
  charges: RepairCharge[];
  notes?: string;
  // Derived
  totalCost: number;        // sum of all charges
}

export interface WorkshopStats {
  inRepair: number;
  completed: number;
  totalSpent: number;       // ¥ total repair spend this cycle
  avgRepairCost: number;
}