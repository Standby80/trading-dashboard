const fs = require('fs');
const file = 'src/components/dashboard/dashboard-grid.tsx';
let content = fs.readFileSync(file, 'utf8');

const newLayoutsStr = `  const defaultLayouts = {
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
  };`;

content = content.replace(/  const defaultLayouts = {[\s\S]*?  };\n/, newLayoutsStr + '\n');
content = content.replace(/metametrics-layout-v[0-9]+/g, 'metametrics-layout-v8');

// Update JSX properties to match lg
const lgArray = [
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
];

lgArray.forEach(item => {
  const regex = new RegExp(`key="${item.i}" data-grid={{[^}]*}}`);
  content = content.replace(regex, `key="${item.i}" data-grid={{ x: ${item.x}, y: ${item.y}, w: ${item.w}, h: ${item.h}, minW: ${item.minW}, minH: ${item.minH} }}`);
});

fs.writeFileSync(file, content);
console.log('Script completed');
