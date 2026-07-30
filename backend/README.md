# ShopKart (Flipkart-clone) Backend

A complete Node.js + Express + MongoDB backend for the existing React/Vite
ShopKart frontend. JWT authentication (httpOnly cookie), product catalog with
search/filter, a per-user cart, and order placement.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcryptjs
- express-validator, helmet, express-rate-limit, cors, cookie-parser, morgan
- multer (available for future image-upload endpoints)

## Folder Structure

```
backend/
├── config/db.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── seed/seedProducts.js
├── utils/generateToken.js
├── .env.example
├── server.js
└── package.json
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - **Local**: install MongoDB Community Server and run `mongod`, or
  - **Atlas**: create a free cluster at https://www.mongodb.com/cloud/atlas and copy its connection string.

## 2. Install & Configure

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/flipkart      # or your Atlas URI
JWT_SECRET=some_long_random_string
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE_DAYS=7
CLIENT_URL=http://localhost:5173
```

## 3. Seed the Database

Inserts 35 products across Smartphones, Laptops, Headphones, Watches,
Cameras, Tablets, TVs, Speakers, Shoes, and Fashion.

```bash
npm run seed
```

To wipe all products: `npm run seed:destroy`

## 4. Run the Backend

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API is now live at `http://localhost:5000/api`. Check `GET /api/health`.

## 5. Run the Frontend

```bash
cd flipkart-frontend
npm install       # installs axios along with the existing deps
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). The frontend's
`src/services/api.js` is pre-configured with `baseURL: http://localhost:5000/api`
and `withCredentials: true`, so as soon as both servers are running, signup,
login, product Browse, cart, and checkout all work end-to-end against MongoDB.

## API Reference

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/auth/signup | Public | Register (name, email, password) |
| POST | /api/auth/login | Public | Log in, sets httpOnly JWT cookie |
| POST | /api/auth/logout | Private | Clears the auth cookie |
| GET  | /api/auth/me | Private | Returns the logged-in user |

### Products
| Method | Route | Description |
|---|---|---|
| GET | /api/products | List products. Query: `search, category, brand, minPrice, maxPrice, rating, sort, page, limit` |
| GET | /api/products/:id | Single product |
| GET | /api/products/search?q=term | Case-insensitive search across title/description/brand/category |
| GET | /api/products/category/:category | Products in one category |
| GET | /api/products/filter | Same filters as the list route, no pagination |
| GET | /api/products/categories/list | Distinct category names in the catalog |

`sort` values: `newest`, `price-low-high`, `price-high-low`, `rating`.

### Cart (all require login)
| Method | Route | Description |
|---|---|---|
| GET | /api/cart | Get the current user's cart with computed totals |
| POST | /api/cart/add | Body: `{ productId, quantity }` |
| PUT | /api/cart/increase/:id | Increase quantity of a product by 1 |
| PUT | /api/cart/decrease/:id | Decrease quantity by 1 (removes at 0) |
| DELETE | /api/cart/remove/:id | Remove one item |
| DELETE | /api/cart/clear | Empty the cart |

### Orders (all require login)
| Method | Route | Description |
|---|---|---|
| POST | /api/orders | Place an order from the current cart, then empties it |
| GET | /api/orders | Order history for the logged-in user |
| GET | /api/orders/:id | A single order's details |

## Error Format

Every error response follows the same shape:

```json
{ "success": false, "message": "Product not found" }
```

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds), never returned in API responses.
- JWTs are stored in an httpOnly, sameSite cookie — not accessible to client-side JS.
- `helmet` sets standard security headers; `express-rate-limit` throttles both
  the whole API and auth endpoints specifically.
- All inputs are validated (`express-validator` on auth; Mongoose schema
  validation everywhere else); invalid ObjectIds and duplicate emails return
  clean 400/404 errors instead of raw stack traces.

## What Changed in the Frontend

Per the "don't redesign the UI" requirement, only data-fetching logic was
touched — no JSX/markup or CSS was changed:

- `src/services/api.js`, `authService.js`, `productService.js`,
  `cartService.js`, `orderService.js` — new Axios-based API layer.
- `src/context/AuthContext.jsx` — now calls the backend instead of
  reading/writing `localStorage`.
- `src/context/CartContext.jsx` — now syncs with `/api/cart` instead of
  `localStorage`; requires login (redirects to `/login` if you try to add to
  cart while signed out, since carts are now tied to a real user account).
- `src/pages/Home.jsx`, `Products.jsx`, `ProductDetails.jsx` — now fetch
  products from `/api/products` instead of importing the static
  `src/data/products.js` array.
- `src/data/products.js` — trimmed down to just the category list used by
  the category nav/filter UI (product data itself now lives in MongoDB).
- `src/pages/Login.jsx`, `Signup.jsx`, `src/components/Navbar.jsx` — updated
  to `await` the now-asynchronous auth calls.
