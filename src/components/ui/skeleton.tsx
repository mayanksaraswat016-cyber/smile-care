import React from 'react';

export function PageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-2xl w-64"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
        ))}
      </div>
      <div className="h-64 bg-slate-200 rounded-2xl"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-16 bg-slate-100"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-slate-50 border-b border-slate-100"></div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
      ))}
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-slate-200 p-6 rounded-[2rem] animate-pulse h-32"></div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-slate-100 animate-pulse space-y-4">
      <div className="h-8 bg-slate-200 rounded-xl w-48"></div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
      ))}
      <div className="h-12 bg-slate-200 rounded-xl w-32"></div>
    </div>
  );
}
