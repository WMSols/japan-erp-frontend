"use client";

import { useState, useMemo } from "react";
import type { SaleItem } from "@/types/types";
import { MOCK_SALES } from "@/data/sales";
import { computeSalesStats } from "./_utils/salesUtils";
import type { SaleStatusFilter, ChannelFilter, SalesSortOption } from "./_components/SalesFilterBar";

import AddSaleModal from "./_components/AddSalesModal";
import SalesStatsCards from "./_components/SalesStatsCard";
import SalesFilterBar from "./_components/SalesFilterBar";
import SaleCard from "./_components/SalesCard";

import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";

export default function SalesPage() {
  // ── State ────────────────────────────────────────────────────────────────
  const [sales, setSales] = useState<SaleItem[]>(MOCK_SALES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSale, setEditSale] = useState<SaleItem | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SaleStatusFilter>("all");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [sort, setSort] = useState<SalesSortOption>("newest");

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = useMemo(() => computeSalesStats(sales), [sales]);

  // ── Existing invoice numbers (needed by AddSaleModal) ───────────────────
  const existingInvoiceNumbers = useMemo(
    () => sales.map((s) => s.invoiceNumber),
    [sales]
  );

  // ── Filtered & sorted sales ──────────────────────────────────────────────
  const displayedSales = useMemo(() => {
    let filtered = sales;

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.vehicleName.toLowerCase().includes(q) ||
          s.vehicleId.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.invoiceNumber.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    if (channelFilter !== "all") {
      filtered = filtered.filter((s) => s.channel === channelFilter);
    }

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime();
        case "oldest":
          return new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
        case "profit_high":
          return b.profit - a.profit;
        case "profit_low":
          return a.profit - b.profit;
        case "revenue_high":
          return b.netRevenue - a.netRevenue;
        default:
          return 0;
      }
    });
  }, [sales, search, statusFilter, channelFilter, sort]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleSave(sale: SaleItem) {
    setSales((prev) => {
      const exists = prev.find((s) => s.id === sale.id);
      return exists
        ? prev.map((s) => (s.id === sale.id ? sale : s))
        : [sale, ...prev];
    });
    setEditSale(null);
  }

  function handleEdit(sale: SaleItem) {
    setEditSale(sale);
    setModalOpen(true);
  }

  function handleGenerateInvoice(sale: SaleItem) {
    // Wire to your PDF engine here
    console.log("Generate invoice for:", sale.invoiceNumber);
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditSale(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 min-w-0 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 bg-white shadow-2xs px-6 py-5 w-full">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sales</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage sales, edit records and get PDF invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <TrendingUp className="w-3.5 h-3.5" />
            {stats.totalSales} completed
          </span>
          <Button
            onClick={() => {
              setEditSale(null);
              setModalOpen(true);
            }}
            className="h-9 text-sm bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Sale
          </Button>
        </div>
      </div>

      {/* ── Page Content ── */}
      <div className="p-6 space-y-4">
        <SalesStatsCards stats={stats} />

        <SalesFilterBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          channel={channelFilter}
          onChannelChange={setChannelFilter}
          sort={sort}
          onSortChange={setSort}
          total={sales.length}
          filtered={displayedSales.length}
        />

        {displayedSales.length > 0 ? (
          <div className="flex flex-col gap-4">
            {displayedSales.map((sale) => (
              <SaleCard
                key={sale.id}
                sale={sale}
                onEdit={handleEdit}
                onGenerateInvoice={handleGenerateInvoice}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-700">No sales found</p>
            <p className="text-xs text-gray-400 mt-1">
              {search || statusFilter !== "all" || channelFilter !== "all"
                ? "Try adjusting your filters"
                : "Record your first sale to get started"}
            </p>
            {!search && statusFilter === "all" && channelFilter === "all" && (
              <Button
                onClick={() => setModalOpen(true)}
                variant="outline"
                className="mt-4 text-sm h-9"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Sale
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <AddSaleModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        editSale={editSale}
        existingInvoiceNumbers={existingInvoiceNumbers}
      />
    </div>
  );
}