import { CompanyProfile, SystemUser, BusinessLocation } from "@/types/settings";

export const USER_ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  admin: { label: "Administrator", className: "bg-red-50 text-red-700 border-red-200" },
  accountant: { label: "Accountant", className: "bg-blue-50 text-blue-700 border-blue-200" },
  sales_manager: { label: "Sales Manager", className: "bg-purple-50 text-purple-700 border-purple-200" },
  workshop_manager: { label: "Workshop Manager", className: "bg-orange-50 text-orange-700 border-orange-200" },
};

export const mockCompanyProfile: CompanyProfile = {
  name: "AutoTrack Japan K.K.",
  tradingName: "AutoTrack JP Exports",
  registrationNumber: "0104-01-123456",
  taxId: "T1234567890123", // Japan Invoice System ID format
  address: "1-2-3 Roppongi, Minato-ku, Tokyo 106-0032",
  phone: "+81 3-1234-5678",
  email: "billing@autotrack.co.jp",
  website: "www.autotrack.co.jp",
};

export const mockSystemUsers: SystemUser[] = [
  { id: "USR-001", name: "Hiroshi Sato", email: "h.sato@autotrack.co.jp", role: "admin", status: "active", lastLogin: "2026-05-15T08:30:00Z" },
  { id: "USR-002", name: "Yumi Tanaka", email: "finance@autotrack.co.jp", role: "accountant", status: "active", lastLogin: "2026-05-15T09:15:00Z" },
  { id: "USR-003", name: "Kenji Ito", email: "sales@autotrack.co.jp", role: "sales_manager", status: "active", lastLogin: "2026-05-14T18:45:00Z" },
  { id: "USR-004", name: "Daiki Suzuki", email: "workshop@autotrack.co.jp", role: "workshop_manager", status: "inactive", lastLogin: "2026-05-01T10:00:00Z" },
];

export const mockLocations: BusinessLocation[] = [
  { id: "LOC-001", name: "Tokyo Main Office", type: "office", address: "Roppongi, Minato-ku, Tokyo", managerName: "Hiroshi Sato" },
  { id: "LOC-002", name: "Yokohama Port Yard", type: "yard", address: "Daikoku Futo, Yokohama", capacity: 250, managerName: "Kenji Ito" },
  { id: "LOC-003", name: "Saitama Repair Center", type: "workshop", address: "Toda, Saitama", capacity: 30, managerName: "Daiki Suzuki" },
];

// --- Add to existing mock data imports and exports ---
import { LedgerAccount } from "../types/settings";

export const LOCATION_TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  office: { label: "Head Office", className: "bg-blue-50 text-blue-700 border-blue-200" },
  yard: { label: "Vehicle Yard", className: "bg-green-50 text-green-700 border-green-200" },
  warehouse: { label: "Parts Warehouse", className: "bg-purple-50 text-purple-700 border-purple-200" },
  workshop: { label: "Repair Workshop", className: "bg-orange-50 text-orange-700 border-orange-200" },
};

export const ACCOUNT_TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  asset: { label: "Asset", className: "bg-green-50 text-green-700 border-green-200" },
  liability: { label: "Liability", className: "bg-red-50 text-red-700 border-red-200" },
  equity: { label: "Equity", className: "bg-purple-50 text-purple-700 border-purple-200" },
  revenue: { label: "Revenue", className: "bg-blue-50 text-blue-700 border-blue-200" },
  expense: { label: "Expense", className: "bg-orange-50 text-orange-700 border-orange-200" },
};

export const mockChartOfAccounts: LedgerAccount[] = [
  { id: "ACC-001", code: "1000", name: "Cash in Bank (Mitsubishi UFJ)", type: "asset", balance: 12500000, status: "active" },
  { id: "ACC-002", code: "1200", name: "Accounts Receivable", type: "asset", balance: 45000000, status: "active" },
  { id: "ACC-003", code: "2000", name: "Accounts Payable", type: "liability", balance: 18500000, status: "active" },
  { id: "ACC-004", code: "3000", name: "Owner's Equity", type: "equity", balance: 50000000, status: "active" },
  { id: "ACC-005", code: "4000", name: "Vehicle Sales Revenue", type: "revenue", balance: 125000000, status: "active" },
  { id: "ACC-006", code: "5000", name: "Cost of Goods Sold (Vehicles)", type: "expense", balance: 85000000, status: "active" },
  { id: "ACC-007", code: "5100", name: "Auction Fees", type: "expense", balance: 1200000, status: "active" },
];