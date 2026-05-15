export type UserRole = "admin" | "accountant" | "sales_manager" | "workshop_manager";
export type UserStatus = "active" | "inactive";
export type LocationType = "yard" | "warehouse" | "workshop" | "office";

export interface CompanyProfile {
  name: string;
  tradingName: string;
  registrationNumber: string;
  taxId: string; // Consumption Tax ID (適格請求書発行事業者登録番号)
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
}

export interface BusinessLocation {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  capacity?: number;
  managerName: string;
}
export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  status: "active" | "inactive";
}