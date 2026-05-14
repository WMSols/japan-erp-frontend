'use client'
import Sidebar from "@/components/layout/Sidebar";
import Image from "next/image";
import { useState } from "react";
import VehiclesPage from "./vehicles/page";

export default function Home() {

  return (
    <div>
      <VehiclesPage/>
    </div>
  );
}
