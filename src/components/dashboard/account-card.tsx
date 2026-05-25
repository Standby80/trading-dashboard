'use client';

import React, { useState } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AccountCardProps {
  acc: {
    name: string;
    balance: number;
    currency: string;
    deposits: number;
    withdrawals: number;
    colorIndex: number;
  };
  isEur: boolean;
  colorClass: string;
}

const formatMoneyDynamic = (val: number, isEur: boolean) => {
  const symbol = isEur ? '€' : '$';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(val));
  return `${val < 0 ? '-' : ''}${symbol}${formatted}`;
};

export function AccountCard({ acc, isEur, colorClass }: AccountCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = () => {
    router.push(`/?account=${acc.name}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!window.confirm(`Are you sure you want to delete the account "${acc.name}"? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const params = new URLSearchParams();
      params.set('account', acc.name);
      
      const res = await fetch(`/api/trades/clear?${params.toString()}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to clear data');
      }

      window.location.reload();
    } catch (err) {
      console.error('Error clearing data:', err);
      alert('Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`rounded-3xl overflow-hidden bg-[#1e2128] border border-white/5 shadow-2xl flex flex-col h-[200px] transition-transform hover:-translate-y-1 duration-300 cursor-pointer ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Colored Area */}
      <div className={`flex-1 p-6 relative flex flex-col ${colorClass}`}>
        {/* Decorative circles */}
        <div className="absolute right-[-10%] top-[-10%] w-40 h-40 rounded-full border-[20px] border-white/5 pointer-events-none" />
        
        {/* Header */}
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h3 className="text-white font-bold text-xl italic tracking-tight">{acc.name}</h3>
            <p className="text-white/60 text-xs mt-1 font-mono tracking-wider">#*********</p>
          </div>
          
          <button 
            onClick={handleDelete}
            className="text-white/50 hover:text-rose-400 p-2 -mt-2 -mr-2 transition-colors rounded-full hover:bg-white/5"
            title="Delete Account"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        {/* Balance */}
        <div className="relative z-10 mt-3">
          <div className="text-white text-3xl font-bold tracking-tight">
            {formatMoneyDynamic(acc.balance, isEur)}
          </div>
        </div>
        
        {/* Bottom Stats */}
        <div className="relative z-10 mt-auto flex justify-between items-end w-full">
          <div className="text-white/80 text-xs font-bold">{isEur ? 'EUR' : 'USD'}</div>
          <div className="flex gap-6 text-right">
            <div>
              <div className="text-white/60 text-[10px] uppercase font-bold mb-1 tracking-widest">Deposits</div>
              <div className="text-emerald-400 text-sm font-bold tracking-wide">
                {formatMoneyDynamic(acc.deposits, isEur)}
              </div>
            </div>
            <div>
              <div className="text-white/60 text-[10px] uppercase font-bold mb-1 tracking-widest">Withdrawals</div>
              <div className="text-rose-400 text-sm font-bold tracking-wide">
                {formatMoneyDynamic(acc.withdrawals, isEur)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
