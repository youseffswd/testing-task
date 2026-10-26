export type Product = { id: string; name: string; description: string; category: string; price: number; rating: number; stock: number };
export type CartItem = Product & { quantity: number };
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
export type Order = { id: string; email: string; items: CartItem[]; status: OrderStatus; total: number; createdAt: string; shipping: Record<string, string> };
