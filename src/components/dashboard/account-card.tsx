'use client';

import React, { useState } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AccountCardProps {
  acc: {
    name: string;
    id: string;
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
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleCardClick = () => {
    router.push(`/?account=${acc.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!window.confirm(`Are you sure you want to delete the account "${acc.name}"? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const params = new URLSearchParams();
      params.set('account', acc.id);
      
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

  const handleWithdrawalClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (acc.name === 'All Accounts') {
      alert('You can only record withdrawals on specific accounts.');
      return;
    }
    const amountStr = window.prompt(`Enter withdrawal amount for ${acc.name}:\n(e.g. 500)`);
    if (!amountStr) return;
    const amount = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }
    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_name: acc.id,
          type: 'WITHDRAWAL',
          profit: -amount,
          notes: `Manual withdrawal`,
          symbol: 'WITHDRAWAL'
        })
      });
      if (!res.ok) throw new Error('Failed to record withdrawal');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error recording withdrawal');
      setIsWithdrawing(false);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`rounded-3xl overflow-hidden bg-[#1e2128] border border-border shadow-2xl flex flex-col h-[200px] transition-transform hover:-translate-y-1 duration-300 cursor-pointer ${(isDeleting || isWithdrawing) ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Colored Area */}
      <div className={`flex-1 p-6 relative flex flex-col ${colorClass}`}>
        {/* Decorative circles */}
        <div className="absolute right-[-10%] top-[-10%] w-40 h-40 rounded-full border-[20px] border-border pointer-events-none" />
        
        {/* Header */}
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h3 className="text-foreground font-bold text-xl italic tracking-tight">{acc.name}</h3>
            <p className="text-foreground/60 text-xs mt-1 font-mono tracking-wider">#*********</p>
          </div>
          
          <button 
            onClick={handleDelete}
            className="text-foreground/50 hover:text-rose-400 p-2 -mt-2 -mr-2 transition-colors rounded-full hover:bg-white/5"
            title="Delete Account"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        {/* Balance */}
        <div className="relative z-10 mt-3">
          <div className="text-foreground text-3xl font-bold tracking-tight">
            {formatMoneyDynamic(acc.balance, isEur)}
          </div>
        </div>
        
        {/* Bottom Stats */}
        <div className="relative z-10 mt-auto flex justify-between items-end w-full">
          <div className="text-foreground/80 text-xs font-bold">{isEur ? 'EUR' : 'USD'}</div>
          <div className="flex gap-6 text-right">
            <div>
              <div className="text-foreground/60 text-[10px] uppercase font-bold mb-1 tracking-widest">Deposits</div>
              <div className="text-emerald-400 text-sm font-bold tracking-wide">
                {formatMoneyDynamic(acc.deposits, isEur)}
              </div>
            </div>
            <div 
              onClick={handleWithdrawalClick}
              className={`cursor-pointer hover:bg-white/10 p-1.5 -m-1.5 rounded-lg transition-colors ${acc.name === 'All Accounts' ? 'pointer-events-none' : ''}`}
              title="Click to record a withdrawal"
            >
              <div className="text-foreground/60 text-[10px] uppercase font-bold mb-1 tracking-widest">Withdrawals</div>
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
