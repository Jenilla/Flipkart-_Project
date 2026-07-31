# ShopKart — Flipkart-Style E-commerce Frontend

A complete, responsive e-commerce frontend built with **React + Vite**, using mock/local
product data. No backend required — this is designed to be easy to wire up to a real
API later (see `src/data/products.js`).

## Tech Stack

- React 18 + Vite
- React Router DOM v6
- Context API (Cart + Auth)
- Plain CSS (CSS variables for theming, no framework)

## Getting Started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/     Reusable UI: Navbar, CategoryBar, HeroBanner, ProductCard,
                  ProductSection, Footer
  context/        CartContext (cart state + totals), AuthContext (frontend-only
                  login/signup/logout via localStorage)
  data/           products.js — mock product catalog + category list
  pages/          Home, Products, ProductDetails, Cart, Login, Signup, NotFound
  App.jsx         Route definitions
  main.jsx        App entry point, wraps providers + router
```

## Routes

| Path            | Page            |
| --------------- | --------------- |
| `/`              | Home            |
| `/products`      | Product listing (supports `?search=`, `?category=`, `?price=`) |
| `/product/:id`   | Product details |
| `/login`         | Login           |
| `/signup`        | Signup          |
| `/cart`          | Shopping cart   |

## Notes

- Authentication is **frontend-only** (localStorage), since there's no backend yet.
  Replace `src/context/AuthContext.jsx` with real API calls once one exists.
- Cart state persists in `localStorage` and recalculates totals safely (no `NaN`s).
- Product images are placeholder images from picsum.photos — swap in real product
  photography or a CDN when available.
- Connecting to a backend later: replace the static `products` array in
  `src/data/products.js` with a fetch call, and swap `AuthContext`'s localStorage
  logic for real API requests. Component props/shapes are already API-ready.
