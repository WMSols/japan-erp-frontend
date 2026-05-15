"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, MapPin, BookOpen } from "lucide-react";
import { mockCompanyProfile, mockSystemUsers, mockLocations, mockChartOfAccounts } from "@/data/settingsData";
import { CompanyProfileTab } from "./components/CompanyProfileTab";
import { UserManagementTab } from "./components/UserManagementTab";
import { LocationManagementTab } from "./components/LocationManagementTab";
import { ChartOfAccountsTab } from "./components/ChartOfAccountsTab";

export default function SettingsPage() {
  return (
    <div className="flex-1 min-w-0 p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500">Configure your business profile, users, locations, and accounting standards</p>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="bg-white border border-gray-100 shadow-sm p-1 rounded-lg inline-flex h-auto w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="company" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 text-gray-500 px-4 py-2">
            <Building className="w-4 h-4 mr-2" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 text-gray-500 px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="locations" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 text-gray-500 px-4 py-2">
            <MapPin className="w-4 h-4 mr-2" />
            Warehouses & Yards
          </TabsTrigger>
          <TabsTrigger value="chart-of-accounts" className="data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 text-gray-500 px-4 py-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Chart of Accounts
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="company" className="m-0 focus-visible:outline-none">
            <CompanyProfileTab profile={mockCompanyProfile} />
          </TabsContent>

          <TabsContent value="users" className="m-0 focus-visible:outline-none">
            <UserManagementTab initialUsers={mockSystemUsers} />
          </TabsContent>

          <TabsContent value="locations" className="m-0 focus-visible:outline-none">
            <LocationManagementTab initialLocations={mockLocations} />
          </TabsContent>

          <TabsContent value="chart-of-accounts" className="m-0 focus-visible:outline-none">
            <ChartOfAccountsTab initialAccounts={mockChartOfAccounts} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}