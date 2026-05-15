import { Customer, CustomerStats } from "@/types/customer";

export const mockCustomerStats: CustomerStats = {
  totalCustomers: 142,
  activeCustomers: 89,
  totalReceivables: 45000000, // ¥45,000,000
  overduePayments: 3200000,   // ¥3,200,000
};

export const mockCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Kenji Sato",
    companyName: "Sato Motors K.K.",
    email: "kenji.sato@example.co.jp",
    phone: "03-1234-5678",
    address: "1-2-3 Roppongi, Minato-ku, Tokyo",
    totalSales: 12500000,
    paymentsReceived: 10500000,
    outstandingBalance: 2000000,
    creditLimit: 5000000,
    status: "pending_payment",
    lastActive: "2026-05-10T10:30:00Z"
  },
  {
    id: "CUST-002",
    name: "Yuki Tanaka",
    email: "y.tanaka88@example.com",
    phone: "090-9876-5432",
    address: "4-5 Namba, Chuo-ku, Osaka",
    totalSales: 3400000,
    paymentsReceived: 3400000,
    outstandingBalance: 0,
    creditLimit: 0,
    status: "active",
    lastActive: "2026-05-14T14:15:00Z"
  },
  {
    id: "CUST-003",
    name: "Hiroshi Watanabe",
    companyName: "Kansai Heavy Equipment",
    email: "hwatanabe@kansai-heavy.co.jp",
    phone: "06-8765-4321",
    address: "7-8-9 Kobe Port, Chuo-ku, Kobe",
    totalSales: 45000000,
    paymentsReceived: 45000000,
    outstandingBalance: 0,
    creditLimit: 20000000,
    status: "inactive",
    lastActive: "2026-01-20T09:00:00Z"
  },
  {
    id: "CUST-004",
    name: "Akira Ito",
    companyName: "Ito Auto Exports",
    email: "auto@ito-exports.com",
    phone: "045-222-3333",
    address: "Minato Mirai, Nishi-ku, Yokohama",
    totalSales: 8900000,
    paymentsReceived: 7700000,
    outstandingBalance: 1200000,
    creditLimit: 10000000,
    status: "pending_payment",
    lastActive: "2026-05-15T08:45:00Z"
  }
];