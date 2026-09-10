import React from 'react';
import { StudentStatus, OrderStatus, SkillLevel } from '../../types';

interface StatusBadgeProps {
  status: StudentStatus | OrderStatus | SkillLevel | string;
  size?: 'sm' | 'md' | 'lg';
  lateDays?: number;
  isLate?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', lateDays, isLate }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  }[size];

  // Student statuses
  if (status === 'Active') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Active
      </span>
    );
  }

  if (status === 'Graduated' || status === 'Completed') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        {status === 'Completed' ? 'Completed' : 'Graduated'}
      </span>
    );
  }

  if (status === 'On Leave') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        On Leave
      </span>
    );
  }

  if (status === 'Dropped') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        Dropped
      </span>
    );
  }

  // Order statuses
  if (status === 'Received') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
        Received
      </span>
    );
  }

  if (status === 'In Progress') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        In Progress
      </span>
    );
  }

  if (status === 'Ready for Pickup' || status === 'Ready') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
        Ready
      </span>
    );
  }

  if (status === 'Delivered') {
    if (isLate || (lateDays && lateDays > 0)) {
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          ⚠ Delivered Late{lateDays && lateDays > 0 ? ` (${lateDays}d)` : ''}
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
        ✓ Delivered On Time
      </span>
    );
  }

  if (status === 'Late') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
        Late {lateDays && lateDays > 0 ? `(${lateDays}d)` : ''}
      </span>
    );
  }

  // Skill levels
  if (status === 'Mastered') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold ${sizeClasses}`}>
        <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Mastered
      </span>
    );
  }

  if (status === 'In Progress') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        In Progress
      </span>
    );
  }

  if (status === 'Not Started') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-500 text-xs ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
        Not Started
      </span>
    );
  }

  if (status === 'New' || status === 'Pending') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
        New
      </span>
    );
  }

  if (status === 'Reviewed') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Reviewed
      </span>
    );
  }

  if (status === 'Accepted' || status === 'Approved') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Accepted
      </span>
    );
  }

  if (status === 'Rejected') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        Rejected
      </span>
    );
  }

  if (status === 'Contacted') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Contacted
      </span>
    );
  }

  if (status === 'Closed') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        Closed
      </span>
    );
  }

  // Generic fallback
  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 ${sizeClasses}`}>
      {status}
    </span>
  );
};
