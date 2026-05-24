'use client'

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider as WP, Layout } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { RotateCcw } from 'lucide-react';

// Import components
import { TradingCalendar } from "@/components/dashboard/trading-calendar";
import { AnalyticsSidebar } from "@/components/dashboard/analytics-sidebar";
import { TradeHistoryTable } from "@/components/dashboard/trade-history-table";
import { LongShortCharts } from "@/components/dashboard/long-short-charts";
import { DrawdownChart } from "@/components/dashboard/drawdown-chart";
import { TradeExecutionWidget, TimeAnalyticsWidget } from "@/components/dashboard/advanced-metrics";
import { ExpectancyCurve } from "@/components/dashboard/expectancy-curve";
import { TimeExtremesCards } from "@/components/dashboard/time-extremes-cards";
import { MonthlyHeatmap } from "@/components/dashboard/monthly-heatmap";
import { MetricCard } from "@/components/dashboard/metric-card";

const ResponsiveGridLayout = WP(Responsive);

export function DashboardGrid({ data }: { data: any }) {
  const [mounted, setMounted] = useState(false);
  const [layoutState, setLayoutState] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const savedLayouts = localStorage.getItem('metametrics-layout');
    if (savedLayouts) {
      try {
        setLayoutState(JSON.parse(savedLayouts));
      } catch (e) {}
    }
  }, []);

  const defaultLayouts = {
    lg: [
      // Row 1: Top 5 KPIs
      { i: 'metric-equity', x: 0, y: 0, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-netpnl', x: 12, y: 0, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-winrate', x: 24, y: 0, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-pf', x: 36, y: 0, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-trades', x: 48, y: 0, w: 12, h: 2, minW: 3, minH: 2 },
      
      // Row 2: Secondary KPIs
      { i: 'metric-avgwin', x: 0, y: 2, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-avgloss', x: 12, y: 2, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-sharpe', x: 24, y: 2, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-maxdd', x: 36, y: 2, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-expectancy', x: 48, y: 2, w: 12, h: 2, minW: 3, minH: 2 },
      
      // Row 3: Additional KPIs
      { i: 'metric-winning', x: 0, y: 4, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-losing', x: 12, y: 4, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-best', x: 24, y: 4, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-worst', x: 36, y: 4, w: 12, h: 2, minW: 3, minH: 2 },
      { i: 'metric-growth', x: 48, y: 4, w: 12, h: 2, minW: 3, minH: 2 },
      
      // Row 4: Calendar & MetaMetrics
      { i: 'calendar', x: 0, y: 6, w: 40, h: 10, minW: 5, minH: 5 },
      { i: 'asset-performance', x: 40, y: 6, w: 20, h: 10, minW: 5, minH: 5 },
      
      // Row 5: Monthly P/L & Long vs Short
      { i: 'performance-matrix', x: 0, y: 16, w: 40, h: 10, minW: 5, minH: 5 },
      { i: 'long-short', x: 40, y: 16, w: 20, h: 10, minW: 5, minH: 5 },
      
      // Row 6: Trade Execution & Time Analytics
      { i: 'trade-execution', x: 0, y: 26, w: 30, h: 8, minW: 5, minH: 5 },
      { i: 'trades-analysis', x: 30, y: 26, w: 30, h: 8, minW: 5, minH: 5 },
      
      // Row 7: Expectancy Curve
      { i: 'expectancy-curve', x: 0, y: 34, w: 60, h: 9, minW: 5, minH: 5 },
      
      // Row 8: Recent Trades
      { i: 'recent-trades', x: 0, y: 43, w: 60, h: 10, minW: 5, minH: 5 },
    ]
  };

  const handleLayoutChange = (layout: any, layouts: any) => {
    setLayoutState(layouts);
    localStorage.setItem('metametrics-layout-v2', JSON.stringify(layouts));
  };

  const resetLayout = () => {
    localStorage.removeItem('metametrics-layout-v2');
    setLayoutState(null); // Force it to use defaultLayouts on next render
  };

  if (!mounted) {
    return <div className="flex h-64 items-center justify-center text-slate-500">Loading dynamic layout...</div>;
  }

  const DragHandle = () => (
    <div className="drag-handle w-full h-4 cursor-move bg-white/5 rounded-t-xl hover:bg-white/10 transition-colors flex items-center justify-center group shrink-0">
      <div className="w-8 h-1 bg-white/10 group-hover:bg-white/30 rounded-full transition-colors"></div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-2">
      <ResponsiveGridLayout
        className="layout"
        layouts={layoutState || defaultLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 60, md: 40, sm: 20, xs: 10, xxs: 5 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        margin={[24, 24]}
      >
        {/* Metric Cards Row 1 */}
        <div key="metric-netpnl" data-grid={{ x: 0, y: 0, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Net P&L" 
                value={`$${Math.abs(data?.kpis?.netProfit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                trend={(data?.kpis?.netProfit || 0) >= 0 ? 'positive' : 'negative'}
                tooltip="Total realized profit or loss across all trades."
            />
        </div>
        <div key="metric-pf" data-grid={{ x: 12, y: 0, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Profit Factor" 
                value={(data?.kpis?.profitFactor || 0).toFixed(2)}
                trend={(data?.kpis?.profitFactor || 0) >= 1 ? 'positive' : 'negative'}
                tooltip="Gross profit divided by gross loss. A value above 1 indicates profitability."
            />
        </div>
        <div key="metric-winrate" data-grid={{ x: 24, y: 0, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Win Rate" 
                value={`${(data?.kpis?.totalTrades > 0 ? (data?.kpis?.winningTrades / data?.kpis?.totalTrades * 100) : 0).toFixed(2)}%`}
                trend="positive"
                tooltip="Percentage of winning trades out of total trades."
            />
        </div>
        <div key="metric-expectancy" data-grid={{ x: 36, y: 0, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Expectancy (R)" 
                value={(data?.kpis?.expectancy || 0).toFixed(2)}
                trend={(data?.kpis?.expectancy || 0) > 0 ? 'positive' : 'negative'}
                tooltip="Average R-multiple returned per trade."
            />
        </div>
        <div key="metric-trades" data-grid={{ x: 48, y: 0, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Total Trades" 
                value={data?.kpis?.totalTrades || 0}
                trend="neutral"
                tooltip="Total number of completed trades."
            />
        </div>

        {/* Metric Cards Row 2 */}
        <div key="metric-equity" data-grid={{ x: 0, y: 2, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Account Value" 
                value={`$${Math.abs(data?.kpis?.currentBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                trend="neutral"
                tooltip="Current total balance of your account."
            />
        </div>
        <div key="metric-maxdd" data-grid={{ x: 12, y: 2, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Max Drawdown" 
                value={`${((data?.kpis?.maxDrawdownDol || 0) / (data?.kpis?.peakBalance || 1) * 100).toFixed(2)}%`}
                trend="negative"
                tooltip="Largest percentage drop from a peak to a trough in equity."
            />
        </div>
        <div key="metric-avgwin" data-grid={{ x: 24, y: 2, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Average Win" 
                value={`$${(data?.kpis?.avgWin || 0).toFixed(2)}`}
                trend="positive"
                tooltip="Average profit amount per winning trade."
            />
        </div>
        <div key="metric-avgloss" data-grid={{ x: 36, y: 2, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Average Loss" 
                value={`-$${(data?.kpis?.avgLoss || 0).toFixed(2)}`}
                trend="negative"
                tooltip="Average loss amount per losing trade."
            />
        </div>
        <div key="metric-sharpe" data-grid={{ x: 48, y: 2, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Sharpe Ratio" 
                value={(data?.kpis?.sharpeRatio || 0).toFixed(2)}
                trend="positive"
                tooltip="Measures risk-adjusted return. Higher is better."
            />
        </div>

        {/* Metric Cards Row 3 */}
        <div key="metric-winning" data-grid={{ x: 0, y: 4, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Winning Trades" 
                value={data?.kpis?.winningTrades || 0}
                trend="positive"
                tooltip="Total number of trades that resulted in a profit."
            />
        </div>
        <div key="metric-losing" data-grid={{ x: 12, y: 4, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Losing Trades" 
                value={data?.kpis?.losingTrades || 0}
                trend="negative"
                tooltip="Total number of trades that resulted in a loss."
            />
        </div>
        <div key="metric-best" data-grid={{ x: 24, y: 4, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Best Trade" 
                value={`$${(data?.kpis?.bestTrade || 0).toFixed(2)}`}
                trend="positive"
                tooltip="The single trade with the highest profit."
            />
        </div>
        <div key="metric-worst" data-grid={{ x: 36, y: 4, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Worst Trade" 
                value={`-$${Math.abs(data?.kpis?.worstTrade || 0).toFixed(2)}`}
                trend="negative"
                tooltip="The single trade with the largest loss."
            />
        </div>
        <div key="metric-growth" data-grid={{ x: 48, y: 4, w: 12, h: 2, minW: 3, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Total Growth" 
                value={`${((data?.kpis?.netProfit || 0) / (data?.kpis?.initialBalance || 1) * 100).toFixed(2)}%`}
                trend={(data?.kpis?.netProfit || 0) >= 0 ? 'positive' : 'negative'}
                tooltip="Total percentage return on initial account balance."
            />
        </div>

        {/* Larger Modules (Excluded from splitting) */}
        <div key="calendar" data-grid={{ x: 0, y: 6, w: 40, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <TradingCalendar data={data?.dailyData} availableSymbols={data?.availableSymbols} />
            </div>
        </div>

        <div key="asset-performance" data-grid={{ x: 40, y: 6, w: 20, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <AnalyticsSidebar cumulativeData={data?.cumulativeData} kpis={data?.kpis} />
            </div>
        </div>

        <div key="trade-execution" data-grid={{ x: 0, y: 26, w: 30, h: 8, minW: 5, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <TradeExecutionWidget kpis={data?.kpis} isPremium={data?.profile?.subscription_tier === 'premium'} />
        </div>

        <div key="trades-analysis" data-grid={{ x: 30, y: 26, w: 30, h: 8, minW: 5, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <TimeAnalyticsWidget hourlyData={data?.hourlyData} weekdayData={data?.weekdayData} />
        </div>

        <div key="long-short" data-grid={{ x: 40, y: 16, w: 20, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <LongShortCharts kpis={data?.kpis} />
            </div>
        </div>

        <div key="expectancy-curve" data-grid={{ x: 0, y: 34, w: 60, h: 9, minW: 5, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
                <ExpectancyCurve data={data?.expectancyData} />
            </div>
        </div>

        <div key="performance-matrix" data-grid={{ x: 0, y: 16, w: 40, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                <TimeExtremesCards kpis={data?.kpis} />
                <div className="w-full h-px bg-white/5 hidden md:block"></div>
                <MonthlyHeatmap kpis={data?.kpis} />
            </div>
        </div>

        <div key="recent-trades" data-grid={{ x: 0, y: 43, w: 60, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden flex flex-col">
               <TradeHistoryTable trades={data?.rawTrades} />
            </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
