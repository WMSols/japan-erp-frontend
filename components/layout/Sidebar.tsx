"use client";

import { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import {
  CarIcon,
  WrenchIcon,
  SalesIcon,
  LedgerIcon,
  ReportsIcon,
  SettingsIcon,
  MenuIcon,
  ChevronLeftIcon,
} from "./components/SidebarIcons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User2 } from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Vehicles",  icon: <CarIcon />,     href: "/" },
  { label: "Workshop",  icon: <WrenchIcon />,  href: "/workshop" },
  { label: "Sales",     icon: <SalesIcon />,   href: "/sales" },
  { label: "Ledgers",   icon: <LedgerIcon />,  href: "/ledgers" },
  { label: "Reports",   icon: <ReportsIcon />, href: "/reports" },
  { label: "Customers", icon: <User2 size={20} />, href: "/customers" },
  { label: "Sellers",   icon: <User2 size={20} />, href: "/sellers" },
  { label: "Settings",  icon: <SettingsIcon />, href: "/settings" },
];

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
        <span className="text-sm font-semibold tracking-tight text-gray-800">
          AutoTrack JP
        </span>
      </div>

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar panel ──────────────────────────────────────── */}
      <aside
        className={[
          "fixed top-0 left-0 z-50 flex flex-col h-screen bg-white border-r border-gray-100",
          "shadow-[2px_0_12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-[220px]",
          "max-md:w-[220px]",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        ].join(" ")}
      >
        {/* Logo / brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-50">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-tight">AT</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap leading-tight">
                AutoTrack
              </p>
              <p className="text-[10px] text-gray-400 whitespace-nowrap tracking-wide uppercase">
                Japan
              </p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5">
          {navItems.map((item) => {
            // Active based on real URL, not manual state
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                href={item.href}
                key={item.label}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={[
                  "relative group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex-shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-700",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="font-medium tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {collapsed && isActive && (
                  <span className="absolute left-1 w-1 h-5 rounded-full bg-gray-900" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden md:flex items-center justify-end px-3 py-4 border-t border-gray-50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all duration-150"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span
              className={[
                "block transition-transform duration-300",
                collapsed ? "rotate-180" : "rotate-0",
              ].join(" ")}
            >
              <ChevronLeftIcon />
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}