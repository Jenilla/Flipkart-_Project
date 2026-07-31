# ShopKart (Flipkart-clone) — Full Stack

A single project combining:

- **`server/`** — Express + SQLite (Sequelize) REST API
- **`client/`** — React + Vite frontend

Both live in this one folder and are wired together so the whole app can run
as **one process on one port** — no separate frontend/backend servers or
CORS configuration required to use the app.

```
flipkart-fullstack/
├── client/        # React/Vite frontend
├── server/        # Express/SQLite backend
└── package.json   # root scripts that orchestrate both
```

## Quick Start (combined, single port — recommended)

```bash
npm run install-all   # installs both client/ and server/ dependencies
cp server/.env.example server/.env
npm start              # builds the React app, then serves API + UI together
```

Open **http://localhost:5000** — that's it, one URL for everything. On first
run the backend also auto-creates the SQLite database and seeds 35 sample
products.

How this works: `npm start` first runs `vite build` inside `client/`
(producing `client/dist`), then starts the Express server. The server serves
`client/dist` as static files and answers `/api/*` requests itself, so the
browser only ever talks to one origin — the frontend's `axios` baseURL is
just `/api` (see `client/src/services/api.js`).

## Alternative: Split Dev Mode (hot-reload frontend)

If you're actively editing the frontend and want Vite's instant hot-reload
instead of rebuilding on every change:

```bash
npm run install-all
cp server/.env.example server/.env
npm run dev
```

This starts both dev servers together via `concurrently`:
- Backend on `http://localhost:5000` (nodemon, auto-restarts on changes)
- Frontend on `http://localhost:5173` (Vite, instant hot-reload)

`client/vite.config.js` proxies any `/api/*` request from the Vite dev server
to the backend on port 5000, so you still use `http://localhost:5173` in the
browser and everything just works — same relative `/api` calls, no CORS
setup needed on your part.

## Other useful commands

```bash
npm run build   # just builds the frontend into client/dist
npm run seed    # re-seed the product catalog (server/seed/seedProducts.js)
```

## More details

- Backend API reference, database design, and migration notes:
  [`server/README.md`](./server/README.md)
- Frontend-specific notes: [`client/README.md`](./client/README.md)
