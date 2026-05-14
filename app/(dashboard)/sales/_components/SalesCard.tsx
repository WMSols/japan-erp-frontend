"use client";

import { useState } from "react";
import type { SaleItem } from "@/types/types";
import {
  formatYen,
  formatDate,
  SALE_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  CHANNEL_CONFIG,
} from "../_utils/salesUtils";
import {
  Car,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  FileText,
} from "lucide-react";

interface SaleCardProps {
  sale: SaleItem;
  onEdit: (sale: SaleItem) => void;
  onGenerateInvoice: (sale: SaleItem) => void;
}

export default function SaleCard({ sale, onEdit, onGenerateInvoice }: SaleCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusCfg = SALE_STATUS_CONFIG[sale.status];
  const paymentCfg = PAYMENT_STATUS_CONFIG[sale.paymentStatus];
  const channelCfg = CHANNEL_CONFIG[sale.channel];
  const profitPositive = sale.profit >= 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* ── Header ── */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left — vehicle info */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <Car className="w-4 h-4 text-gray-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm">{sale.vehicleName}</p>
                <span className="text-xs text-gray-400 font-mono">{sale.id}</span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{sale.vehicleId}</p>
            </div>
          </div>

          {/* Right — badges */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
            <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border font-medium ${channelCfg.className}`}>
              {channelCfg.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${statusCfg.className}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <User className="w-3.5 h-3.5" />
            {sale.customerName}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(sale.saleDate)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <FileText className="w-3.5 h-3.5" />
            {sale.invoiceNumber}
          </span>
        </div>

        {/* Key financials row */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Selling Price</p>
            <p className="text-sm font-semibold text-gray-900">{formatYen(sale.sellingPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Net Revenue</p>
            <p className="text-sm font-semibold text-gray-900">{formatYen(sale.netRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Profit</p>
            <p className={`text-sm font-bold ${profitPositive ? "text-green-600" : "text-red-500"}`}>
              {profitPositive ? "+" : ""}{formatYen(sale.profit)}
            </p>
          </div>
        </div>

        {/* Payment status + actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border font-medium ${paymentCfg.className}`}>
              {paymentCfg.label}
            </span>
            {sale.amountDue > 0 && (
              <span className="text-xs text-gray-500">
                Due: <span className="font-medium text-orange-600">{formatYen(sale.amountDue)}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onGenerateInvoice(sale)}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100 flex items-center gap-1"
            >
              <FileText className="w-3 h-3" /> Invoice
            </button>
            <button
              onClick={() => onEdit(sale)}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => setExpanded((p) => !p)}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100 flex items-center gap-1"
            >
              {expanded ? <><ChevronUp className="w-3 h-3" /> Hide</> : <><ChevronDown className="w-3 h-3" /> Details</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Expanded breakdown ── */}
      {expanded && (
        <div className="border-t border-gray-50 bg-gray-50/60 px-5 py-4">
          <div className="rounded-lg border border-gray-100 overflow-hidden bg-white">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="px-3 py-2.5 text-gray-500">Selling Price</td>
                  <td className="px-3 py-2.5 text-right font-medium text-gray-900">{formatYen(sale.sellingPrice)}</td>
                </tr>
                {sale.commission > 0 && (
                  <tr>
                    <td className="px-3 py-2.5 text-gray-500">Commission</td>
                    <td className="px-3 py-2.5 text-right text-red-500">− {formatYen(sale.commission)}</td>
                  </tr>
                )}
                {sale.discount > 0 && (
                  <tr>
                    <td className="px-3 py-2.5 text-gray-500">Discount</td>
                    <td className="px-3 py-2.5 text-right text-red-500">− {formatYen(sale.discount)}</td>
                  </tr>
                )}
                <tr className="bg-gray-50">
                  <td className="px-3 py-2.5 font-semibold text-gray-700">Net Revenue</td>
                  <td className="px-3 py-2.5 text-right font-bold text-gray-900">{formatYen(sale.netRevenue)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 text-gray-500">Total Cost</td>
                  <td className="px-3 py-2.5 text-right text-red-500">− {formatYen(sale.totalCost)}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2.5 font-semibold text-gray-700">Gross Profit</td>
                  <td className={`px-3 py-2.5 text-right font-bold ${profitPositive ? "text-green-600" : "text-red-500"}`}>
                    {profitPositive ? "+" : ""}{formatYen(sale.profit)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 text-gray-500">Amount Paid</td>
                  <td className="px-3 py-2.5 text-right text-green-600">{formatYen(sale.amountPaid)}</td>
                </tr>
                {sale.amountDue > 0 && (
                  <tr>
                    <td className="px-3 py-2.5 text-gray-500">Amount Due</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-orange-600">{formatYen(sale.amountDue)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {sale.notes && (
            <div className="mt-3 text-xs text-gray-500 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
              <span className="font-medium text-yellow-700">Note: </span>
              {sale.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}