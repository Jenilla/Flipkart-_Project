# ShopKart (Flipkart-clone) Backend

A complete Node.js + Express + SQLite backend for the existing React/Vite
ShopKart frontend. JWT authentication (httpOnly cookie), product catalog with
search/filter, a per-user cart, and order placement.

## Tech Stack

- Node.js + Express.js
- SQLite + Sequelize ORM
- JWT (jsonwebtoken) + bcryptjs
- express-validator, helmet, express-rate-limit, cors, cookie-parser, morgan
- multer (available for future image-upload endpoints)

## Folder Structure

```
server/
├── config/db.js               # Sequelize/SQLite connection + sync
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── index.js                # associations
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── CartItem.js
│   ├── Order.js
│   └── OrderItem.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── seed/seedProducts.js
├── utils/generateToken.js
├── data/                       # SQLite .sqlite file lives here (auto-created)
├── .env.example
├── server.js
└── package.json
```

## 1. Prerequisites

- Node.js 18+
- No external database server required — SQLite is a single file created
  automatically the first time the app runs.

> **Note:** This backend now lives in a single combined project alongside the
> frontend — see the root [`README.md`](../README.md) for the easiest way to
> run everything together with one command. The instructions below are for
> running this `server/` folder on its own.

## 2. Install & Configure

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` if you want to change any defaults:

```
PORT=5000
NODE_ENV=development
SQLITE_STORAGE=./data/flipkart.sqlite
JWT_SECRET=some_long_random_string
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE_DAYS=7
CLIENT_URL=http://localhost:5173
```

## 3. Run the Backend

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

On first run the backend will:

1. Create `data/flipkart.sqlite` and all tables automatically.
2. Detect the product table is empty and auto-seed 35 products across
   Smartphones, Laptops, Headphones, Watches, Cameras, Tablets, TVs,
   Speakers, Shoes, and Fashion — no manual seed step required.

The API is now live at `http://localhost:5000/api`. Check `GET /api/health`.

You can still reseed manually at any time:

```bash
npm run seed          # wipes and reinserts the 35 sample products
npm run seed:destroy  # removes all products
```

## 4. Run the Frontend

```bash
cd ../client
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). The frontend's
`src/services/api.js` uses a relative `baseURL: '/api'`, and `client/vite.config.js`
proxies `/api/*` to this server on port 5000 during `npm run dev`, so as soon
as both are running, signup, login, product Browse, cart, and checkout all
work end-to-end against SQLite.

Prefer running everything with one command instead? See the root
[`README.md`](../README.md) — `npm run dev` there starts both, and `npm start`
serves the built frontend from this same server on a single port.

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

## Database Design (Sequelize / SQLite)

The Mongoose document model maps onto these relational tables:

```
User
 └── Cart (1:1)
      └── CartItem (1:N) ──> Product
User
 └── Order (1:N)
      └── OrderItem (1:N) ──> Product (snapshotted title/image/price)
```

- Primary keys are UUIDs (`Product`, `User`, `Cart`, `Order`) to avoid any
  change in ID *shape* seen by the frontend; every model's JSON output also
  includes an `_id` field mirroring `id`, exactly like a Mongoose document,
  so no frontend code needed to change.
- `Product.originalPrice` and `Product.availability` are Sequelize `VIRTUAL`
  fields — computed on read, never stored — reproducing the old Mongoose
  virtuals.
- Foreign keys, unique constraints (one cart per user, unique email) and
  validations are enforced at the Sequelize/SQLite level.
- Tables are created automatically via `sequelize.sync()` on startup; no
  manual migration step is required for this project's scope.

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds) in a Sequelize
  `beforeSave` hook, never returned in API responses (excluded by the
  model's default scope).
- JWTs are stored in an httpOnly, sameSite cookie — not accessible to
  client-side JS.
- `helmet` sets standard security headers; `express-rate-limit` throttles
  both the whole API and auth endpoints specifically.
- All inputs are validated (`express-validator` on auth; Sequelize model
  validation everywhere else); not-found IDs and duplicate emails return
  clean 400/404 errors instead of raw stack traces.

## Migration Notes (MongoDB → SQLite)

This backend was migrated from MongoDB/Mongoose to SQLite/Sequelize. No API
routes, request/response shapes, authentication flow, or business logic were
changed — only the persistence layer. See the "Database Design" section
above for how each Mongoose schema now maps to a Sequelize model/table.
