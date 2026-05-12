'use client'
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import { useState } from "react";
import VehiclesPage from "./vehicles/page";

export default function Home() {
    const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={collapsed ? "md:ml-17" : "md:ml-55"}>
      <Sidebar
      setCollapsed={setCollapsed}
      collapsed={collapsed}/>
      <VehiclesPage/>
    </div>
  );
}
