import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClass = "animate-pulse bg-gray-200";
  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-lg';
  
  return (
    <div className={`${baseClass} ${variantClass} ${className}`}></div>
  );
};

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-12 w-12" variant="circle" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="p-6 space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className={`h-4 ${j === 0 ? 'w-12' : 'flex-1'}`} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 h-[400px] flex flex-col">
    <div className="flex justify-between mb-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
    <Skeleton className="flex-1 w-full" />
  </div>
);

export default Skeleton;
