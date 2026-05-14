"use client";

import type { RepairJob } from "@/types/workShopTypes";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type StatusFilter = RepairJob["status"] | "all";
export type SortOption = "newest" | "oldest" | "cost_high" | "cost_low";

interface WorkshopFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  total: number;
  filtered: number;
}

export default function WorkshopFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  total,
  filtered,
}: WorkshopFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 ">
      {/* Search */}
      <div className="relative flex-1 min-w-0 w-full sm:w-auto my-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <Input
          placeholder="Search by vehicle, VIN, or job ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-9 text-sm w-full"
        />
      </div>

      {/* Status filter */}
      <Select value={status} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
        <SelectTrigger className="h-9 text-sm w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger className="h-9 text-sm w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="cost_high">Cost: High → Low</SelectItem>
          <SelectItem value="cost_low">Cost: Low → High</SelectItem>
        </SelectContent>
      </Select>

      {/* Count */}
      <p className="text-xs text-gray-400 flex-shrink-0">
        {filtered} of {total} job{total !== 1 ? "s" : ""}
      </p>
    </div>
  );
}