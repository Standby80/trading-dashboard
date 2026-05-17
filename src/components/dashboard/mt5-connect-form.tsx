"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Link2, Loader2 } from "lucide-react"

export function MT5ConnectForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    broker: "",
    account: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/metaapi/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to connect to MetaApi")
      }

      // Handle success
      setOpen(false)
      window.location.reload() // Refresh to load new data
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1e293b] hover:bg-[#334155] border border-white/10 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors h-auto">
          <Link2 className="w-4 h-4" />
          Connect MT5
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0b0e14] text-slate-50 border-white/10">
        <DialogHeader>
          <DialogTitle>Connect MetaTrader 5</DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter your read-only (investor) credentials to sync your trading history securely.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSync}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-rose-500 text-sm bg-rose-500/10 p-3 rounded-md border border-rose-500/20">
                {error}
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="broker" className="text-right text-slate-300">
                Server Name
              </Label>
              <Input
                id="broker"
                placeholder="MetaQuotes-Demo"
                className="col-span-3 bg-[#131823] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                value={formData.broker}
                onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right text-slate-300">
                Account No.
              </Label>
              <Input
                id="account"
                placeholder="12345678"
                className="col-span-3 bg-[#131823] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right text-slate-300">
                Investor Pass
              </Label>
              <Input
                id="password"
                type="password"
                className="col-span-3 bg-[#131823] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Connecting..." : "Connect Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
