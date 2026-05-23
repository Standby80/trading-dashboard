'use client'

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider as WP, Layout } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { RotateCcw } from 'lucide-react';

// Import components
import { KPICards } from "@/components/dashboard/kpi-cards";
import { TradingCalendar } from "@/components/dashboard/trading-calendar";
import { AnalyticsSidebar } from "@/components/dashboard/analytics-sidebar";
import { TradeHistoryTable } from "@/components/dashboard/trade-history-table";
import { LongShortCharts } from "@/components/dashboard/long-short-charts";
import { DrawdownChart } from "@/components/dashboard/drawdown-chart";
import { RiskMetrics } from "@/components/dashboard/risk-metrics";
import { TradeExecutionWidget, TimeAnalyticsWidget } from "@/components/dashboard/advanced-metrics";
import { ExpectancyCurve } from "@/components/dashboard/expectancy-curve";
import { TimeAnalysisCharts } from "@/components/dashboard/time-analysis-charts";
import { MarketAnalysisModule } from "@/components/dashboard/market-analysis-module";
import { PsychologyGrid } from "@/components/dashboard/psychology-grid";
import { TimeExtremesCards } from "@/components/dashboard/time-extremes-cards";
import { MonthlyHeatmap } from "@/components/dashboard/monthly-heatmap";

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
      { i: 'kpis', x: 0, y: 0, w: 12, h: 2, minW: 4, minH: 2 },
      { i: 'psychology', x: 0, y: 2, w: 12, h: 4, minW: 6, minH: 3 },
      
      { i: 'calendar', x: 0, y: 6, w: 8, h: 10, minW: 4, minH: 5 },
      { i: 'radar', x: 8, y: 6, w: 4, h: 5, minW: 2, minH: 5 },
      { i: 'risk', x: 8, y: 11, w: 4, h: 5, minW: 2, minH: 5 },
      
      { i: 'drawdown', x: 0, y: 16, w: 8, h: 6, minW: 4, minH: 4 },
      { i: 'longshort', x: 8, y: 16, w: 4, h: 6, minW: 4, minH: 3 },
      
      { i: 'trades', x: 0, y: 22, w: 12, h: 6, minW: 2, minH: 5 },
      
      { i: 'trade-execution', x: 0, y: 28, w: 6, h: 6, minW: 3, minH: 4 },
      { i: 'time-analytics', x: 6, y: 28, w: 6, h: 6, minW: 4, minH: 4 },
      
      { i: 'expectancy', x: 0, y: 34, w: 12, h: 6, minW: 6, minH: 4 },
      
      { i: 'market-analysis', x: 0, y: 40, w: 12, h: 6, minW: 6, minH: 4 },
      
      { i: 'performance-matrix', x: 0, y: 46, w: 12, h: 10, minW: 6, minH: 6 },
    ]
  };

  const handleLayoutChange = (layout: Layout[], layouts: { [key: string]: Layout[] }) => {
    setLayoutState(layouts);
    localStorage.setItem('metametrics-layout', JSON.stringify(layouts));
  };

  const resetLayout = () => {
    localStorage.removeItem('metametrics-layout');
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
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        margin={[24, 24]}
      >
        <div key="kpis" data-grid={{ x: 0, y: 0, w: 12, h: 2, minW: 4, minH: 2 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden p-2">
               <KPICards data={data?.kpis} />
            </div>
        </div>

        <div key="calendar" data-grid={{ x: 0, y: 6, w: 8, h: 10, minW: 4, minH: 5 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <TradingCalendar data={data?.dailyData} availableSymbols={data?.availableSymbols} />
            </div>
        </div>

        <div key="drawdown" data-grid={{ x: 0, y: 16, w: 8, h: 6, minW: 4, minH: 4 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <DrawdownChart data={data?.drawdownData} />
            </div>
        </div>

        <div key="longshort" data-grid={{ x: 8, y: 16, w: 4, h: 6, minW: 4, minH: 3 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <LongShortCharts kpis={data?.kpis} />
            </div>
        </div>

        <div key="trades" data-grid={{ x: 0, y: 22, w: 12, h: 6, minW: 2, minH: 5 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden flex flex-col">
               <TradeHistoryTable trades={data?.rawTrades} />
            </div>
        </div>

        <div key="radar" data-grid={{ x: 8, y: 6, w: 4, h: 5, minW: 2, minH: 5 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <AnalyticsSidebar cumulativeData={data?.cumulativeData} kpis={data?.kpis} />
            </div>
        </div>

        <div key="risk" data-grid={{ x: 8, y: 11, w: 4, h: 5, minW: 2, minH: 5 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-y-auto">
               <RiskMetrics kpis={data?.kpis} />
            </div>
        </div>

        <div key="trade-execution" data-grid={{ x: 0, y: 28, w: 6, h: 6, minW: 3, minH: 4 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <TradeExecutionWidget kpis={data?.kpis} isPremium={data?.profile?.subscription_tier === 'premium'} />
        </div>

        <div key="time-analytics" data-grid={{ x: 6, y: 28, w: 6, h: 6, minW: 4, minH: 4 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <TimeAnalyticsWidget hourlyData={data?.hourlyData} weekdayData={data?.weekdayData} />
        </div>

        <div key="expectancy" data-grid={{ x: 0, y: 34, w: 12, h: 6, minW: 6, minH: 4 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
                <ExpectancyCurve data={data?.expectancyData} />
            </div>
        </div>

        <div key="market-analysis" data-grid={{ x: 0, y: 40, w: 12, h: 6, minW: 6, minH: 4 }} className="flex flex-col h-full relative">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
                <MarketAnalysisModule assetPerformance={data?.assetPerformance || []} sideSplit={data?.sideSplit || { longs: { count: 0, winRate: 0, netProfit: 0 }, shorts: { count: 0, winRate: 0, netProfit: 0 } }} />
            </div>
        </div>

        <div key="performance-matrix" data-grid={{ x: 0, y: 46, w: 12, h: 10, minW: 6, minH: 6 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-y-auto p-4 pt-2 flex flex-col gap-6">
                <TimeExtremesCards kpis={data?.kpis} />
                <div className="w-full h-px bg-white/5 hidden md:block"></div>
                <MonthlyHeatmap kpis={data?.kpis} />
            </div>
        </div>

        <div key="psychology" data-grid={{ x: 0, y: 2, w: 12, h: 4, minW: 6, minH: 3 }} className="flex flex-col bg-[#0b0e14] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-y-auto w-full">
                <PsychologyGrid kpis={data?.kpis} />
            </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
