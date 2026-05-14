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
