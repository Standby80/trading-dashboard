import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AssetData {
  symbol: string;
  netProfit: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
}

interface SideData {
  count: number;
  winRate: number;
  netProfit: number;
}

interface MarketAnalysisProps {
  assetPerformance: AssetData[];
  sideSplit: {
    longs: SideData;
    shorts: SideData;
  };
}

export function MarketAnalysisModule({ assetPerformance, sideSplit }: MarketAnalysisProps) {
  // Data för pajdiagrammet
  const pieData = [
    { name: 'Longs (Buys)', value: sideSplit.longs.count, profit: sideSplit.longs.netProfit, winRate: sideSplit.longs.winRate },
    { name: 'Shorts (Sells)', value: sideSplit.shorts.count, profit: sideSplit.shorts.netProfit, winRate: sideSplit.shorts.winRate }
  ];

  // Neon-indigo för köp, neon-rosa/lila för sälj för att hålla cyber-temat
  const COLORS = ['#6366f1', '#a855f7'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full h-full">
      
      {/* Tillgångar / Symbol-tabell (Tar upp 2/3 av bredden på stora skärmar) */}
      <div className="xl:col-span-2 bg-[#0b0e14] border border-[#1e2330] p-5 rounded-xl min-w-0 flex flex-col h-full">
        <h3 className="text-gray-400 text-sm font-medium mb-4 shrink-0">Asset Performance Matrix</h3>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1e2330] text-gray-500 font-mono uppercase tracking-wider">
                <th className="pb-3 pl-2">Symbol</th>
                <th className="pb-3 text-right">Trades</th>
                <th className="pb-3 text-right">Win Rate</th>
                <th className="pb-3 text-right">Profit Factor</th>
                <th className="pb-3 text-right pr-2">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141923]">
              {assetPerformance.map((asset) => (
                <tr key={asset.symbol} className="hover:bg-[#10141d]/50 transition-colors group">
                  <td className="py-3 pl-2 font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors">{asset.symbol}</td>
                  <td className="py-3 text-right font-mono text-gray-400">{asset.totalTrades}</td>
                  <td className="py-3 text-right font-mono text-gray-300">{asset.winRate.toFixed(1)}%</td>
                  <td className="py-3 text-right font-mono text-gray-300">
                    {isNaN(asset.profitFactor) || asset.profitFactor === Infinity || asset.profitFactor === 0
                      ? '—' 
                      : asset.profitFactor.toFixed(2)}
                  </td>
                  <td className={`py-3 text-right font-mono font-bold pr-2 ${asset.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                    ${asset.netProfit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Riktning / Long vs Short Pajdiagram (Tar upp 1/3 av bredden) */}
      <div className="bg-[#0b0e14] border border-[#1e2330] p-5 rounded-xl flex flex-col justify-between h-full">
        <div className="shrink-0">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Directional Bias Analysis</h3>
          <p className="text-[11px] text-gray-500 mb-4 font-mono">Volume Distribution and Profitability per Order Type</p>
        </div>
        
        <div className="h-[200px] w-full relative my-auto flex-1">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0b0e14" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f131a', borderColor: '#1e2330', borderRadius: '8px' }}
                formatter={(value: any, name: any, props: any) => [
                  `${value} trades (WR: ${props.payload.winRate.toFixed(1)}%, Net: $${props.payload.profit.toFixed(2)})`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Totalmätare i mitten av hjulet */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase text-gray-500 font-mono tracking-wider">Total</span>
            <span className="text-xl font-bold text-gray-200 font-mono">{sideSplit.longs.count + sideSplit.shorts.count}</span>
          </div>
        </div>

        {/* Custom Legend / Mini-stats för botten av pajdiagrammet */}
        <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-[#141923] pt-3 mt-2 font-mono shrink-0">
          <div className="flex flex-col pl-2 border-l-2 border-indigo-500">
            <span className="text-gray-500">Longs Net</span>
            <span className={`font-bold ${sideSplit.longs.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
              ${sideSplit.longs.netProfit.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col pl-2 border-l-2 border-purple-500">
            <span className="text-gray-500">Shorts Net</span>
            <span className={`font-bold ${sideSplit.shorts.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
              ${sideSplit.shorts.netProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
