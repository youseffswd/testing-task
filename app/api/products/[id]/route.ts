import { NextResponse } from 'next/server';
import { findProduct } from '@/lib/data';
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { const product = findProduct((await params).id); return product ? NextResponse.json(product) : NextResponse.json({ message: 'Not found' }, { status: 404 }); }
