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

export function AccountSwitcher({ accounts, currentAccount }: { accounts: string[], currentAccount: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Ensure there's always at least one option to select if empty
  const displayAccounts = accounts.length > 0 ? accounts : ['Default']
  const initialSelected = displayAccounts.includes(currentAccount) ? currentAccount : displayAccounts[0]

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

  return (
    <div className="flex items-center gap-2">
      <Select value={optimisticAccount} onValueChange={handleAccountChange}>
        <SelectTrigger className="h-8 w-[140px] bg-card border-border text-xs focus:ring-1 focus:ring-indigo-500">
          <div className="flex items-center gap-2 text-foreground">
            <Wallet className="w-3.5 h-3.5 text-indigo-400" />
            <SelectValue placeholder="Select Account" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border-border text-foreground">
          {displayAccounts.map(account => (
            <SelectItem key={account} value={account} className="text-xs hover:bg-muted focus:bg-muted">
              {account}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
