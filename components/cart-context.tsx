'use client';
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { CartItem, Product } from '@/lib/types';
type Action = { type: 'add'; product: Product; quantity?: number } | { type: 'remove'; id: string } | { type: 'increment'; id: string } | { type: 'decrement'; id: string } | { type: 'clear' } | { type: 'hydrate'; items: CartItem[] };
function reducer(state: CartItem[], action: Action): CartItem[] {
  if (action.type === 'hydrate') return action.items;
  if (action.type === 'clear') return [];
  if (action.type === 'remove') return state.filter(item => item.id !== action.id);
  if (action.type === 'add') { const found = state.find(item => item.id === action.product.id); const qty = action.quantity || 1; return found ? state.map(item => item.id === found.id ? { ...item, quantity: Math.min(item.stock, item.quantity + qty) } : item) : [...state, { ...action.product, quantity: Math.min(qty, action.product.stock) }]; }
  if (action.type === 'increment') return state.map(item => item.id === action.id ? { ...item, quantity: Math.min(item.stock + 1, item.quantity + 1) } : item);
  if (action.type === 'decrement') return state.map(item => item.id === action.id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item);
  return state;
}
const CartContext = createContext<{ items: CartItem[]; dispatch: React.Dispatch<Action> }>({ items: [], dispatch: () => {} });
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []); const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem('shopdesk-cart'); if (saved) dispatch({ type: 'hydrate', items: JSON.parse(saved) }); } catch {} finally { setHydrated(true); } }, []);
  useEffect(() => { if (hydrated) localStorage.setItem('shopdesk-cart', JSON.stringify(items)); }, [items, hydrated]);
  return <CartContext.Provider value={{ items, dispatch }}>{children}</CartContext.Provider>;
}
export function useCart() { return useContext(CartContext); }
export { reducer as cartReducer };
