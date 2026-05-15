import type { GLAccount } from "@/types/types";

// ─── Formatting ────────────────────────────────────────────────────────────

export function formatYen(amount: number, currency = "JPY"): string {
  if (currency !== "JPY") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  }
  return `¥${Math.abs(amount).toLocaleString("ja-JP")}`;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatBalance(amount: number, currency = "JPY"): string {
  const prefix = amount < 0 ? "−" : "";
  return `${prefix}${formatYen(Math.abs(amount), currency)}`;
}

// ─── GL account grouping ───────────────────────────────────────────────────

export function groupGLByType(accounts: GLAccount[]) {
  return {
    asset:     accounts.filter((a) => a.type === "asset"),
    liability: accounts.filter((a) => a.type === "liability"),
    income:    accounts.filter((a) => a.type === "income"),
    expense:   accounts.filter((a) => a.type === "expense"),
  };
}

export function glTypeTotal(accounts: GLAccount[]): number {
  return accounts.reduce((s, a) => s + a.balance, 0);
}

// ─── Aging label ───────────────────────────────────────────────────────────

export const GL_TYPE_CONFIG = {
  asset:     { label: "Assets",      className: "bg-blue-50 text-blue-700 border-blue-200" },
  liability: { label: "Liabilities", className: "bg-red-50 text-red-600 border-red-200" },
  income:    { label: "Income",      className: "bg-green-50 text-green-700 border-green-200" },
  expense:   { label: "Expenses",    className: "bg-orange-50 text-orange-700 border-orange-200" },
} as const;

export const ACCOUNT_KIND_CONFIG = {
  cash: { label: "Cash",  className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  bank: { label: "Bank",  className: "bg-sky-50 text-sky-700 border-sky-200" },
} as const;