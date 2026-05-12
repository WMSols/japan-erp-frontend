"use client";

import Sidebar from "@/components/layout/Sidebar";
import React, { useMemo, useState } from "react";
import RepairJobForm from "./components/RepairJobForm";
import WorkshopStatsBar from "./components/WorkshopStatsBar";
import RepairJobCard from "./components/RepairJobCard";
import type { RepairJob, RepairStatus, WorkshopStats } from "@/types/types";

const Workshop = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Repair jobs state
  const [jobs, setJobs] = useState<RepairJob[]>([]);

  // Add new job
  const handleAddJob = (job: RepairJob) => {
    setJobs((prev) => [job, ...prev]);
  };

  // Change status
  const handleStatusChange = (id: string, status: RepairStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? {
              ...job,
              status,
              updatedAt: new Date().toISOString(),
              completedAt:
                status === "Completed"
                  ? new Date().toISOString()
                  : undefined,
            }
          : job
      )
    );
  };

  // Delete job
  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  // Workshop stats
  const stats: WorkshopStats = useMemo(() => {
    return {
      total: jobs.length,
      pending: jobs.filter((j) => j.status === "Pending").length,
      inProgress: jobs.filter((j) => j.status === "In Progress").length,
      completed: jobs.filter((j) => j.status === "Completed").length,
      onHold: jobs.filter((j) => j.status === "On Hold").length,

      totalLaborCost: jobs.reduce((acc, j) => acc + j.laborCost, 0),

      totalPartsCost: jobs.reduce(
        (acc, j) =>
          acc +
          j.parts.reduce(
            (partAcc, p) => partAcc + p.quantity * p.unitCost,
            0
          ),
        0
      ),

      totalExternalCharge: jobs.reduce(
        (acc, j) => acc + j.externalCharge,
        0
      ),
    };
  }, [jobs]);

  return (
    <div>
      <div className={collapsed ? "md:ml-17" : "md:ml-55"}>
        <Sidebar setCollapsed={setCollapsed} collapsed={collapsed} />

        {/* Form */}
        <div className="p-4">
          <RepairJobForm onAdd={handleAddJob} />
        </div>

        {/* Stats */}
        <div className="p-4">
          <WorkshopStatsBar stats={stats} />
        </div>

        {/* Job Cards */}
        <div className="p-4 grid gap-4">
          {jobs.map((job) => (
            <RepairJobCard
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteJob}
            />
          ))}

          {jobs.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-10">
              No repair jobs added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workshop;