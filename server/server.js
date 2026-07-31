require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { Product } = require('./models');
const { importData } = require('./seed/seedProducts');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const start = async () => {
  // Connect to SQLite and auto-create tables.
  await connectDB();

  // Auto-seed the catalog on first run so the app is usable immediately
  // after `npm install && npm run dev` with no manual seed step required.
  const productCount = await Product.count();
  if (productCount === 0) {
    console.log('Product table is empty — running initial seed...');
    await importData({ exitProcess: false });
  }

  const app = express();

  // Security headers. CSP is relaxed just enough for the bundled frontend:
  // - imgSrc allows https: since product images are hotlinked from Pexels
  // - styleSrc allows 'unsafe-inline' for a couple of inline `style={{}}` usages
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'https:', 'data:'],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
        },
      },
    })
  );

  // CORS - allow the Vite frontend origin and send/receive cookies
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Logging (skip in test env)
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // General API rate limiter
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', apiLimiter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running' });
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);

  // Serve the built frontend (client/dist) from the same server/port so the
  // whole app — API + UI — runs as one process with no CORS involved.
  // In local dev you can still run `npm run dev` inside client/ separately
  // (its Vite proxy forwards /api to this server); this static block simply
  // has nothing to serve until `npm run build` has produced client/dist.
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));

    // Any non-API GET request falls back to index.html so React Router can
    // handle client-side routes (e.g. /products/123 on a hard refresh).
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  // Error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});
