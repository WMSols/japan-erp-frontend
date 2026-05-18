// ── Purchased vehicles available for repair assignment ─────────────────────
// Only vehicles currently in yards or warehouses (not in workshop, not sold)

export interface PurchasedVehicle {
  vehicleId: string;
  vehicleName: string;
  location: string;
}

export const PURCHASED_VEHICLES: PurchasedVehicle[] = [
  { vehicleId: "JN1TANY31A0000001", vehicleName: "Nissan Patrol Y61",        location: "Yard A — Tokyo" },
  { vehicleId: "KNDJN2A2XD7567294", vehicleName: "Kia Sportage 2013",         location: "Yard B — Osaka" },
  { vehicleId: "JN8AZ2NE5C9012345", vehicleName: "Nissan X-Trail 2012",       location: "Yard A — Tokyo" },
  { vehicleId: "KMHD35LE5HU123456", vehicleName: "Hyundai Elantra 2017",      location: "Warehouse B — Nagoya" },
  { vehicleId: "WBA3A5G59DNP26082", vehicleName: "BMW 3 Series 2013",         location: "Warehouse 1 — Fukuoka" },
  { vehicleId: "1HGBG2E86FA123456", vehicleName: "Honda Civic 2015",          location: "Yard B — Osaka" },
];
// vehicles.ts (or paste at top of AddSaleModal.tsx)

export interface VehicleEntry {
  id: string;           // VIN / Chassis No.
  name: string;         // Display name
  location: "yard" | "showroom" | "transit" | "sold";
  locationLabel: string;
}

export const MOCK_VEHICLES: VehicleEntry[] = [
  { id: "JTMBE33V585007842", name: "Toyota Land Cruiser 200", location: "showroom", locationLabel: "Main Showroom" },
  { id: "JTMCV02J204105523", name: "Toyota Land Cruiser Prado 150", location: "showroom", locationLabel: "Main Showroom" },
  { id: "JN1TANS61U0401234", name: "Nissan Patrol Y61", location: "yard", locationLabel: "North Yard" },
  { id: "JN8AZ2NE5C9012345", name: "Nissan Patrol Y62", location: "yard", locationLabel: "North Yard" },
  { id: "JTEBU5JR5G5123456", name: "Toyota FJ Cruiser", location: "showroom", locationLabel: "Branch Showroom" },
  { id: "JTJBM7FX4E5045678", name: "Lexus LX570", location: "yard", locationLabel: "South Yard" },
  { id: "JTJHY7AX0B4012345", name: "Lexus GX460", location: "showroom", locationLabel: "Main Showroom" },
  { id: "SALGS2TF5DA123456", name: "Land Rover Range Rover", location: "yard", locationLabel: "South Yard" },
  { id: "SALLMAMA5EA234567", name: "Land Rover Discovery 4", location: "showroom", locationLabel: "Branch Showroom" },
  { id: "WDC1660241A345678", name: "Mercedes-Benz G63 AMG", location: "yard", locationLabel: "North Yard" },
  { id: "WDC2969031A456789", name: "Mercedes-Benz GLS500", location: "transit", locationLabel: "In Transit" }, // excluded
  { id: "JTMZE33V505001234", name: "Toyota Hilux Surf", location: "sold", locationLabel: "Sold" },             // excluded
  { id: "JF1GPAC68EG567890", name: "Subaru Forester XT", location: "yard", locationLabel: "East Yard" },
  { id: "JF2SHADC5EH678901", name: "Subaru XV Crosstek", location: "showroom", locationLabel: "Main Showroom" },
  { id: "KMHD35LE2EU789012", name: "Hyundai Tucson", location: "yard", locationLabel: "East Yard" },
];