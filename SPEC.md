# ShopDesk Specification

## Catalog

REQ-001: `/products` is a client-rendered catalog page that requests `/api/products` with `search`, `category`, `sort`, `page`, and `pageSize` query parameters. It requests 8 products per page.

REQ-002: Search input waits 300 ms after the most recent user change before fetching, and a new search, category, or sort selection starts at page 1.

REQ-003: The catalog provides category options All categories, Home, Travel, Tech, Fashion, and Books, and sort options Featured, price ascending, price descending, name ascending, and rating descending.

REQ-004: The products API filters by a case-insensitive name search and exact category, sorts its filtered result, then returns the requested page and the filtered total.

REQ-005: The catalog shows `Showing X–Y of Z`; for an empty result X and Y are both 0. It shows a loading skeleton while loading, an error message plus Retry when a request fails, and an empty state when a successful result contains no products.

REQ-006: Every card displays name, price with two decimals, rating, stock badge, and Add to cart. Stock badges are `In stock` above 5 units, `Low stock` from 1 through 5, and `Out of stock` at 0. Add to cart is disabled at 0 stock.

REQ-007: The seed catalog contains exactly 40 products in the five listed categories, including zero-stock products, cent prices, a long name, a special-character name, and tied ratings.

## Product detail and cart

REQ-008: `/products/[id]` is an async server component that renders the product and up to 3 related products from the same category. An unknown product id returns the Next.js not-found page.

REQ-009: A detail page quantity selector starts at 1 and never goes below 1 or above the product stock. An out-of-stock product cannot be added.

REQ-010: Cart state supports add, remove, increment, decrement, and clear. Adding an existing product adds to its quantity but never above stock; increment never exceeds stock; decrement never drops below 1.

REQ-011: Cart data is hydrated from `localStorage` on mount and persisted after cart changes.

REQ-012: A cart can have one active coupon: `SAVE10` discounts 10% of subtotal; `FREESHIP` makes shipping free; `WELCOME5` deducts $5 only when subtotal is at least $30; `EXPIRED20` is rejected because it is expired relative to current time.

REQ-013: Cart totals use a $4.99 base shipping charge, free shipping when subtotal after discount is at least $50, 14% tax on subtotal after discount, and round displayed monetary amounts to two decimals. A valid `FREESHIP` coupon overrides the base shipping charge.

REQ-014: The cart supports USD, EUR, EGP, and GBP. Non-USD rates are requested from a public no-key endpoint, cached in local storage for one hour, and a failed request changes currency back to USD and shows a toast.

## Checkout

REQ-015: `/checkout` has Shipping, Payment, and Review steps. Shipping collects name, email, phone, address, city, and postal code. Payment collects card number, MM/YY expiry, and 3–4 digit CVC.

REQ-016: Required shipping fields, email format, phone format, card Luhn validity, non-past expiry, and CVC length validate on blur and Next. Each invalid field displays its error below that field.

REQ-017: Place order POSTs cart items, totals, shipping, and payment to `/api/orders`; it prevents a duplicate submission while a request is pending. A 422 displays server errors, a 409 displays stock failure, and a network failure displays an error toast.

REQ-018: The order API validates all fields again, returns 422 field errors, checks current server stock and returns 409 for insufficient stock, decrements stock only after successful validation, and returns a 201 order with a Date.now-and-random id.

REQ-019: A successful checkout clears the cart and redirects to `/orders/[id]/confirmation`.

## Authentication and orders

REQ-020: Login accepts only `demo@shopdesk.dev` / `Password123!`, returning a token and expiry exactly 30 minutes in the future. The browser stores both values in local storage.

REQ-021: Protected order pages redirect users without a non-expired token to `/login?next=<path>`. Successful login redirects to the `next` path or `/orders`.

REQ-022: A valid session warns once when 2 minutes remain and logs out automatically at expiry.

REQ-023: `/orders` lists 12 seeded demo-user orders with pending, paid, shipped, delivered, and cancelled statuses; it filters by status. Dates use current-time relative labels: under one minute `just now`, otherwise singular/plural minutes, hours, days, or weeks.

REQ-024: Only pending orders show Cancel order. Cancellation asks for confirmation, changes UI optimistically, PATCHes `/api/orders/[id]`, and restores the old UI with an error toast if the request fails.

## Shared UI

REQ-025: Header exposes catalog, orders, cart count, and login/logout. Toasts dismiss after 4 seconds. Pagination has previous and next controls. Status badges are visually distinct for each defined status.
