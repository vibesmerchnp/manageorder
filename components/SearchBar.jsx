'use client';
import { Search, Filter, X } from 'lucide-react';
import { C } from '@/lib/theme';

export function SearchBar({ search, onSearch, statusFilter, onStatusFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[200px]"
        style={{ background: C.white, border: `1px solid ${C.line}` }}
      >
        <Search size={14} style={{ color: C.ink3 }} />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name, phone, branch, SN…"
          className="flex-1 outline-none bg-transparent text-sm"
          style={{ color: C.ink }}
        />
      </div>
      {statusFilter !== 'All' && (
        <button
          onClick={() => onStatusFilter('All')}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded"
          style={{ color: C.accent, background: C.accent + '15' }}
        >
          <Filter size={11} /> {statusFilter} <X size={11} />
        </button>
      )}
    </div>
  );
}
