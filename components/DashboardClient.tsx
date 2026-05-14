"use client";

import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed , setCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main
        className={[
          "transition-all duration-300 ease-in-out",
          collapsed ? "md:ml-[68px]" : "md:ml-[220px]",
          "pt-14 md:pt-0",
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardClient({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}