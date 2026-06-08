import React from 'react';
import { Coins, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface AssetPerformanceData {
  symbol: string;
  netProfit: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
}

export function SymbolPerformanceWidget({ data = [] }: { data?: AssetPerformanceData[] }) {
  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm shrink-0 flex items-center justify-between">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <Coins className="w-5 h-5 text-indigo-400" />
          Symbol Performance
        </h3>
        <div className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
          {data.length} Symbols Traded
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <Activity className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm">No symbol data available</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b border-border">
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Symbol</th>
                <th className="h-10 px-4 text-center font-medium text-muted-foreground">Trades</th>
                <th className="h-10 px-4 text-center font-medium text-muted-foreground">Win Rate</th>
                <th className="h-10 px-4 text-right font-medium text-muted-foreground">Net P&L</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0 divide-y divide-border/50">
              {data.map((asset) => {
                const isProfitable = asset.netProfit >= 0;
                
                return (
                  <tr key={asset.symbol} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 px-4 font-bold text-foreground">
                      {asset.symbol}
                    </td>
                    <td className="p-3 px-4 text-center text-foreground font-mono">
                      {asset.totalTrades}
                    </td>
                    <td className="p-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1 w-full max-w-[80px] mx-auto">
                        <span className={`font-bold font-mono ${asset.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {asset.winRate.toFixed(1)}%
                        </span>
                        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border">
                          <div 
                            className={`h-full rounded-full ${asset.winRate >= 50 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(100, Math.max(0, asset.winRate))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className={`p-3 px-4 text-right font-mono font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-500'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {isProfitable ? <TrendingUp className="w-3 h-3 opacity-70" /> : <TrendingDown className="w-3 h-3 opacity-70" />}
                        {isProfitable ? '+' : ''}${asset.netProfit.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
