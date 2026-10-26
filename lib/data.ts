import { Order, Product } from "./types";

export const products: Product[] = [
    ["p01", "Cloud Cotton Towel", "Home", 18.5, 4.6, 22],
    ["p02", "Cedar Desk Lamp", "Home", 42.99, 4.2, 4],
    ["p03", "Stoneware Mug Set", "Home", 29.95, 4.8, 0],
    ["p04", "Linen Table Runner", "Home", 24.5, 4.1, 8],
    ["p05", "Mini Herb Garden", "Home", 31.25, 4.5, 12],
    ["p06", "Atlas Daypack", "Travel", 69.99, 4.7, 5],
    ["p07", "Pocket Travel Pillow", "Travel", 19.99, 4.0, 18],
    ["p08", "Carry-On Organizer", "Travel", 35.5, 4.3, 2],
    ["p09", "Trail Water Bottle", "Travel", 22.75, 4.6, 0],
    ["p10", "Passport Cover & Tag", "Travel", 17.99, 4.2, 14],
    ["p11", "Studio Headphones", "Tech", 129.99, 4.8, 7],
    ["p12", "Pocket Bluetooth Speaker", "Tech", 49.5, 4.4, 3],
    ["p13", "USB-C Braided Cable", "Tech", 12.49, 4.5, 32],
    ["p14", "Ergonomic Mouse Pad", "Tech", 16.99, 4.1, 0],
    ["p15", "Webcam Privacy Shutter", "Tech", 8.25, 4.0, 26],
    ["p16", "Sunday Market Tote", "Fashion", 21.99, 4.4, 9],
    ["p17", "Merino Beanie", "Fashion", 28, 4.7, 5],
    ["p18", "Canvas Everyday Cap", "Fashion", 19.5, 4.1, 16],
    ["p19", "Café Stripe Socks", "Fashion", 14.99, 4.3, 0],
    ["p20", "Reversible Belt", "Fashion", 38.75, 4.5, 10],
    ["p21", "The Quiet City", "Books", 15.99, 4.6, 20],
    ["p22", "Field Notes for Makers", "Books", 18.99, 4.2, 6],
    ["p23", "How We Build", "Books", 26.5, 4.8, 4],
    ["p24", "A Small Atlas of Stars", "Books", 22, 4.8, 11],
    ["p25", "The Long Weekend", "Books", 13.25, 4.0, 0],
    ["p26", "Aurora Keyboard", "Tech", 89.99, 4.7, 8],
    ["p27", "Wireless Charging Stand", "Tech", 34.99, 4.3, 6],
    ["p28", "Screen Cleaning Kit", "Tech", 11.99, 4.2, 30],
    ["p29", "Mechanical Keycap Set", "Tech", 44.44, 4.6, 2],
    ["p30", "Pocket Notebook", "Books", 7.5, 4.1, 25],
    ["p31", "Soft Cover Journal", "Books", 16.75, 4.5, 15],
    ["p32", "Reading Light", "Books", 19.99, 4.3, 5],
    ["p33", "Herringbone Throw", "Home", 58.5, 4.7, 3],
    ["p34", "Ceramic Incense Holder", "Home", 15.5, 4.2, 10],
    ["p35", "Travel Laundry Pouch", "Travel", 13.99, 4.0, 12],
    ["p36", "Compact Umbrella", "Travel", 27.25, 4.4, 7],
    ["p37", '"Hello, World!" Tee', "Fashion", 25, 4.3, 18],
    ["p38", "Everyday Overshirt", "Fashion", 64.99, 4.6, 4],
    [
        "p39",
        "The Extremely Long Product Name That Keeps Going Well Beyond What A Small Product Card Was Designed To Handle Comfortably",
        "Home",
        39.99,
        4.5,
        1,
    ],
    ["p40", "Möbius Key Ring", "Fashion", 9.99, 4.1, 23],
].map(([id, name, category, price, rating, stock]) => ({
    id: id as string,
    name: name as string,
    category: category as string,
    price: price as number,
    rating: rating as number,
    stock: stock as number,
    description: `${name} is thoughtfully made for everyday use. A practical little detail for your desk, home, or next trip.`,
}));

const statusList = [
    "pending",
    "paid",
    "shipped",
    "delivered",
    "cancelled",
] as const;
export const orders: Order[] = Array.from({ length: 12 }, (_, index) => ({
    id: `ord_seed_${index + 1}`,
    email: "demo@shopdesk.dev",
    items: [{ ...products[index], quantity: 1 }],
    status: statusList[index % 5],
    total: products[index].price + 4.99,
    createdAt: new Date(Date.now() - index * 1000 * 60 * 60 * 22).toISOString(),
    shipping: {
        name: "Demo Shopper",
        address: "10 Market Street",
        city: "Cairo",
        postalCode: "11511",
        phone: "01000000000",
    },
}));

export function findProduct(id: string) {
    return products.find(product => product.id === id);
}
export function relatedProducts(product: Product) {
    return products
        .filter(
            item =>
                item.category === product.category && item.id !== product.id,
        )
        .slice(0, 3);
}
