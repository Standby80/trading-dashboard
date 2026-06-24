'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Trade {
  ticket_id: string;
  symbol: string;
  open_time: string;
  close_time: string;
  open_price: number;
  close_price: number;
  profit: number;
  swap?: number;
  commission?: number;
  type?: string;
  volume?: number;
  notes?: string;
  screenshot_url?: string;
}

// ... keeping DayDetailsModalProps
interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  trades: Trade[];
}

import { createClient } from '@/lib/supabase/client';
import { Camera, Save, ChevronDown, ChevronUp, Image as ImageIcon, Loader2, Trash2, TrendingUp, TrendingDown, Eye, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function ExpandableTradeRow({ trade }: { trade: Trade & { netProfit: number } }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [notes, setNotes] = React.useState(() => {
    const rawNotes = trade.notes || '';
    return rawNotes.replace(/\s*#rating-[1-5]/g, '').trim();
  });
  const [rating, setRating] = React.useState(() => {
    const match = trade.notes?.match(/#rating-([1-5])/);
    return match ? parseInt(match[1]) : 0;
  });
  const [screenshotUrl, setScreenshotUrl] = React.useState(trade.screenshot_url || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isWin = trade.netProfit >= 0;
  
  const tradeTypeRaw = trade.type ? trade.type.replace('DEAL_TYPE_', '').toUpperCase() : 'TRADE';
  const isBuy = tradeTypeRaw.includes('BUY');
  const isSell = tradeTypeRaw.includes('SELL');
  let typeColor = 'bg-slate-500/20 text-slate-400';
  if (isBuy) typeColor = 'bg-blue-500/20 text-blue-400';
  if (isSell) typeColor = 'bg-rose-500/20 text-rose-400';

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalNotes = notes;
      if (rating > 0) {
        finalNotes += `\n\n#rating-${rating}`;
      }

      const res = await fetch(`/api/trades/${trade.ticket_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: finalNotes.trim(), screenshot_url: screenshotUrl })
      });
      if (!res.ok) throw new Error('Failed to save');
      
      trade.notes = finalNotes.trim();
      trade.screenshot_url = screenshotUrl;
      router.refresh();
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      alert("Error saving notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${trade.ticket_id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('trade_screenshots')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('trade_screenshots')
        .getPublicUrl(filePath);

      setScreenshotUrl(publicUrl);
    } catch (error: any) {
      alert("Error uploading screenshot: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const renderStars = (currentRating: number, onRate: (r: number) => void) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className={`p-1 transition-colors ${star <= currentRating ? 'text-amber-400' : 'text-muted-foreground hover:text-amber-400/50'}`}
            title={`${star} Star`}
          >
            <Star className={`w-4 h-4 ${star <= currentRating ? 'fill-amber-400' : 'fill-transparent'}`} />
          </button>
        ))}
        {currentRating > 0 && (
          <button onClick={() => onRate(0)} className="ml-1 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground">Clear</button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col relative group hover:border-border transition-colors">
      {/* Left Border Status */}
      <div className={`w-1.5 absolute left-0 top-0 bottom-0 ${isWin ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      
      {/* Main Row */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex-1 p-4 pl-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {isWin ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
          <div>
            <div className="font-semibold text-foreground flex items-center gap-2">
              {trade.symbol}
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider ${typeColor}`}>
                {tradeTypeRaw}
              </span>
              {(notes || screenshotUrl || rating > 0) && (
                <div className="w-2 h-2 rounded-full bg-indigo-500" title="Has journal entry"></div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 flex gap-3">
              {trade.volume !== undefined && trade.volume > 0 && (
                <span>Vol: <span className="text-foreground font-mono">{trade.volume}</span></span>
              )}
              <span>Entry: <span className="text-foreground font-mono">{trade.open_price}</span></span>
              <span>Exit: <span className="text-foreground font-mono">{trade.close_price}</span></span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6">
          <div className="text-right">
            <div className={`text-lg font-bold font-mono ${isWin ? 'text-emerald-400' : 'text-rose-500'}`}>
              {isWin ? '+' : ''}${trade.netProfit.toFixed(2)}
            </div>
            <div className="text-[10px] text-muted-foreground flex flex-col items-end gap-1">
              <span>{new Date(trade.open_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(trade.close_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {rating > 0 && (
                <div className="flex text-amber-400">
                  {Array(rating).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                </div>
              )}
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-white/5">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Area */}
      {isExpanded && (
        <div className="p-4 pl-6 border-t border-border/50 bg-black/20 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trade Notes & Lessons</label>
              {renderStars(rating, setRating)}
            </div>
            <textarea 
              placeholder="Why did you take this trade? What did you learn?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full flex min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
            <Button 
              onClick={handleSave} 
              disabled={isSaving || isSaved} 
              size="sm" 
              className={isSaved ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : isSaved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Journal'}
            </Button>
          </div>
          
          <div className="w-full md:w-64 space-y-3 flex flex-col">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Screenshot</label>
            <div 
              onClick={() => !screenshotUrl && fileInputRef.current?.click()}
              className={`flex-1 min-h-[120px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center relative overflow-hidden transition-colors ${!screenshotUrl ? 'cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5' : ''}`}
            >
              {screenshotUrl ? (
                <>
                  <a href={screenshotUrl} target="_blank" rel="noreferrer" className="w-full h-full block">
                    <img src={screenshotUrl} alt="Trade Screenshot" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                  </a>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setScreenshotUrl(''); }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-md hover:bg-rose-500 transition-colors"
                    title="Remove Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center p-4">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-2" />
                  ) : (
                    <Camera className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  )}
                  <span className="text-xs text-muted-foreground font-medium">
                    {isUploading ? 'Uploading...' : 'Click to add screenshot'}
                  </span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />
          </div>
        </div>
      )}
    </div>
  );
}

export function DayDetailsModal({ isOpen, onClose, date, trades }: DayDetailsModalProps) {
  if (!isOpen) return null;

  const validTrades = trades.filter(t => t.type !== 'BALANCE' && t.type !== 'DEAL_TYPE_BALANCE');
  const sortedTrades = [...validTrades].sort((a, b) => new Date(a.close_time).getTime() - new Date(b.close_time).getTime());

  // Calculate Metrics
  let totalProfit = 0;
  let wins = 0;
  let grossWin = 0;
  let grossLoss = 0;

  const chartData = [{ time: 'Start', pnl: 0 }];
  let cumulative = 0;

  const processedTrades = sortedTrades.map(trade => {
    const netProfit = Number(trade.profit) + Number(trade.swap || 0) + Number(trade.commission || 0);
    totalProfit += netProfit;
    cumulative += netProfit;
    
    if (netProfit > 0) {
      wins++;
      grossWin += netProfit;
    } else if (netProfit < 0) {
      grossLoss += netProfit;
    }

    const timeStr = new Date(trade.close_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    chartData.push({ time: timeStr, pnl: Number(cumulative.toFixed(2)) });

    return { ...trade, netProfit };
  });

  const totalTrades = processedTrades.length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const avgWin = wins > 0 ? grossWin / wins : 0;
  const losses = totalTrades - wins;
  const avgLoss = losses > 0 ? grossLoss / losses : 0;

  const isPositiveDay = totalProfit >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[800px] md:max-w-4xl lg:max-w-5xl bg-background border-border text-slate-50 p-0 overflow-hidden shadow-2xl">
        <div className="p-6 pb-2 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-3">
              Trading Day: {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Top Section: Chart & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Chart Area */}
            <div className="lg:col-span-3 bg-card rounded-xl border border-border p-5 relative">
              <div className="mb-4">
                <span className="text-sm font-semibold text-muted-foreground mr-2">Day P/L</span>
                <span className={`text-xl font-bold ${isPositiveDay ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {isPositiveDay ? '+' : ''}${totalProfit.toFixed(2)}
                </span>
              </div>
              
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isPositiveDay ? '#34d399' : '#f43f5e'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isPositiveDay ? '#34d399' : '#f43f5e'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      dy={10}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e2330', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Cumulative P/L']}
                    />
                    <Area 
                      type="stepAfter" 
                      dataKey="pnl" 
                      stroke={isPositiveDay ? '#34d399' : '#f43f5e'} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPnl)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-center">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Trades</div>
                <div className="text-xl font-bold text-foreground">{totalTrades}</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-center">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Win Rate %</div>
                <div className="text-xl font-bold text-foreground">{winRate.toFixed(1)}%</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-center">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Average Win</div>
                <div className="text-xl font-bold text-emerald-400">+${avgWin.toFixed(2)}</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col justify-center">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Average Loss</div>
                <div className="text-xl font-bold text-rose-500">${avgLoss.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Trades List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Trade History</h4>
            {processedTrades.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border">
                No trades recorded for this day.
              </div>
            ) : (
              processedTrades.map((trade, i) => (
                <ExpandableTradeRow key={`${trade.ticket_id}-${i}`} trade={trade} />
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
