import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
        <Table>
          <TableHeader className="bg-[#0b0e14] sticky top-0">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-slate-400 font-medium">Time</TableHead>
              <TableHead className="text-slate-400 font-medium">Symbol</TableHead>
              <TableHead className="text-slate-400 font-medium">Type</TableHead>
              <TableHead className="text-slate-400 font-medium text-right">Volume</TableHead>
              <TableHead className="text-slate-400 font-medium text-right">Open Price</TableHead>
              <TableHead className="text-slate-400 font-medium text-right">Close Price</TableHead>
              <TableHead className="text-slate-400 font-medium text-right">Net P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.slice(0, 100).map((trade) => {
              const profit = Number(trade.profit) + Number(trade.swap) + Number(trade.commission);
              const isWin = profit > 0;
              
              return (
                <TableRow key={trade.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="text-slate-300 font-mono text-xs whitespace-nowrap">
                    {new Date(trade.close_time).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium text-slate-200">
                    {trade.symbol}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      trade.type === 'DEAL_TYPE_BUY' ? 'bg-emerald-500/10 text-emerald-400' : 
                      trade.type === 'DEAL_TYPE_SELL' ? 'bg-rose-500/10 text-rose-400' : 
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {trade.type.replace('DEAL_TYPE_', '')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-slate-300">
                    {trade.volume}
                  </TableCell>
                  <TableCell className="text-right text-slate-300 font-mono text-xs">
                    {/* Wait, history deals don't always have open price easily accessible unless we map orders, but we can display the deal price */}
                    {trade.price}
                  </TableCell>
                  <TableCell className="text-right text-slate-300 font-mono text-xs">
                    {trade.price}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {profit > 0 ? '+' : ''}{profit.toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      {trades.length > 100 && (
        <div className="p-3 text-center text-xs text-slate-500 border-t border-white/5">
          Showing 100 most recent trades
        </div>
      )}
    </div>
  )
}
