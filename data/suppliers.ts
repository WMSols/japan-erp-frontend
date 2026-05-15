import { Supplier, SupplierStats } from "@/types/supplier";

export const mockSupplierStats: SupplierStats = {
  totalSuppliers: 45,
  totalPayables: 18500000,      // ¥18,500,000
  purchasesThisMonth: 32000000, // ¥32,000,000
  pendingDues: 5400000,         // ¥5,400,000
};

export const mockSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "USS Tokyo",
    type: "auction",
    contactPerson: "Auction Admin",
    email: "billing@uss-tokyo.co.jp",
    phone: "047-123-4567",
    bankName: "Mitsubishi UFJ",
    bankAccount: "Ordinary 1234567",
    openingBalance: 0,
    purchasesMade: 150000000,
    paymentsMade: 145000000,
    outstandingBalance: 5000000,
    status: "active"
  },
  {
    id: "SUP-002",
    name: "JU Saitama",
    type: "auction",
    contactPerson: "Takeshi Yamada",
    email: "accounts@ju-saitama.jp",
    phone: "048-987-6543",
    bankName: "Sumitomo Mitsui",
    bankAccount: "Ordinary 9876543",
    openingBalance: 0,
    purchasesMade: 85000000,
    paymentsMade: 85000000,
    outstandingBalance: 0,
    status: "active"
  },
  {
    id: "SUP-003",
    name: "Kobe Auto Parts Co.",
    type: "local_supplier",
    contactPerson: "Satoshi Nakamura",
    email: "sales@kobe-parts.co.jp",
    phone: "078-456-7890",
    bankName: "Mizuho Bank",
    bankAccount: "Current 4561239",
    openingBalance: 500000,
    purchasesMade: 4500000,
    paymentsMade: 4600000,
    outstandingBalance: 400000,
    status: "active"
  },
  {
    id: "SUP-004",
    name: "Kyushu Trucks & Machinery",
    type: "dealer",
    contactPerson: "Daiki Matsumoto",
    email: "info@kyushu-trucks.com",
    phone: "092-321-6549",
    bankName: "Japan Post Bank",
    bankAccount: "Ordinary 1010101",
    openingBalance: 0,
    purchasesMade: 12000000,
    paymentsMade: 12000000,
    outstandingBalance: 0,
    status: "inactive"
  }
];