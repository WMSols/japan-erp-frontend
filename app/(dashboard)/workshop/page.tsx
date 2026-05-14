"use client";

import { useState, useMemo } from "react";
import type { RepairJob } from "@/types/workShopTypes";
import { MOCK_REPAIR_JOBS } from "@/data/workshop";
import { computeWorkshopStats } from "./utils/workshopUtils";
import WorkshopStatsCards from "./_components/WorkshopStatsCard";
import WorkshopFilterBar, { type StatusFilter, type SortOption } from "./_components/WorkshopFilterBar";
import RepairJobCard from "./_components/RepairJobCard";
import AddRepairJobModal from "./_components/AddRepairJobModal";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";

export default function WorkshopPage() {
  // ── State ───────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<RepairJob[]>(MOCK_REPAIR_JOBS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<RepairJob | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  // ── Stats ───────────────────────────────────────────────────────────────
  const stats = useMemo(() => computeWorkshopStats(jobs), [jobs]);

  // ── Filtered & Sorted Jobs ──────────────────────────────────────────────
  const displayedJobs = useMemo(() => {
    let filtered = jobs;

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.vehicleName.toLowerCase().includes(q) ||
          j.vehicleId.toLowerCase().includes(q) ||
          j.id.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.assignedTo.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((j) => j.status === statusFilter);
    }

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "oldest":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "cost_high":
          return b.totalCost - a.totalCost;
        case "cost_low":
          return a.totalCost - b.totalCost;
        default:
          return 0;
      }
    });
  }, [jobs, search, statusFilter, sort]);

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleSave(job: RepairJob) {
    setJobs((prev) => {
      const exists = prev.find((j) => j.id === job.id);
      return exists ? prev.map((j) => (j.id === job.id ? job : j)) : [job, ...prev];
    });
    setEditJob(null);
  }

  function handleEdit(job: RepairJob) {
    setEditJob(job);
    setModalOpen(true);
  }

  function handleStatusChange(jobId: string, status: RepairJob["status"]) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status,
              ...(status === "completed"
                ? { actualEndDate: new Date().toISOString().split("T")[0] }
                : {}),
            }
          : j
      )
    );
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditJob(null);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 min-w-0  space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 bg-white shadow-2xs px-6 py-5 w-full">
        <div className="">
          <h1 className="text-xl font-semibold text-gray-900">Workshop</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Repair & maintenance management
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {stats.inRepair} active
          </span>
          <Button
            onClick={() => {
              setEditJob(null);
              setModalOpen(true);
            }}
            className="h-9 text-sm bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Job
          </Button>
        </div>
      </div>
      {/* Page content */}
        <div className="p-6">


      {/* ── Stats Cards ── */}
      <WorkshopStatsCards stats={stats} />

      {/* ── Filter Bar ── */}
      <WorkshopFilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        sort={sort}
        onSortChange={setSort}
        total={jobs.length}
        filtered={displayedJobs.length}
      />

      {/* ── Job List ── */}
      {displayedJobs.length > 0 ? (
        <div className="space-y-4">
          {displayedJobs.map((job) => (
            <RepairJobCard
              key={job.id}
              job={job}
              onEdit={handleEdit}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <Wrench className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-700">No repair jobs found</p>
          <p className="text-xs text-gray-400 mt-1">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Log your first repair job to get started"}
          </p>
          {!search && statusFilter === "all" && (
            <Button
              onClick={() => setModalOpen(true)}
              variant="outline"
              className="mt-4 text-sm h-9"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Repair Job
            </Button>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      <AddRepairJobModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        editJob={editJob}
      />
      </div>
    </div>
  );
}