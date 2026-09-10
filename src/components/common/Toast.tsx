import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text?: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onCloseToast?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onCloseToast, onDismiss }) => {
  if (toasts.length === 0) return null;

  const handleClose = (id: string) => {
    if (onCloseToast) onCloseToast(id);
    if (onDismiss) onDismiss(id);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const bgColors = {
          success: 'bg-[#166534] border-emerald-500/50 text-white',
          error: 'bg-rose-900 border-rose-500/50 text-white',
          warning: 'bg-amber-900 border-amber-500/50 text-white',
          info: 'bg-slate-900 border-slate-700 text-white',
        }[toast.type];

        const Icon = {
          success: CheckCircle2,
          error: AlertCircle,
          warning: AlertTriangle,
          info: Info,
        }[toast.type];

        const displayText = toast.text || toast.message || '';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all transform translate-y-0 ${bgColors}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed flex-1">{displayText}</p>
            <button
              onClick={() => handleClose(toast.id)}
              className="text-white/70 hover:text-white p-0.5 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const ToastContainer = Toast;
