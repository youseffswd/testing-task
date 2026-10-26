import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";


/*
[
    {
        "id": "p01",
        "name": "Cloud Cotton Towel",
        "category": "Home",
        "price": 18.5,
        "rating": 4.6,
        "stock": 22,
        "description": "Cloud Cotton Towel is thoughtfully made for everyday use. A practical little detail for your desk, home, or next trip."
    },
    {
        "id": "p02",
        "name": "Cedar Desk Lamp",
        "category": "Home",
        "price": 42.99,
        "rating": 4.2,
        "stock": 4,
        "description": "Cedar Desk Lamp is thoughtfully made for everyday use. A practical little detail for your desk, home, or next trip."
    },
    {
        "id": "p03",
        "name": "Stoneware Mug Set",
        "category": "Home",
        "price": 29.95,
        "rating": 4.8,
        "stock": 0,
        "description": "Stoneware Mug Set is thoughtfully made for everyday use. A practical little detail for your desk, home, or next trip."
    },
    {
        "id": "p04",
        "name": "Linen Table Runner",
        "category": "Home",
        "price": 24.5,
        "rating": 4.1,
        "stock": 8,
        "description": "Linen Table Runner is thoughtfully made for everyday use. A practical little detail for your desk, home, or next trip."
    },
    {
        "id": "p05",
        "name": "Mini Herb Garden",
        "category": "Home",
        "price": 31.25,
        "rating": 4.5,
        "stock": 12,
        "description": "Mini Herb Garden is thoughtfully made for everyday use. A practical little detail for your desk, home, or next trip."
    },
    {
        "id": "p06",
        "name": "Atlas Daypack",
        "category": "Travel",
        "price": 69.99,
        "rating": 4.7,
        "stock": 5,
        "description": "Atlas Daypack is thoughtfully made for everyday use. A practical little detail for your desk, home, or next trip."
    },
    {
        "id": "p07",
        "name": "Pocket Travel Pillow",
        "category": "Travel",
        "price": 19.99,
        "rating": 4,
        "stock": 18,
        "description": "Pocket Travel Pillow is thoughtfully made for everyday use. A practical little detail for your desk, home, or next trip."
    },
    {
        "id": "p08",
        "name": "Carry-On Organizer",
        "category": "Travel",
        "price": 35.5,
        "rating": 4.3,
        "stock": 2,
        "description": "Carry-On Organizer is thoughtfully made for everyday use. A practical little detail for your desk, home, or next trip."
    }
]
*/




vi.mock("@/lib/data.ts", () => ({
  products: [{
  id: "p01",
  name: "Cloud Cotton Towel",
  category: "Home",
  price: 18.5,
  rating: 4.6,
  stock: 22,
  description: "A practical towel for everyday use.",
}],
}));


describe("GET /api/products", () => {
    it("should return return products without any parameters", async () => {
        const response = await GET(makeRequest({}));
        const data = await response.json();
        expect(data).toEqual([product])

    });
});

function makeRequest(params: Record<string, string>) {
    const searchParams = new URLSearchParams();
    for (const key in params) {
        searchParams.set(key, params[key]);
    }
    console.log("https://localhost:3002/" + searchParams);
    return new NextRequest("https://localhost:3002/products?" + searchParams);
}
