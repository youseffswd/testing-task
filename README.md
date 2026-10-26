# ShopDesk

A small online store built with Next.js, TypeScript, and Tailwind CSS. It uses an in-memory server data layer, so catalog stock and newly placed orders reset when the server restarts.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build, run `npm run build` followed by `npm start`.

## Routes

- `/products` — searchable, filterable catalog
- `/products/[id]` — product detail
- `/cart` — cart, coupon and currency options
- `/checkout` — three-step checkout
- `/login` — demo account login
- `/orders` — protected order history
- `/orders/[id]/confirmation` — order confirmation

## Demo account

- Email: `demo@shopdesk.dev`
- Password: `Password123!`

## Notes

Exchange rates are requested from Frankfurter when switching away from USD. The app retains a rate response in local storage for one hour.
