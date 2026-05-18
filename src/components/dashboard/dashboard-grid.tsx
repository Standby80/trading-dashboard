'use client'

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider as WP, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import components
import { KPICards } from "@/components/dashboard/kpi-cards";
import { TradingCalendar } from "@/components/dashboard/trading-calendar";
import { AnalyticsSidebar } from "@/components/dashboard/analytics-sidebar";
import { TradeHistoryTable } from "@/components/dashboard/trade-history-table";
import { LongShortCharts } from "@/components/dashboard/long-short-charts";
import { DrawdownChart } from "@/components/dashboard/drawdown-chart";
import { RiskMetrics } from "@/components/dashboard/risk-metrics";

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

  // 12 column grid base layout
  const defaultLayouts = {
    lg: [
      { i: 'kpis', x: 3, y: 0, w: 6, h: 2, minW: 4, minH: 2 },
      { i: 'calendar', x: 3, y: 2, w: 6, h: 7, minW: 4, minH: 5 },
      { i: 'drawdown', x: 3, y: 9, w: 6, h: 5, minW: 4, minH: 4 },
      { i: 'longshort', x: 3, y: 14, w: 6, h: 4, minW: 4, minH: 3 },
      
      { i: 'trades', x: 0, y: 0, w: 3, h: 18, minW: 2, minH: 5 },
      
      { i: 'radar', x: 9, y: 0, w: 3, h: 7, minW: 2, minH: 5 },
      { i: 'risk', x: 9, y: 7, w: 3, h: 11, minW: 2, minH: 5 },
    ]
  };

  const handleLayoutChange = (layout: Layout[], layouts: { [key: string]: Layout[] }) => {
    setLayoutState(layouts);
    localStorage.setItem('metametrics-layout', JSON.stringify(layouts));
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
    <div className="w-full -mt-2">
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
        <div key="kpis" className="flex flex-col bg-[#131823] border border-white/5 rounded-xl shadow-none h-full relative">
            <DragHandle />
            <div className="flex-1 overflow-hidden p-2">
               <KPICards data={data?.kpis} />
            </div>
        </div>

        <div key="calendar" className="flex flex-col bg-[#131823] border border-white/5 rounded-xl shadow-none h-full relative">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <TradingCalendar data={data?.dailyData} />
            </div>
        </div>

        <div key="drawdown" className="flex flex-col bg-[#131823] border border-white/5 rounded-xl shadow-none h-full relative">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <DrawdownChart data={data?.drawdownData} />
            </div>
        </div>

        <div key="longshort" className="flex flex-col bg-[#131823] border border-white/5 rounded-xl shadow-none h-full relative">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <LongShortCharts kpis={data?.kpis} />
            </div>
        </div>

        <div key="trades" className="flex flex-col bg-[#131823] border border-white/5 rounded-xl shadow-none h-full relative">
            <DragHandle />
            <div className="flex-1 overflow-hidden flex flex-col">
               <TradeHistoryTable trades={data?.rawTrades} />
            </div>
        </div>

        <div key="radar" className="flex flex-col bg-[#131823] border border-white/5 rounded-xl shadow-none h-full relative">
            <DragHandle />
            <div className="flex-1 overflow-hidden">
               <AnalyticsSidebar cumulativeData={data?.cumulativeData} kpis={data?.kpis} />
            </div>
        </div>

        <div key="risk" className="flex flex-col bg-[#131823] border border-white/5 rounded-xl shadow-none h-full relative">
            <DragHandle />
            <div className="flex-1 overflow-y-auto">
               <RiskMetrics kpis={data?.kpis} />
            </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
