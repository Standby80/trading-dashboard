import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, Cell } from 'recharts';

interface TimeAnalysisProps {
  hourlyData: Array<{ hour: number; netProfit: number; tradeCount: number }>;
  weekdayData: Array<{ day: string; netProfit: number; winRate: number }>;
}

export function TimeAnalysisCharts({ hourlyData, weekdayData }: TimeAnalysisProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full col-span-full">
      {/* Timdistribution */}
      <div className="bg-[#0b0e14] border border-[#1e2330] p-5 rounded-xl">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Net Profit per Hour (Closing Time)</h3>
        <div className="h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#141923" />
              <XAxis dataKey="hour" stroke="#4b5563" fontSize={11} tickFormatter={(v) => `${v}:00`} />
              <YAxis stroke="#4b5563" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f131a', borderColor: '#1e2330', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Net Profit']}
              />
              <ReferenceLine y={0} stroke="#1e2330" />
              <Bar dataKey="netProfit" radius={[4, 4, 0, 0]}>
                {hourlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.netProfit >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Veckodagsdistribution */}
      <div className="bg-[#0b0e14] border border-[#1e2330] p-5 rounded-xl">
        <h3 className="text-gray-400 text-sm font-medium mb-4">Performance by Weekday</h3>
        <div className="h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={weekdayData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#141923" />
              <XAxis dataKey="day" stroke="#4b5563" fontSize={11} />
              <YAxis stroke="#4b5563" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f131a', borderColor: '#1e2330', borderRadius: '8px' }}
                formatter={(value: any, name: any, props: any) => {
                  if (name === "netProfit") return [`$${Number(value).toFixed(2)}`, 'Net Profit'];
                  return [`${Number(value).toFixed(1)}%`, 'Win Rate'];
                }}
              />
              <ReferenceLine y={0} stroke="#1e2330" />
              <Bar dataKey="netProfit" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
