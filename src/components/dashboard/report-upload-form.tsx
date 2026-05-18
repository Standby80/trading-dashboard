'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UploadCloud, FileType, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function ReportUploadForm() {
  const [open, setOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    setError(null)
    setSuccess(false)
    
    // Check if HTML or HTM
    if (!selectedFile.name.toLowerCase().endsWith('.html') && !selectedFile.name.toLowerCase().endsWith('.htm')) {
      setError('Please upload a valid MT5 HTML report file (.html or .htm)')
      return
    }
    
    setFile(selectedFile)
  }

  const processReport = async () => {
    if (!file) return

    setParsing(true)
    setError(null)

    try {
      const text = await file.text()
      
      // Parse HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'text/html')
      
      const trades: any[] = []
      
      // MT5 reports usually use standard <tr> and <td> tags.
      // A closed deal (trade) usually has 13 or more columns in MT5.
      // Format is generally: Time, Position, Symbol, Type, Volume, Price, S/L, T/P, Time, Price, Commission, Swap, Profit
      const rows = doc.querySelectorAll('tr')
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td')
        if (cells.length >= 13) {
          const typeStr = cells[3]?.textContent?.trim().toLowerCase() || ''
          
          // Only process actual closed trades (buy/sell)
          if (typeStr === 'buy' || typeStr === 'sell') {
            const openTimeStr = cells[0]?.textContent?.trim() || ''
            const closeTimeStr = cells[8]?.textContent?.trim() || '' // Second time column is usually close time
            
            // Format MT5 dates: "YYYY.MM.DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ssZ"
            const openTime = openTimeStr.replace(/\./g, '-')
            const closeTime = closeTimeStr.replace(/\./g, '-')
            
            // If it doesn't look like a valid date, skip
            if (!closeTime.includes('-')) return

            const profitRaw = cells[12]?.textContent?.replace(/ /g, '') || '0'
            const commissionRaw = cells[10]?.textContent?.replace(/ /g, '') || '0'
            const swapRaw = cells[11]?.textContent?.replace(/ /g, '') || '0'
            
            // We only add deals that actually closed (have a close time and profit)
            if (closeTimeStr.length > 5) {
              trades.push({
                // Ticket number or generated ID
                id: cells[1]?.textContent?.trim() || Math.random().toString(36).substring(7),
                open_time: new Date(openTime).toISOString(),
                close_time: new Date(closeTime).toISOString(),
                symbol: cells[2]?.textContent?.trim() || 'Unknown',
                type: typeStr === 'buy' ? 'DEAL_TYPE_BUY' : 'DEAL_TYPE_SELL',
                volume: parseFloat(cells[4]?.textContent?.trim() || '0'),
                price: parseFloat(cells[5]?.textContent?.trim() || '0'),
                profit: parseFloat(profitRaw),
                commission: parseFloat(commissionRaw),
                swap: parseFloat(swapRaw)
              })
            }
          }
        }
      })

      if (trades.length === 0) {
        throw new Error("No trades could be found in this HTML file. Ensure it's a closed positions report.")
      }

      // Send to backend
      const response = await fetch('/api/trades/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trades }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save trades to database')
      }

      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        window.location.reload()
      }, 1500)

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to parse the file')
    } finally {
      setParsing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
          <UploadCloud className="w-4 h-4" />
          Upload Report
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-[#0b0e14] border-white/5 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload MT5 Report</DialogTitle>
          <DialogDescription className="text-slate-400">
            Export your history as an HTML report from MetaTrader 5 and upload it here.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {!file ? (
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".html,.htm"
                onChange={handleChange}
                className="hidden"
              />
              <FileType className="w-10 h-10 text-slate-500 mx-auto mb-4" />
              <p className="text-sm font-medium text-slate-300">Drag & drop your report here</p>
              <p className="text-xs text-slate-500 mt-1">or click to browse (.html)</p>
            </div>
          ) : (
            <div className="bg-[#131823] border border-white/5 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileType className="w-8 h-8 text-indigo-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-slate-500 hover:text-slate-300 p-2"
                disabled={parsing}
              >
                ✕
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-rose-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <p>Trades imported successfully! Reloading...</p>
            </div>
          )}
          
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
            disabled={!file || parsing || success}
            onClick={processReport}
          >
            {parsing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Report...
              </>
            ) : (
              'Import Trades'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
