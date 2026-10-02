import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import inquiryRoutes from './routes/inquiries.js';
import favoriteRoutes from './routes/favorites.js';

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());

// CORS - allow frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      // In development, allow all
      return callback(null, true);
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏡 Elara Estates API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      inquiries: '/api/inquiries',
      favorites: '/api/favorites',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/favorites', favoriteRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

// For local development - listen on port
// For Vercel - export app and don't listen (Vercel handles it)
if (!process.env.VERCEL) {
  let server;
  const MAX_PORT_RETRIES = 10;

  const listenOn = (port, retriesLeft = MAX_PORT_RETRIES) => {
    server = app.listen(port, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      console.log(`🔗 http://localhost:${port}`);
      if (port !== PORT) {
        console.warn(`⚠️  Port ${PORT} was busy, using ${port} instead.`);
        console.warn(`   Frontend Vite proxy targets http://localhost:${PORT} — free that port or update vite.config.js`);
      }
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && retriesLeft > 0) {
        console.error(`❌ Port ${port} already in use!`);
        console.error(`👉 Fix: kill process on port ${port} or change PORT in backend/.env`);
        console.error(`   Windows: netstat -aon | findstr :${port}  then  taskkill /F /PID <PID>`);
        const nextPort = port + 1;
        console.log(`🔄 Trying port ${nextPort}...`);
        listenOn(nextPort, retriesLeft - 1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  };

  listenOn(PORT);

  // Graceful shutdown (registered once)
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down gracefully`);
    if (server) server.close(() => process.exit(0));
    else process.exit(0);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

export default app;
