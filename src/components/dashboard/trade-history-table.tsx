export function TradeHistoryTable({ trades = [] }: { trades?: any[] }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="bg-[#131823] border border-white/5 rounded-2xl p-6 text-center text-slate-500 text-sm">
        No trades found in history.
      </div>
    );
  }

  return (
    <div className="bg-[#131823] border border-white/5 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="font-medium text-slate-200">Recent Trades</h3>
      </div>
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-[#0b0e14] sticky top-0 [&_tr]:border-b [&_tr]:border-white/5">
            <tr className="border-b border-white/5 hover:bg-transparent data-[state=selected]:bg-muted">
              <th className="h-10 px-4 text-left align-middle font-medium text-slate-400">Time</th>
              <th className="h-10 px-4 text-left align-middle font-medium text-slate-400">Symbol</th>
              <th className="h-10 px-4 text-left align-middle font-medium text-slate-400">Type</th>
              <th className="h-10 px-4 text-right align-middle font-medium text-slate-400">Volume</th>
              <th className="h-10 px-4 text-right align-middle font-medium text-slate-400">Open Price</th>
              <th className="h-10 px-4 text-right align-middle font-medium text-slate-400">Close Price</th>
              <th className="h-10 px-4 text-right align-middle font-medium text-slate-400">Net P&L</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {trades.slice(0, 100).map((trade) => {
              const profit = Number(trade.profit) + Number(trade.swap) + Number(trade.commission);
              const isWin = profit > 0;
              
              return (
                <tr key={trade.id} className="border-b border-white/5 transition-colors hover:bg-white/5 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle text-slate-300 font-mono text-xs whitespace-nowrap">
                    {new Date(trade.close_time).toLocaleString()}
                  </td>
                  <td className="p-4 align-middle font-medium text-slate-200">
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
                  <td className="p-4 align-middle text-right text-slate-300">
                    {trade.volume}
                  </td>
                  <td className="p-4 align-middle text-right text-slate-300 font-mono text-xs">
                    {trade.price}
                  </td>
                  <td className="p-4 align-middle text-right text-slate-300 font-mono text-xs">
                    {trade.price}
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
        <div className="p-3 text-center text-xs text-slate-500 border-t border-white/5">
          Showing 100 most recent trades
        </div>
      )}
    </div>
  )
}
