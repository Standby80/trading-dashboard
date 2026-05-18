'use client'

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ClearDataButton() {
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to delete all your trade history? This cannot be undone.")) {
      return;
    }

    setIsClearing(true);
    try {
      const res = await fetch('/api/trades/clear', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to clear data');
      }

      // Force a full refresh to clear the UI
      router.refresh();
      // Optional: window.location.reload() if server action refresh isn't aggressive enough
      // window.location.reload();
    } catch (err) {
      console.error('Error clearing data:', err);
      alert('Failed to clear data');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <button 
      onClick={handleClear}
      disabled={isClearing}
      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors border border-rose-500/20 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {isClearing ? 'Clearing...' : 'Clear Data'}
    </button>
  );
}
