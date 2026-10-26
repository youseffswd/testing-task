'use client';
import { createContext, useContext, useState } from 'react';
type Toast = { id: number; message: string; kind?: 'error' | 'success' };
const ToastContext = createContext<{ showToast: (message: string, kind?: Toast['kind']) => void }>({ showToast: () => {} });
export function ToastProvider({ children }: { children: React.ReactNode }) { const [toasts, setToasts] = useState<Toast[]>([]); const showToast = (message: string, kind: Toast['kind'] = 'success') => { const id = Date.now(); setToasts(old => [...old, { id, message, kind }]); setTimeout(() => setToasts(old => old.filter(toast => toast.id !== id)), 4000); }; return <ToastContext.Provider value={{ showToast }}>{children}<div className="fixed right-4 top-20 z-50 space-y-2">{toasts.map(toast => <div key={toast.id} className={`rounded-lg px-4 py-3 text-white shadow-lg ${toast.kind === 'error' ? 'bg-red-600' : 'bg-slate-800'}`}>{toast.message}</div>)}</div></ToastContext.Provider>; }
export function useToast() { return useContext(ToastContext); }
