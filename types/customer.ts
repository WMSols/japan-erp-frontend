export type CustomerStatus = "active" | "inactive" | "pending_payment";

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  totalSales: number;
  paymentsReceived: number;
  outstandingBalance: number;
  creditLimit: number;
  status: CustomerStatus;
  lastActive: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalReceivables: number;
  overduePayments: number;
}