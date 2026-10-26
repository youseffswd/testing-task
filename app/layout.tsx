import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/cart-context';
import { ToastProvider } from '@/components/toast';
import Header from '@/components/header';

export const metadata: Metadata = { title: 'ShopDesk', description: 'A small store for useful things' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ToastProvider><CartProvider><Header />{children}</CartProvider></ToastProvider></body></html>;
}
