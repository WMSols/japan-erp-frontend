"use client";

import React, { useState } from "react";
import { LedgerAccount, AccountType } from "@/types/settings";
import { ACCOUNT_TYPE_CONFIG } from "@/data/settingsData";
import { formatYen } from "../utils/utils"; // Assume your shared formatter is here
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, BookOpen } from "lucide-react";

export function ChartOfAccountsTab({ initialAccounts }: { initialAccounts: LedgerAccount[] }) {
  const [accounts, setAccounts] = useState<LedgerAccount[]>(initialAccounts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<LedgerAccount>>({ type: "asset" });

  const handleSave = () => {
    if (!newAccount.name || !newAccount.code) return;
    const accountToAdd: LedgerAccount = {
      id: `ACC-00${accounts.length + 1}`,
      code: newAccount.code,
      name: newAccount.name,
      type: (newAccount.type as AccountType) || "asset",
      balance: 0, // new accounts start at 0
      status: "active",
    };
    // Sort accounts by code so it naturally flows 1000 -> 2000 etc.
    const updatedList = [...accounts, accountToAdd].sort((a, b) => a.code.localeCompare(b.code));
    setAccounts(updatedList);
    setIsAddModalOpen(false);
    setNewAccount({ type: "asset", code: "", name: "" }); // reset
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Chart of Accounts (GL)</h2>
          <p className="text-sm text-gray-500">Manage your general ledger categories for double-entry accounting.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-gray-900 text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-w-[640px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Account Code</th>
                <th className="px-6 py-4 font-medium">Account Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Current Balance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((acc) => {
                const typeConfig = ACCOUNT_TYPE_CONFIG[acc.type];
                return (
                  <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-600">{acc.code}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      {acc.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${typeConfig.className}`}>
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">{formatYen(acc.balance)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${acc.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {acc.status}
                      </span>
                    </td>
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
            <DialogTitle>Add Ledger Account</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <label className="text-xs uppercase tracking-wider text-gray-500">Code *</label>
                <Input value={newAccount.code || ""} onChange={(e) => setNewAccount({...newAccount, code: e.target.value})} placeholder="e.g. 6000" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs uppercase tracking-wider text-gray-500">Account Name *</label>
                <Input value={newAccount.name || ""} onChange={(e) => setNewAccount({...newAccount, name: e.target.value})} placeholder="e.g. Rent Expense" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-500">Account Type</label>
              <Select value={newAccount.type} onValueChange={(val: AccountType) => setNewAccount({...newAccount, type: val})}>
                <SelectTrigger><SelectValue placeholder="Select classification" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset">Asset (資産)</SelectItem>
                  <SelectItem value="liability">Liability (負債)</SelectItem>
                  <SelectItem value="equity">Equity (純資産)</SelectItem>
                  <SelectItem value="revenue">Revenue (収益)</SelectItem>
                  <SelectItem value="expense">Expense (費用)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white hover:bg-gray-800">Save Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}