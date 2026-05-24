'use client'

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ClearDataButton({ currentAccount }: { currentAccount?: string }) {
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const handleClear = async () => {
    const accountToDelete = currentAccount || 'Default';
    if (!window.confirm(`Are you sure you want to delete the account "${accountToDelete}" and all its trade history? This cannot be undone.`)) {
      return;
    }

    setIsClearing(true);
    try {
      const params = new URLSearchParams();
      params.set('account', accountToDelete);
      
      const res = await fetch(`/api/trades/clear?${params.toString()}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to clear data');
      }

      // Force a full refresh to clear the UI
      router.push('/?account=Default');
      router.refresh();
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
      className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-start gap-3 transition-colors border border-rose-500/20 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4 shrink-0" />
      {isClearing ? 'Deleting...' : 'Delete Account'}
    </button>
  );
}
