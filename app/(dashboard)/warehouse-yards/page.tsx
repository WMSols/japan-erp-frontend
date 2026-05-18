"use client";

import React, { useState } from "react";
import { BusinessLocation, LocationType } from "@/types/settings";
import { LOCATION_TYPE_CONFIG, mockLocations } from "@/data/settingsData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MapPin } from "lucide-react";

export default function LocationManagementTab() {
    const [locations, setLocations] = useState<BusinessLocation[]>(mockLocations);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newLocation, setNewLocation] = useState<Partial<BusinessLocation>>({ type: "yard" });

    const handleSave = () => {
        if (!newLocation.name) return;
        const locationToAdd: BusinessLocation = {
            id: `LOC-00${locations.length + 1}`,
            name: newLocation.name || "",
            type: (newLocation.type as LocationType) || "yard",
            address: newLocation.address || "Pending Address",
            managerName: newLocation.managerName || "Unassigned",
            capacity: newLocation.capacity,
        };
        setLocations([...locations, locationToAdd]);
        setIsAddModalOpen(false);
        setNewLocation({ type: "yard" }); // reset
    };

    return (
        <div className="space-y-4 ">
            <div className="flex justify-between items-center bg-white p-4  border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Warehouses & Yards</h2>
                    <p className="text-sm text-gray-500">Manage physical inventory locations and capacities.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-gray-900 text-white hover:bg-gray-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                </Button>
            </div>
            <div className="p-6">
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto min-w-[640px]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Location Name</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Address</th>
                                    <th className="px-6 py-4 font-medium">Manager</th>
                                    <th className="px-6 py-4 font-medium">Capacity</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {locations.map((loc) => {
                                    const typeConfig = LOCATION_TYPE_CONFIG[loc.type];
                                    
                                    return (
                                        <tr key={loc.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {loc.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center  px-2.5 py-1 rounded-full text-xs font-medium border ${typeConfig.className}`}>
                                                    {typeConfig.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">{loc.address}</td>
                                            <td className="px-6 py-4 text-gray-600">{loc.managerName}</td>
                                            <td className="px-6 py-4 text-gray-600">{loc.capacity ? `${loc.capacity} Units` : 'N/A'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">Edit</Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Location</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500">Location Name *</label>
                                <Input value={newLocation.name || ""} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} placeholder="e.g. Nagoya Port Yard" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500">Location Type</label>
                                <Select value={newLocation.type} onValueChange={(val: LocationType) => setNewLocation({ ...newLocation, type: val })}>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="office">Head Office</SelectItem>
                                        <SelectItem value="yard">Vehicle Yard</SelectItem>
                                        <SelectItem value="showroom">Showroom</SelectItem>
                                        <SelectItem value="warehouse">Parts Warehouse</SelectItem>
                                        <SelectItem value="workshop">Repair Workshop</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500">Address</label>
                                <Input value={newLocation.address || ""} onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })} placeholder="Full physical address" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-gray-500">Manager</label>
                                    <Input value={newLocation.managerName || ""} onChange={(e) => setNewLocation({ ...newLocation, managerName: e.target.value })} placeholder="Staff Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-gray-500">Capacity (Units)</label>
                                    <Input type="number" value={newLocation.capacity || ""} onChange={(e) => setNewLocation({ ...newLocation, capacity: parseInt(e.target.value) })} placeholder="e.g. 150" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} className="bg-gray-900 text-white hover:bg-gray-800">Save Location</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}