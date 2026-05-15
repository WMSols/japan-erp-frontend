export type SupplierType = "auction" | "dealer" | "local_supplier";
export type SupplierStatus = "active" | "inactive";

export interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
  contactPerson: string;
  email: string;
  phone: string;
  bankName: string;
  bankAccount: string;
  openingBalance: number;
  purchasesMade: number;
  paymentsMade: number;
  outstandingBalance: number;
  status: SupplierStatus;
}

export interface SupplierStats {
  totalSuppliers: number;
  totalPayables: number;
  purchasesThisMonth: number;
  pendingDues: number;
}