'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas-pro';

export function ExportDashboardButton({ targetId = 'dashboard-grid-container' }: { targetId?: string }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) {
        alert("Could not find the dashboard element to export.");
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a', // Tailwind slate-900
        scale: 2, // High resolution
        useCORS: true,
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `metametrics-dashboard-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export dashboard:", error);
      alert("Failed to export dashboard. See console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="gap-2 bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Screenshot'}</span>
    </Button>
  );
}
