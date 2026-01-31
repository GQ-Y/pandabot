import React from 'react';

// --- Base Skeleton ---
interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-shimmer rounded ${className}`} />
  );
};

// --- Skeleton Card (for Skill/MCP list items) ---
export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-100 dark:border-dark-border">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 bg-slate-200 dark:bg-dark-hover" />
          <Skeleton className="h-4 w-16 bg-slate-100 dark:bg-dark-border" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full bg-slate-100 dark:bg-dark-border" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-5">
        <Skeleton className="h-4 w-full bg-slate-100 dark:bg-dark-border" />
        <Skeleton className="h-4 w-3/4 bg-slate-100 dark:bg-dark-border" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-6 w-20 bg-slate-100 dark:bg-dark-border" />
        <Skeleton className="h-6 w-16 bg-slate-100 dark:bg-dark-border" />
        <Skeleton className="h-6 w-12 bg-slate-100 dark:bg-dark-border" />
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-50 dark:border-dark-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full bg-slate-100 dark:bg-dark-border" />
          <Skeleton className="h-4 w-24 bg-slate-100 dark:bg-dark-border" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12 bg-slate-100 dark:bg-dark-border" />
          <Skeleton className="h-4 w-12 bg-slate-100 dark:bg-dark-border" />
        </div>
      </div>
    </div>
  );
};

// --- Skeleton List (for category sidebar) ---
export const SkeletonCategory: React.FC = () => {
  return (
    <div className="rounded-2xl p-5 bg-slate-50 dark:bg-dark-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 bg-slate-200 dark:bg-dark-border" />
          <Skeleton className="h-5 w-24 bg-slate-200 dark:bg-dark-border" />
        </div>
        <Skeleton className="h-6 w-8 rounded-full bg-slate-200 dark:bg-dark-border" />
      </div>
      <Skeleton className="h-4 w-full bg-slate-100 dark:bg-dark-border" />
    </div>
  );
};

// --- Skeleton Detail Header ---
export const SkeletonDetailHeader: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-slate-100 dark:border-dark-border">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex gap-5">
          <Skeleton className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-dark-border" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-64 bg-slate-200 dark:bg-dark-hover" />
            <Skeleton className="h-4 w-full max-w-md bg-slate-100 dark:bg-dark-border" />
            <Skeleton className="h-4 w-3/4 max-w-sm bg-slate-100 dark:bg-dark-border" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 bg-slate-100 dark:bg-dark-border" />
              <Skeleton className="h-6 w-16 bg-slate-100 dark:bg-dark-border" />
              <Skeleton className="h-6 w-16 bg-slate-100 dark:bg-dark-border" />
            </div>
          </div>
        </div>
        <div className="flex md:flex-col gap-3">
          <Skeleton className="h-10 w-32 bg-slate-200 dark:bg-dark-hover rounded-lg" />
          <Skeleton className="h-10 w-32 bg-slate-100 dark:bg-dark-border rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// --- Skeleton Stats Card ---
export const SkeletonStatsCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-slate-100 dark:border-dark-border flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20 bg-slate-100 dark:bg-dark-border" />
        <Skeleton className="h-8 w-16 bg-slate-200 dark:bg-dark-hover" />
      </div>
      <Skeleton className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-dark-border" />
    </div>
  );
};

// --- Skeleton Home Hero ---
export const SkeletonHero: React.FC = () => {
  return (
    <div className="text-center py-20 px-4">
      <Skeleton className="h-8 w-40 mx-auto mb-6 bg-slate-100 dark:bg-dark-border" />
      <Skeleton className="h-12 w-full max-w-2xl mx-auto mb-4 bg-slate-200 dark:bg-dark-hover" />
      <Skeleton className="h-12 w-3/4 max-w-xl mx-auto mb-6 bg-slate-200 dark:bg-dark-hover" />
      <Skeleton className="h-6 w-full max-w-lg mx-auto mb-10 bg-slate-100 dark:bg-dark-border" />
      <Skeleton className="h-14 w-full max-w-xl mx-auto rounded-2xl bg-slate-100 dark:bg-dark-border" />
    </div>
  );
};

export default Skeleton;
