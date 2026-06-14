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
import { EquityCurveChart } from "@/components/dashboard/equity-curve-chart";
import { TradeExecutionWidget, TimeAnalyticsWidget } from "@/components/dashboard/advanced-metrics";
import { ExpectancyCurve } from "@/components/dashboard/expectancy-curve";
import { TimeExtremesCards } from "@/components/dashboard/time-extremes-cards";
import { MonthlyHeatmap } from "@/components/dashboard/monthly-heatmap";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SymbolPerformanceWidget } from "@/components/dashboard/symbol-performance-widget";

const ResponsiveGridLayout = WP(Responsive);

export function DashboardGrid({ data }: { data: any }) {
  const [mounted, setMounted] = useState(false);
  const [layoutState, setLayoutState] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const savedLayouts = localStorage.getItem('metametrics-layout-v8');
    if (savedLayouts) {
      try {
        setLayoutState(JSON.parse(savedLayouts));
      } catch (e) {}
    }
  }, []);

  const defaultLayouts = {
    lg: [
      { i: 'metric-equity', x: 0, y: 0, w: 15, h: 2, minW: 1, minH: 1 },
      { i: 'metric-trades', x: 15, y: 0, w: 15, h: 2, minW: 1, minH: 1 },
      { i: 'metric-netpnl', x: 30, y: 0, w: 15, h: 2, minW: 1, minH: 1 },
      { i: 'metric-growth', x: 45, y: 0, w: 15, h: 2, minW: 1, minH: 1 },
      
      { i: 'calendar', x: 0, y: 2, w: 40, h: 10, minW: 5, minH: 5 },
      { i: 'metric-topasset', x: 40, y: 2, w: 20, h: 2, minW: 1, minH: 1 },
      { i: 'asset-performance', x: 40, y: 4, w: 20, h: 8, minW: 5, minH: 5 },
      
      { i: 'equity-curve', x: 0, y: 12, w: 36, h: 10, minW: 5, minH: 5 },
      { i: 'metric-winrate', x: 36, y: 12, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-pf', x: 48, y: 12, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-avgwin', x: 36, y: 14, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-avgloss', x: 48, y: 14, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-winning', x: 36, y: 16, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-losing', x: 48, y: 16, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-expectancy', x: 36, y: 18, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-maxdd', x: 48, y: 18, w: 12, h: 2, minW: 1, minH: 1 },
      
      { i: 'long-short', x: 0, y: 22, w: 24, h: 8, minW: 5, minH: 5 },
      { i: 'metric-best', x: 24, y: 22, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-worst', x: 36, y: 22, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-rr', x: 48, y: 22, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-profitperhour', x: 24, y: 24, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-commission', x: 36, y: 24, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-holddiff', x: 48, y: 24, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-winstreak', x: 24, y: 26, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-losestreak', x: 36, y: 26, w: 12, h: 2, minW: 1, minH: 1 },
      { i: 'metric-sharpe', x: 48, y: 26, w: 12, h: 2, minW: 1, minH: 1 },
      
      { i: 'metric-frequency', x: 0, y: 30, w: 15, h: 2, minW: 1, minH: 1 },
      { i: 'metric-recovery', x: 15, y: 30, w: 15, h: 2, minW: 1, minH: 1 },
      { i: 'metric-ddduration', x: 30, y: 30, w: 15, h: 2, minW: 1, minH: 1 },
      { i: 'metric-wlratio', x: 45, y: 30, w: 15, h: 2, minW: 1, minH: 1 },
      
      { i: 'performance-matrix', x: 0, y: 32, w: 36, h: 10, minW: 5, minH: 5 },
      { i: 'symbol-performance', x: 36, y: 32, w: 24, h: 10, minW: 5, minH: 5 },
      
      { i: 'trade-execution', x: 0, y: 42, w: 30, h: 8, minW: 5, minH: 5 },
      { i: 'trades-analysis', x: 30, y: 42, w: 30, h: 8, minW: 5, minH: 5 },
      
      { i: 'expectancy-curve', x: 0, y: 50, w: 30, h: 10, minW: 5, minH: 5 },
      { i: 'drawdown-chart', x: 30, y: 50, w: 30, h: 10, minW: 5, minH: 5 },
      
      { i: 'recent-trades', x: 0, y: 60, w: 60, h: 10, minW: 5, minH: 5 }
    ],
    md: [
      { i: 'metric-equity', x: 0, y: 0, w: 10, h: 2, minW: 1, minH: 1 },
      { i: 'metric-trades', x: 10, y: 0, w: 10, h: 2, minW: 1, minH: 1 },
      { i: 'metric-netpnl', x: 20, y: 0, w: 10, h: 2, minW: 1, minH: 1 },
      { i: 'metric-growth', x: 30, y: 0, w: 10, h: 2, minW: 1, minH: 1 },
      
      { i: 'calendar', x: 0, y: 2, w: 24, h: 10, minW: 5, minH: 5 },
      { i: 'metric-topasset', x: 24, y: 2, w: 16, h: 2, minW: 1, minH: 1 },
      { i: 'asset-performance', x: 24, y: 4, w: 16, h: 8, minW: 5, minH: 5 },
      
      { i: 'equity-curve', x: 0, y: 12, w: 24, h: 10, minW: 5, minH: 5 },
      { i: 'metric-winrate', x: 24, y: 12, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-pf', x: 32, y: 12, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-avgwin', x: 24, y: 14, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-avgloss', x: 32, y: 14, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-winning', x: 24, y: 16, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-losing', x: 32, y: 16, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-expectancy', x: 24, y: 18, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-maxdd', x: 32, y: 18, w: 8, h: 2, minW: 1, minH: 1 },
      
      { i: 'long-short', x: 0, y: 22, w: 16, h: 8, minW: 5, minH: 5 },
      { i: 'metric-best', x: 16, y: 22, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-worst', x: 24, y: 22, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-rr', x: 32, y: 22, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-profitperhour', x: 16, y: 24, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-commission', x: 24, y: 24, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-holddiff', x: 32, y: 24, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-winstreak', x: 16, y: 26, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-losestreak', x: 24, y: 26, w: 8, h: 2, minW: 1, minH: 1 },
      { i: 'metric-sharpe', x: 32, y: 26, w: 8, h: 2, minW: 1, minH: 1 },
      
      { i: 'metric-frequency', x: 0, y: 30, w: 10, h: 2, minW: 1, minH: 1 },
      { i: 'metric-recovery', x: 10, y: 30, w: 10, h: 2, minW: 1, minH: 1 },
      { i: 'metric-ddduration', x: 20, y: 30, w: 10, h: 2, minW: 1, minH: 1 },
      { i: 'metric-wlratio', x: 30, y: 30, w: 10, h: 2, minW: 1, minH: 1 },
      
      { i: 'performance-matrix', x: 0, y: 32, w: 24, h: 10, minW: 5, minH: 5 },
      { i: 'symbol-performance', x: 24, y: 32, w: 16, h: 10, minW: 5, minH: 5 },
      
      { i: 'trade-execution', x: 0, y: 42, w: 20, h: 8, minW: 5, minH: 5 },
      { i: 'trades-analysis', x: 20, y: 42, w: 20, h: 8, minW: 5, minH: 5 },
      
      { i: 'expectancy-curve', x: 0, y: 50, w: 20, h: 10, minW: 5, minH: 5 },
      { i: 'drawdown-chart', x: 20, y: 50, w: 20, h: 10, minW: 5, minH: 5 },
      
      { i: 'recent-trades', x: 0, y: 60, w: 40, h: 10, minW: 5, minH: 5 }
    ],
    sm: [
      { i: 'metric-equity', x: 0, y: 0, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-trades', x: 5, y: 0, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-netpnl', x: 10, y: 0, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-growth', x: 15, y: 0, w: 5, h: 2, minW: 1, minH: 1 },
      
      { i: 'calendar', x: 0, y: 2, w: 20, h: 10, minW: 5, minH: 5 },
      { i: 'metric-topasset', x: 0, y: 12, w: 10, h: 2, minW: 1, minH: 1 },
      { i: 'asset-performance', x: 10, y: 12, w: 10, h: 10, minW: 5, minH: 5 },
      
      { i: 'equity-curve', x: 0, y: 22, w: 20, h: 10, minW: 5, minH: 5 },
      
      { i: 'metric-winrate', x: 0, y: 32, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-pf', x: 5, y: 32, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-avgwin', x: 10, y: 32, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-avgloss', x: 15, y: 32, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-winning', x: 0, y: 34, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-losing', x: 5, y: 34, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-expectancy', x: 10, y: 34, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-maxdd', x: 15, y: 34, w: 5, h: 2, minW: 1, minH: 1 },
      
      { i: 'long-short', x: 0, y: 36, w: 20, h: 8, minW: 5, minH: 5 },
      
      { i: 'metric-best', x: 0, y: 44, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-worst', x: 5, y: 44, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-rr', x: 10, y: 44, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-profitperhour', x: 15, y: 44, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-commission', x: 0, y: 46, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-holddiff', x: 5, y: 46, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-winstreak', x: 10, y: 46, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-losestreak', x: 15, y: 46, w: 5, h: 2, minW: 1, minH: 1 },
      
      { i: 'metric-sharpe', x: 0, y: 48, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-frequency', x: 5, y: 48, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-recovery', x: 10, y: 48, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-ddduration', x: 15, y: 48, w: 5, h: 2, minW: 1, minH: 1 },
      { i: 'metric-wlratio', x: 0, y: 50, w: 5, h: 2, minW: 1, minH: 1 },
      
      { i: 'performance-matrix', x: 0, y: 52, w: 20, h: 10, minW: 5, minH: 5 },
      { i: 'symbol-performance', x: 0, y: 62, w: 20, h: 10, minW: 5, minH: 5 },
      
      { i: 'trade-execution', x: 0, y: 72, w: 20, h: 8, minW: 5, minH: 5 },
      { i: 'trades-analysis', x: 0, y: 80, w: 20, h: 8, minW: 5, minH: 5 },
      
      { i: 'expectancy-curve', x: 0, y: 88, w: 20, h: 10, minW: 5, minH: 5 },
      { i: 'drawdown-chart', x: 0, y: 98, w: 20, h: 10, minW: 5, minH: 5 },
      
      { i: 'recent-trades', x: 0, y: 108, w: 20, h: 10, minW: 5, minH: 5 }
    ]
  };

  const handleLayoutChange = (layout: any, layouts: any) => {
    setLayoutState(layouts);
    localStorage.setItem('metametrics-layout-v8', JSON.stringify(layouts));
  };

  const resetLayout = () => {
    localStorage.removeItem('metametrics-layout-v8');
    setLayoutState(null); // Force it to use defaultLayouts on next render
  };

  if (!mounted) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading dynamic layout...</div>;
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
        cols={{ lg: 60, md: 40, sm: 20, xs: 2, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        margin={[24, 24]}
      >
        {/* Metric Cards Row 1 */}
        <div key="metric-netpnl" data-grid={{ x: 30, y: 0, w: 15, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Net P&L" 
                value={`$${Math.abs(data?.kpis?.netProfit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                trend={(data?.kpis?.netProfit || 0) >= 0 ? 'positive' : 'negative'}
                tooltip="Total realized profit or loss across all trades."
            />
        </div>
        <div key="metric-pf" data-grid={{ x: 48, y: 12, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Profit Factor" 
                value={(data?.kpis?.profitFactor || 0).toFixed(2)}
                trend={(data?.kpis?.profitFactor || 0) >= 1 ? 'positive' : 'negative'}
                tooltip="Gross profit divided by gross loss. A value above 1 indicates profitability."
            />
        </div>
        <div key="metric-winrate" data-grid={{ x: 36, y: 12, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Win Rate" 
                value={`${(data?.kpis?.totalTrades > 0 ? (data?.kpis?.winningTrades / data?.kpis?.totalTrades * 100) : 0).toFixed(2)}%`}
                trend="positive"
                tooltip="Percentage of winning trades out of total trades."
            />
        </div>
        <div key="metric-commission" data-grid={{ x: 36, y: 24, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Total Commission" 
                value={`-$${Math.abs(data?.kpis?.totalCommissions || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                trend="negative"
                tooltip="Total commissions paid to the broker."
            />
        </div>
        <div key="metric-trades" data-grid={{ x: 15, y: 0, w: 15, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Total Trades" 
                value={data?.kpis?.totalTrades || 0}
                trend="neutral"
                tooltip="Total number of completed trades."
            />
        </div>

        {/* Metric Cards Row 2 */}
        <div key="metric-equity" data-grid={{ x: 0, y: 0, w: 15, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Account Value" 
                value={`$${Math.abs(data?.kpis?.currentBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                trend="neutral"
                tooltip="Current total balance of your account."
            />
        </div>
        <div key="metric-maxdd" data-grid={{ x: 48, y: 18, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Max Drawdown" 
                value={`${((data?.kpis?.maxDrawdownDol || 0) / (data?.kpis?.peakBalance || 1) * 100).toFixed(2)}%`}
                trend="negative"
                tooltip="Largest percentage drop from a peak to a trough in equity."
            />
        </div>
        <div key="metric-avgwin" data-grid={{ x: 36, y: 14, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Average Win" 
                value={`$${(data?.kpis?.avgWin || 0).toFixed(2)}`}
                trend="positive"
                tooltip="Average profit amount per winning trade."
            />
        </div>
        <div key="metric-avgloss" data-grid={{ x: 48, y: 14, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Average Loss" 
                value={`-$${(data?.kpis?.avgLoss || 0).toFixed(2)}`}
                trend="negative"
                tooltip="Average loss amount per losing trade."
            />
        </div>
        <div key="metric-sharpe" data-grid={{ x: 48, y: 26, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Sharpe Ratio" 
                value={(data?.kpis?.sharpeRatio || 0).toFixed(2)}
                trend="positive"
                tooltip="Measures risk-adjusted return. Higher is better."
            />
        </div>

        {/* Metric Cards Row 3 */}
        <div key="metric-winning" data-grid={{ x: 36, y: 16, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Winning Trades" 
                value={data?.kpis?.winningTrades || 0}
                trend="positive"
                tooltip="Total number of trades that resulted in a profit."
            />
        </div>
        <div key="metric-losing" data-grid={{ x: 48, y: 16, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Losing Trades" 
                value={data?.kpis?.losingTrades || 0}
                trend="negative"
                tooltip="Total number of trades that resulted in a loss."
            />
        </div>
        <div key="metric-best" data-grid={{ x: 24, y: 22, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Best Trade" 
                value={`$${(data?.kpis?.bestTrade || 0).toFixed(2)}`}
                trend="positive"
                tooltip="The single trade with the highest profit."
            />
        </div>
        <div key="metric-worst" data-grid={{ x: 36, y: 22, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Worst Trade" 
                value={`-$${Math.abs(data?.kpis?.worstTrade || 0).toFixed(2)}`}
                trend="negative"
                tooltip="The single trade with the largest loss."
            />
        </div>
        <div key="metric-growth" data-grid={{ x: 45, y: 0, w: 15, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Total Growth" 
                value={`${((data?.kpis?.netProfit || 0) / (data?.kpis?.initialBalance || 1) * 100).toFixed(2)}%`}
                trend={(data?.kpis?.netProfit || 0) >= 0 ? 'positive' : 'negative'}
                tooltip="Total percentage return on initial account balance."
            />
        </div>

        {/* Metric Cards Row 4 */}
        <div key="metric-expectancy" data-grid={{ x: 36, y: 18, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Expectancy" 
                value={`$${(data?.kpis?.expectancy || 0).toFixed(2)}`}
                trend={(data?.kpis?.expectancy || 0) >= 0 ? 'positive' : 'negative'}
                tooltip="Statistical average profit or loss per trade over time."
            />
        </div>
        <div key="metric-recovery" data-grid={{ x: 15, y: 30, w: 15, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Recovery Factor" 
                value={(data?.kpis?.recoveryFactor || 0).toFixed(2)}
                trend={(data?.kpis?.recoveryFactor || 0) > 2 ? 'positive' : 'neutral'}
                tooltip="Absolute Net Profit divided by Max Drawdown."
            />
        </div>
        <div key="metric-rr" data-grid={{ x: 48, y: 22, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Avg. Risk:Reward" 
                value={`1:${(data?.kpis?.avgRR || 0).toFixed(2)}`}
                trend={(data?.kpis?.avgRR || 0) >= 1 ? 'positive' : 'negative'}
                tooltip="Ratio of Average Win to Average Loss."
            />
        </div>
        <div key="metric-winstreak" data-grid={{ x: 24, y: 26, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Longest Win Streak" 
                value={data?.streakMetrics?.maxWinStreakCount || 0}
                trend="positive"
                tooltip="Maximum consecutive winning trades."
            />
        </div>
        <div key="metric-losestreak" data-grid={{ x: 36, y: 26, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Longest Losing Streak" 
                value={data?.streakMetrics?.maxLossStreakCount || 0}
                trend="negative"
                tooltip="Maximum consecutive losing trades."
            />
        </div>
        <div key="metric-profitperhour" data-grid={{ x: 24, y: 24, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Profit per Hour" 
                value={`$${(data?.kpis?.profitPerHour || 0).toFixed(2)}`}
                trend={(data?.kpis?.profitPerHour || 0) >= 0 ? 'positive' : 'negative'}
                tooltip="Profit earned per hour actively held in the market."
            />
        </div>

        {/* Metric Cards Row 5 */}
        <div key="metric-frequency" data-grid={{ x: 0, y: 30, w: 15, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Trade Frequency" 
                value={`${(data?.kpis?.tradeFrequency || 0).toFixed(1)} / day`}
                trend="neutral"
                tooltip="Average number of trades taken per active trading day."
            />
        </div>
        <div key="metric-ddduration" data-grid={{ x: 30, y: 30, w: 15, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Drawdown Duration" 
                value={`${data?.kpis?.maxDrawdownDays || 0} days`}
                trend="negative"
                tooltip="Longest period the account remained below an All-Time High."
            />
        </div>
        <div key="metric-holddiff" data-grid={{ x: 48, y: 24, w: 12, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Hold Time Diff" 
                value={`${(data?.kpis?.holdTimeDiff || 0).toFixed(1)} mins`}
                trend={(data?.kpis?.holdTimeDiff || 0) >= 0 ? 'positive' : 'negative'}
                tooltip="Difference in holding time between winning and losing trades."
            />
        </div>
        <div key="metric-topasset" data-grid={{ x: 40, y: 2, w: 20, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="Top Asset" 
                value={data?.kpis?.topAssetSymbol || '-'}
                trend="positive"
                tooltip={`Most profitable symbol with $${(data?.kpis?.topAssetProfit || 0).toFixed(2)} in profit.`}
            />
        </div>
        <div key="metric-wlratio" data-grid={{ x: 45, y: 30, w: 15, h: 2, minW: 1, minH: 1 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <MetricCard 
                title="W/L Ratio" 
                value={(data?.kpis?.winLossRatio || 0).toFixed(2)}
                trend={(data?.kpis?.winLossRatio || 0) >= 1 ? 'positive' : 'negative'}
                tooltip="Ratio of winning trades to losing trades."
            />
        </div>

        {/* Larger Modules (Excluded from splitting) */}
        <div key="symbol-performance" data-grid={{ x: 36, y: 32, w: 24, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden h-full">
               <SymbolPerformanceWidget data={data?.assetPerformance} />
            </div>
        </div>

        <div key="calendar" data-grid={{ x: 0, y: 2, w: 40, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <TradingCalendar data={data?.dailyData} availableSymbols={data?.availableSymbols} rawTrades={data?.rawTrades} />
            </div>
        </div>

        <div key="asset-performance" data-grid={{ x: 40, y: 4, w: 20, h: 8, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <AnalyticsSidebar cumulativeData={data?.cumulativeData} kpis={data?.kpis} />
            </div>
        </div>

        <div key="trade-execution" data-grid={{ x: 0, y: 42, w: 30, h: 8, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <TradeExecutionWidget kpis={data?.kpis} isPremium={data?.profile?.subscription_tier === 'premium' || (data?.profile?.trial_ends_at && new Date(data.profile.trial_ends_at).getTime() > new Date().getTime())} />
        </div>

        <div key="trades-analysis" data-grid={{ x: 30, y: 42, w: 30, h: 8, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <TimeAnalyticsWidget hourlyData={data?.hourlyData} weekdayData={data?.weekdayData} />
        </div>

        <div key="long-short" data-grid={{ x: 0, y: 22, w: 24, h: 8, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <LongShortCharts kpis={data?.kpis} />
            </div>
        </div>

        <div key="expectancy-curve" data-grid={{ x: 0, y: 50, w: 30, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
                <ExpectancyCurve data={data?.expectancyData} />
            </div>
        </div>

        <div key="performance-matrix" data-grid={{ x: 0, y: 32, w: 36, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                <TimeExtremesCards kpis={data?.kpis} />
                <div className="w-full h-px bg-white/5 hidden md:block"></div>
                <MonthlyHeatmap kpis={data?.kpis} />
            </div>
        </div>

        <div key="equity-curve" data-grid={{ x: 0, y: 12, w: 36, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
                <EquityCurveChart data={data?.drawdownData} />
            </div>
        </div>

        <div key="drawdown-chart" data-grid={{ x: 30, y: 50, w: 30, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
                <DrawdownChart data={data?.drawdownData} />
            </div>
        </div>

        <div key="recent-trades" data-grid={{ x: 0, y: 60, w: 60, h: 10, minW: 5, minH: 5 }} className="flex flex-col bg-card border border-border rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden flex flex-col">
               <TradeHistoryTable trades={data?.rawTrades} />
            </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
