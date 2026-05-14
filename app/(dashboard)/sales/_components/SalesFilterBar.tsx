"use client";

import type { SaleItem } from "@/types/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SaleStatusFilter = SaleItem["status"] | "all";
export type ChannelFilter = SaleItem["channel"] | "all";
export type SalesSortOption = "newest" | "oldest" | "profit_high" | "profit_low" | "revenue_high";

interface SalesFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: SaleStatusFilter;
  onStatusChange: (v: SaleStatusFilter) => void;
  channel: ChannelFilter;
  onChannelChange: (v: ChannelFilter) => void;
  sort: SalesSortOption;
  onSortChange: (v: SalesSortOption) => void;
  total: number;
  filtered: number;
}

export default function SalesFilterBar({
  search, onSearchChange,
  status, onStatusChange,
  channel, onChannelChange,
  sort, onSortChange,
  total, filtered,
}: SalesFilterBarProps) {
  return (
    <div className="flex flex-col my-2 sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <Input
          placeholder="Search by vehicle, customer, invoice..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9 text-sm w-full"
        />
      </div>

      <Select value={status} onValueChange={(v) => onStatusChange(v as SaleStatusFilter)}>
        <SelectTrigger className="h-9 text-sm w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={channel} onValueChange={(v) => onChannelChange(v as ChannelFilter)}>
        <SelectTrigger className="h-9 text-sm w-[120px]">
          <SelectValue placeholder="Channel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Channels</SelectItem>
          <SelectItem value="direct">Direct</SelectItem>
          <SelectItem value="auction">Auction</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => onSortChange(v as SalesSortOption)}>
        <SelectTrigger className="h-9 text-sm w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="profit_high">Profit: High → Low</SelectItem>
          <SelectItem value="profit_low">Profit: Low → High</SelectItem>
          <SelectItem value="revenue_high">Revenue: High → Low</SelectItem>
        </SelectContent>
      </Select>

      <p className="text-xs text-gray-400 flex-shrink-0">
        {filtered} of {total} sale{total !== 1 ? "s" : ""}
      </p>
    </div>
  );
}