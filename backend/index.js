const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const app = express();
app.use(helmet()); 

// ── CORS: whitelist production + local dev ──────────────────────────────────
const allowedOrigins = [
  'https://sddi-2025.web.app',
  'https://sddi-2025.firebaseapp.com',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS Not Allowed'));
  },
  credentials: true
}));

// Route for media upload 
app.use('/api/media', require('./routes/Media'));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

const isFirebase = process.env.FUNCTIONS_EMULATOR === 'true' || process.env.GCLOUD_PROJECT || process.env.FUNCTION_TARGET || process.env.K_SERVICE;
const uploadDir = isFirebase ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

const { seedData } = require('./db/database');

let isDbInitialized = false;

// Middleware to ensure DB is seeded
app.use(async (req, res, next) => {
  if (!isDbInitialized) {
    try {
      await seedData();
      isDbInitialized = true;
    } catch (e) {
      console.error('❌ Firestore seeding error', e);
      isDbInitialized = true;
    }
  }
  next();
});

// Load routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/Requests'));

const otherRoutes = require('./routes/Other');
app.use('/api/materials', otherRoutes.materialRouter);
app.use('/api/users', otherRoutes.userRouter);
app.use('/api/locations', otherRoutes.locationRouter);
app.use('/api/evaluations', otherRoutes.evalRouter);
app.use('/api/dashboard', otherRoutes.dashRouter);
app.use('/api/notifications', otherRoutes.notifRouter);
app.use('/api/reports', otherRoutes.reportRouter);
app.use('/api/schedule', otherRoutes.scheduleRouter);
app.use('/api/notification-settings', otherRoutes.notifSettingsRouter);
app.use('/api/audit-logs', otherRoutes.auditLogRouter);
app.use('/api/system', otherRoutes.systemRouter);


// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const isProd = !process.env.FUNCTIONS_EMULATOR;
  console.error('[ERROR]', err.message);
  if (err.message === 'CORS Not Allowed') {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.status(err.status || 500).json({
    error: isProd ? (err.message || 'Internal Server Error') : err.message,
    ...(isProd ? {} : { stack: err.stack })
  });
});

exports.api = onRequest({ cors: false, invoker: 'public' }, app);
