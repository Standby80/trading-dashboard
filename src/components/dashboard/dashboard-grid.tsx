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
import { RiskOverview } from "@/components/dashboard/risk-overview";
import { TradeExecutionWidget, TimeAnalyticsWidget, SecondaryStats, TradeDistribution, DrawdownAnalysis } from "@/components/dashboard/advanced-metrics";
import { ExpectancyCurve } from "@/components/dashboard/expectancy-curve";

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
      // Row 1: KPI Cards (5 columns)
      { i: 'kpis', x: 0, y: 0, w: 60, h: 2, minW: 10, minH: 2 }, // KPICards component will handle the 5-col split internally
      
      // Row 2: Secondary Stats (4 columns) - we'll handle this inside a new component or split here
      { i: 'secondary-stats', x: 0, y: 2, w: 60, h: 4, minW: 10, minH: 3 }, // Handled internally
      
      // Row 3: Calendar (left) & Risk Overview (right)
      { i: 'calendar', x: 0, y: 6, w: 35, h: 10, minW: 20, minH: 5 },
      { i: 'risk-overview', x: 35, y: 6, w: 25, h: 10, minW: 15, minH: 5 },
      
      // Row 4: Trade Execution, Trades Analysis, Trade Distribution
      { i: 'trade-execution', x: 0, y: 16, w: 20, h: 8, minW: 10, minH: 6 },
      { i: 'trades-analysis', x: 20, y: 16, w: 20, h: 8, minW: 10, minH: 6 },
      { i: 'trade-distribution', x: 40, y: 16, w: 20, h: 8, minW: 10, minH: 6 },
      
      // Row 5: Asset Performance, Drawdown Analysis, Long vs Short
      { i: 'asset-performance', x: 0, y: 24, w: 20, h: 7, minW: 10, minH: 6 },
      { i: 'drawdown-analysis', x: 20, y: 24, w: 20, h: 7, minW: 10, minH: 6 },
      { i: 'long-short', x: 40, y: 24, w: 20, h: 7, minW: 10, minH: 6 },
      
      // Row 6: Equity Curve, Expectancy Curve
      { i: 'equity-curve', x: 0, y: 31, w: 30, h: 9, minW: 15, minH: 6 },
      { i: 'expectancy-curve', x: 30, y: 31, w: 30, h: 9, minW: 15, minH: 6 },
      
      // Row 7: Recent Trades
      { i: 'recent-trades', x: 0, y: 40, w: 60, h: 10, minW: 20, minH: 5 },
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
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        margin={[24, 24]}
      >
        <div key="kpis" data-grid={{ x: 0, y: 0, w: 60, h: 2, minW: 10, minH: 2 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <div className="flex-1 overflow-visible">
               <KPICards data={data?.kpis} />
            </div>
        </div>

        <div key="secondary-stats" data-grid={{ x: 0, y: 2, w: 60, h: 4, minW: 10, minH: 3 }} className="flex flex-col h-full relative transition-all duration-300">
            <DragHandle />
            <div className="flex-1 overflow-visible">
               <SecondaryStats data={data} />
            </div>
        </div>

        <div key="calendar" data-grid={{ x: 0, y: 6, w: 35, h: 10, minW: 20, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <TradingCalendar data={data?.dailyData} availableSymbols={data?.availableSymbols} />
            </div>
        </div>

        <div key="risk-overview" data-grid={{ x: 35, y: 6, w: 25, h: 10, minW: 15, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <RiskOverview kpis={data?.kpis} />
            </div>
        </div>

        <div key="trade-execution" data-grid={{ x: 0, y: 16, w: 20, h: 8, minW: 10, minH: 6 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <TradeExecutionWidget kpis={data?.kpis} isPremium={data?.profile?.subscription_tier === 'premium'} />
        </div>

        <div key="trades-analysis" data-grid={{ x: 20, y: 16, w: 20, h: 8, minW: 10, minH: 6 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <TimeAnalyticsWidget hourlyData={data?.hourlyData} weekdayData={data?.weekdayData} />
        </div>

        <div key="trade-distribution" data-grid={{ x: 40, y: 16, w: 20, h: 8, minW: 10, minH: 6 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <TradeDistribution data={data} />
        </div>

        <div key="asset-performance" data-grid={{ x: 0, y: 24, w: 20, h: 7, minW: 10, minH: 6 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <AnalyticsSidebar cumulativeData={data?.cumulativeData} kpis={data?.kpis} />
            </div>
        </div>

        <div key="drawdown-analysis" data-grid={{ x: 20, y: 24, w: 20, h: 7, minW: 10, minH: 6 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <DrawdownAnalysis kpis={data?.kpis} />
            </div>
        </div>

        <div key="long-short" data-grid={{ x: 40, y: 24, w: 20, h: 7, minW: 10, minH: 6 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <LongShortCharts kpis={data?.kpis} />
            </div>
        </div>

        <div key="equity-curve" data-grid={{ x: 0, y: 31, w: 30, h: 9, minW: 15, minH: 6 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <DrawdownChart data={data?.drawdownData} />
            </div>
        </div>

        <div key="expectancy-curve" data-grid={{ x: 30, y: 31, w: 30, h: 9, minW: 15, minH: 6 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
                <ExpectancyCurve data={data?.expectancyData} />
            </div>
        </div>

        <div key="recent-trades" data-grid={{ x: 0, y: 40, w: 60, h: 10, minW: 20, minH: 5 }} className="flex flex-col bg-[#131823] border border-[#1e2330] rounded-xl shadow-2xl shadow-black/50 h-full relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-black/70">
            <DragHandle />
            <div className="flex-1 overflow-hidden flex flex-col">
               <TradeHistoryTable trades={data?.rawTrades} />
            </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
