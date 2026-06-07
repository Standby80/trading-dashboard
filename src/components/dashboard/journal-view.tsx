'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Image as ImageIcon, FileText, ChevronRight, Hash, Clock, Maximize2, BookOpen, Pencil, Save, Loader2, Trash2, Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function JournalView({ trades }: { trades: any[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'WINS' | 'LOSSES'>('ALL');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editScreenshotUrl, setEditScreenshotUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse all unique hashtags from notes
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    trades.forEach(t => {
      if (t.notes) {
        const matches = t.notes.match(/#(\w+)/g);
        if (matches) matches.forEach((m: string) => tags.add(m));
      }
    });
    return Array.from(tags).sort();
  }, [trades]);

  // Filter trades based on search, filter, and tag
  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const isWin = (t.profit || 0) + (t.swap || 0) + (t.commission || 0) >= 0;
      
      // Filter Win/Loss
      if (filter === 'WINS' && !isWin) return false;
      if (filter === 'LOSSES' && isWin) return false;

      // Filter by Tag
      if (activeTag && (!t.notes || !t.notes.includes(activeTag))) return false;

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSymbol = t.symbol?.toLowerCase().includes(query);
        const matchesNote = t.notes?.toLowerCase().includes(query);
        if (!matchesSymbol && !matchesNote) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.close_time).getTime() - new Date(a.close_time).getTime());
  }, [trades, filter, activeTag, searchQuery]);

  const selectedTrade = useMemo(() => {
    return trades.find(t => t.ticket_id === selectedTradeId) || null;
  }, [trades, selectedTradeId]);

  // Auto-select first trade if none selected
  React.useEffect(() => {
    if (!selectedTradeId && filteredTrades.length > 0) {
      setSelectedTradeId(filteredTrades[0].ticket_id);
    }
  }, [filteredTrades, selectedTradeId]);

  // Reset edit state when selected trade changes
  React.useEffect(() => {
    if (selectedTrade) {
      setIsEditing(false);
      setEditNotes(selectedTrade.notes || '');
      setEditScreenshotUrl(selectedTrade.screenshot_url || '');
    }
  }, [selectedTradeId, selectedTrade]);

  const handleSave = async () => {
    if (!selectedTrade) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/trades/${selectedTrade.ticket_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editNotes, screenshot_url: editScreenshotUrl })
      });
      if (!res.ok) throw new Error('Failed to save');
      
      setIsEditing(false);
      router.refresh(); // Refresh data from server
    } catch (e) {
      alert("Error saving notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedTrade) return;
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${selectedTrade.ticket_id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('trade_screenshots')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('trade_screenshots')
        .getPublicUrl(filePath);

      setEditScreenshotUrl(publicUrl);
    } catch (error: any) {
      alert("Error uploading screenshot: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-xl overflow-hidden shadow-xl">
      
      {/* Top Bar: Search, Filters, Tags */}
      <div className="p-4 border-b border-border bg-card shrink-0 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes or symbols..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border w-full md:w-auto">
            <button 
              onClick={() => setFilter('ALL')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'ALL' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('WINS')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'WINS' ? 'bg-emerald-500/20 text-emerald-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              Wins
            </button>
            <button 
              onClick={() => setFilter('LOSSES')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'LOSSES' ? 'bg-rose-500/20 text-rose-400' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              Losses
            </button>
          </div>
        </div>

        {/* Tags Row */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase mr-1 flex items-center"><Hash className="w-3 h-3 mr-1" /> Tags:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${activeTag === tag ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-background border-border text-muted-foreground hover:border-indigo-500/50 hover:text-indigo-400'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Split Screen Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Column: Trade List */}
        <div className="w-full md:w-[350px] border-r border-border bg-card/50 overflow-y-auto shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filteredTrades.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <FileText className="w-8 h-8 mb-3 opacity-20" />
              <p>No journal entries found.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/50">
              {filteredTrades.map((trade) => {
                const isSelected = selectedTradeId === trade.ticket_id;
                const netProfit = (trade.profit || 0) + (trade.swap || 0) + (trade.commission || 0);
                const isWin = netProfit >= 0;
                
                return (
                  <div key={trade.ticket_id} className={`w-full text-left p-4 transition-colors relative group ${isSelected ? 'bg-indigo-500/10' : 'hover:bg-white/5'}`}>
                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
                    
                    <div 
                      onClick={() => setSelectedTradeId(trade.ticket_id)}
                      className="cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isWin ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          <span className="font-bold text-foreground">{trade.symbol}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            (trade.type === 'DEAL_TYPE_BUY' || trade.type === 'BUY') 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {(trade.type === 'DEAL_TYPE_BUY' || trade.type === 'BUY') ? 'BUY' : 'SELL'}
                          </span>
                        </div>
                        <span className={`font-mono font-bold ${isWin ? 'text-emerald-400' : 'text-rose-500'}`}>
                          {isWin ? '+' : ''}${netProfit.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-3 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(trade.close_time).toLocaleDateString()} {new Date(trade.close_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1 text-foreground/60" title="Holding Time">
                          <TrendingUp className="w-3 h-3 opacity-50" />
                          {(() => {
                            const ms = new Date(trade.close_time).getTime() - new Date(trade.open_time).getTime();
                            const mins = Math.floor(ms / 60000);
                            const hours = Math.floor(mins / 60);
                            const days = Math.floor(hours / 24);
                            if (days > 0) return `${days}d ${hours % 24}h`;
                            if (hours > 0) return `${hours}h ${mins % 60}m`;
                            return `${mins}m`;
                          })()}
                        </div>
                      </div>

                      <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                        {trade.notes || <span className="italic text-muted-foreground">No notes written...</span>}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-2">
                        {trade.screenshot_url && <ImageIcon className="w-4 h-4 text-indigo-400" />}
                        {trade.notes && trade.notes.match(/#\w+/g)?.map((tag: string) => (
                          <span key={tag} className="text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this journal entry?')) {
                            try {
                              const res = await fetch(`/api/trades/${trade.ticket_id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ notes: '', screenshot_url: '' })
                              });
                              if (res.ok) router.refresh();
                            } catch (err) {
                              alert('Failed to delete journal entry.');
                            }
                          }
                        }}
                        className="text-muted-foreground hover:text-rose-500 transition-colors p-1 rounded hover:bg-rose-500/10"
                        title="Delete Journal Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detail View */}
        <div className="hidden md:flex flex-1 flex-col overflow-y-auto bg-background p-6 lg:p-10 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {selectedTrade ? (
            <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                  <h2 className="text-3xl font-black text-foreground mb-2">{selectedTrade.symbol}</h2>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(selectedTrade.open_time).toLocaleString()}</span>
                    <span>→</span>
                    <span>{new Date(selectedTrade.close_time).toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Net P/L</div>
                  <div className={`text-3xl font-mono font-black ${((selectedTrade.profit || 0) + (selectedTrade.swap || 0) + (selectedTrade.commission || 0)) >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {((selectedTrade.profit || 0) + (selectedTrade.swap || 0) + (selectedTrade.commission || 0)) >= 0 ? '+' : ''}${((selectedTrade.profit || 0) + (selectedTrade.swap || 0) + (selectedTrade.commission || 0)).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Trade Stats Bar */}
              <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-card border border-border">
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Type</div>
                  <div className="font-medium text-foreground">{selectedTrade.type === 'DEAL_TYPE_BUY' || selectedTrade.type === 'BUY' ? 'LONG' : 'SHORT'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Volume</div>
                  <div className="font-medium text-foreground">{selectedTrade.volume}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Entry Price</div>
                  <div className="font-mono text-foreground">{selectedTrade.open_price}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Exit Price</div>
                  <div className="font-mono text-foreground">{selectedTrade.close_price}</div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Journal Notes
                  </h3>
                  {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-foreground">
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Journal
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea 
                      placeholder="Why did you take this trade? What did you learn?"
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                      className="w-full flex min-h-[150px] rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div 
                        onClick={() => !editScreenshotUrl && fileInputRef.current?.click()}
                        className={`w-full sm:w-64 min-h-[100px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center relative overflow-hidden transition-colors ${!editScreenshotUrl ? 'cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5' : ''}`}
                      >
                        {editScreenshotUrl ? (
                          <>
                            <a href={editScreenshotUrl} target="_blank" rel="noreferrer" className="w-full h-full block absolute inset-0">
                              <img src={editScreenshotUrl} alt="Screenshot" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                            </a>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditScreenshotUrl(''); }}
                              className="absolute top-2 right-2 z-10 bg-black/60 text-white p-1.5 rounded-md hover:bg-rose-500 transition-colors"
                              title="Remove Image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            {isUploading ? (
                              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin mx-auto mb-1" />
                            ) : (
                              <Camera className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                            )}
                            <span className="text-[10px] text-muted-foreground font-medium uppercase">
                              {isUploading ? 'Uploading...' : 'Add screenshot'}
                            </span>
                          </div>
                        )}
                      </div>
                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />

                      <div className="flex-1 flex justify-end gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
                        <Button size="sm" onClick={handleSave} disabled={isSaving || isUploading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-card border border-border rounded-xl">
                    {selectedTrade.notes ? (
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                        {selectedTrade.notes.split(/(#\w+)/g).map((part: string, i: number) => {
                          if (part.startsWith('#')) return <span key={i} className="text-indigo-400 font-semibold">{part}</span>;
                          return <span key={i}>{part}</span>;
                        })}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">No notes were written for this trade.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Screenshot (View Mode) */}
              {!isEditing && selectedTrade.screenshot_url && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                    Screenshot
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-border bg-card group relative">
                    <a href={selectedTrade.screenshot_url} target="_blank" rel="noreferrer" className="block w-full">
                      <img 
                        src={selectedTrade.screenshot_url} 
                        alt="Trade execution" 
                        className="w-full h-auto object-contain max-h-[600px]"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="flex items-center gap-2 text-white font-semibold bg-black/60 px-4 py-2 rounded-full">
                          <Maximize2 className="w-4 h-4" />
                          View Full Size
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <BookOpen className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Select a trade from the timeline to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
