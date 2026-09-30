require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// ── Connect to MongoDB ──
connectDB();

const app = express();

// ── Core Middleware ──
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🌿 Breather API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ──
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/garden',       require('./routes/garden'));
app.use('/api/creations',    require('./routes/creations'));
app.use('/api/environments', require('./routes/environments'));
app.use('/api/soundscapes',  require('./routes/soundscapes'));
app.use('/api/rooms',        require('./routes/rooms'));
app.use('/api/preferences',  require('./routes/preferences'));
app.use('/api/users',        require('./routes/users'));

// ── Error Handling ──
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌿  Breather Server running on port ${PORT}`);
  console.log(`📡  API: http://localhost:${PORT}/api/health`);
  console.log(`🌍  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
