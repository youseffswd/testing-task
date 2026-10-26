import { NextResponse } from 'next/server';
import { findProduct, orders } from '@/lib/data';
import { luhnCheck, validExpiry } from '@/lib/checkout';
export async function GET() { return NextResponse.json({ orders: orders.filter(order => order.email === 'demo@shopdesk.dev') }); }
export async function POST(request: Request) {
  const body = await request.json(); const errors: Record<string, string> = {};
  ['name','email','phone','address','city','postalCode'].forEach(key => { if (!body.shipping?.[key]) errors[key] = 'This field is required'; });
  if (!body.shipping?.email?.includes('@')) errors.email = 'Enter a valid email';
  if (!/^[0-9+() -]{7,}$/.test(body.shipping?.phone || '')) errors.phone = 'Enter a valid phone';
  if (!luhnCheck(body.payment?.cardNumber || '')) errors.cardNumber = 'Enter a valid card number';
  if (!validExpiry(body.payment?.expiry || '')) errors.expiry = 'Enter a valid expiry date';
  if (!/^\d{3,4}$/.test(body.payment?.cvc || '')) errors.cvc = 'Enter a valid CVC';
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });
  for (const item of body.items || []) { const product = findProduct(item.id); if (!product || product.stock < item.quantity) return NextResponse.json({ message: `${item.name || 'An item'} is no longer available` }, { status: 409 }); }
  (body.items || []).forEach((item: any) => { const product = findProduct(item.id); if (product) product.stock -= item.quantity; });
  const order = { id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, email: body.shipping.email, items: body.items, status: 'paid' as const, total: body.total, createdAt: new Date().toISOString(), shipping: body.shipping };
  orders.unshift(order); return NextResponse.json({ order }, { status: 201 });
}
