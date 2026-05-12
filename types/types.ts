export interface VehiclePurchase {
  id: string;
  vehicleId: string;
  supplierName: string;
  purchasePrice: number;
  auctionFee: number;
  warehouse: string;
  imagePreview: string | null;
  status: "Purchased" | "In Repair" | "Ready" | "Sold";
  addedAt: string; // ISO date string
}
export type RepairStatus = "Pending" | "In Progress" | "Completed" | "On Hold";

export interface RepairPart {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

export interface RepairJob {
  id: string;
  vehicleId: string;        // VIN / Chassis
  vehicleName: string;      // e.g. "Toyota Land Cruiser"
  assignedTo: string;       // mechanic name
  status: RepairStatus;
  description: string;

  laborCost: number;
  externalCharge: number;
  parts: RepairPart[];

  createdAt: string;        // ISO
  updatedAt: string;        // ISO
  completedAt?: string;     // ISO — set when status → Completed
}

export interface WorkshopStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  onHold: number;
  totalLaborCost: number;
  totalPartsCost: number;
  totalExternalCharge: number;
}