'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Wallet } from 'lucide-react'

export function AccountSwitcher({ accounts, currentAccount }: { accounts: {id: string, label: string}[], currentAccount: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Ensure there's always at least one option to select if empty
  const displayAccounts = accounts.length > 0 ? accounts : [{id: 'Default', label: 'Default'}]
  const initialSelectedObj = displayAccounts.find(a => a.id === currentAccount) || displayAccounts[0]
  const initialSelected = initialSelectedObj.id

  const [optimisticAccount, setOptimisticAccount] = useState(initialSelected)

  useEffect(() => {
    setOptimisticAccount(initialSelected)
  }, [initialSelected])

  const handleAccountChange = (value: string) => {
    if (!value) return
    setOptimisticAccount(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('account', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Determine what to display in the closed select box
  const selectedLabel = displayAccounts.find(a => a.id === optimisticAccount)?.label || optimisticAccount

  return (
    <div className="flex items-center gap-2">
      <Select value={optimisticAccount} onValueChange={handleAccountChange}>
        <SelectTrigger className="h-8 w-[140px] bg-card border-border text-xs focus:ring-1 focus:ring-indigo-500">
          <div className="flex items-center gap-2 text-foreground truncate">
            <Wallet className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{selectedLabel}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border-border text-foreground">
          {displayAccounts.map(account => (
            <SelectItem key={account.id} value={account.id} className="text-xs hover:bg-muted focus:bg-muted truncate">
              {account.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
