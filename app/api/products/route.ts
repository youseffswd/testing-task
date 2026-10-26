import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const search = (searchParams.get("search") || "").toLowerCase();
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 8);
    let filtered = products.filter(
        product =>
            product.name.toLowerCase().includes(search) &&
            (!category || product.category === category),
    );
    if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    return NextResponse.json({
        products: filtered.slice(start, start + pageSize),
        total,
        page,
        pageSize,
    });
}
