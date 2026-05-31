export function TradeHistoryTable({ trades = [] }: { trades?: any[] }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="bg-transparent border-transparent rounded-2xl p-6 text-center text-muted-foreground text-sm">
        No trades found in history.
      </div>
    );
  }

  return (
    <div className="bg-transparent border-transparent rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border shrink-0">
        <h3 className="font-medium text-foreground">Recent Trades</h3>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1 h-full">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-background sticky top-0 [&_tr]:border-b [&_tr]:border-border">
            <tr className="border-b border-border hover:bg-transparent data-[state=selected]:bg-muted">
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Symbol</th>
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
              <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Volume</th>
              <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Open Price</th>
              <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Close Price</th>
              <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Net P&L</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {trades.slice(0, 100).map((trade, index) => {
              const profit = Number(trade.profit) + Number(trade.swap) + Number(trade.commission);
              const isWin = profit > 0;
              
              return (
                <tr key={trade.id || `trade-${index}`} className="border-b border-border transition-colors hover:bg-white/5 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle text-foreground font-mono text-xs whitespace-nowrap">
                    {new Date(trade.close_time).toLocaleString()}
                  </td>
                  <td className="p-4 align-middle font-medium text-foreground">
                    {trade.symbol}
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      trade.type === 'DEAL_TYPE_BUY' ? 'bg-emerald-500/10 text-emerald-400' : 
                      trade.type === 'DEAL_TYPE_SELL' ? 'bg-rose-500/10 text-rose-400' : 
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {trade.type.replace('DEAL_TYPE_', '')}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right text-foreground">
                    {trade.volume}
                  </td>
                  <td className="p-4 align-middle text-right text-foreground font-mono text-xs">
                    {trade.open_price || '-'}
                  </td>
                  <td className="p-4 align-middle text-right text-foreground font-mono text-xs">
                    {trade.close_price || '-'}
                  </td>
                  <td className={`p-4 align-middle text-right font-medium ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {profit > 0 ? '+' : ''}{profit.toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {trades.length > 100 && (
        <div className="p-3 text-center text-xs text-muted-foreground border-t border-border">
          Showing 100 most recent trades
        </div>
      )}
    </div>
  )
}
