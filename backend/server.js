const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();

// CORS with credentials support for cookies & sessions
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://65.1.47.84',
    'http://65.1.47.84:5000'
  ],
  credentials: true
}));

// Body & Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET || 'interiorDesignSecretKey123'));

// Session Management
app.use(session({
  secret: process.env.JWT_SECRET || 'interiorDesignSecretKey123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: false, // accessible for frontend session verification
    secure: false, // set to true if running over HTTPS in production
    sameSite: 'lax'
  }
}));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/consultations', require('./routes/consultationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Automated Health Check Endpoint (Task 5)
app.get('/health', (req, res) => {
  if (process.env.SIMULATE_FAILURE === 'true') {
    return res.status(500).json({ status: 'DOWN', reason: 'Simulated Health Check Failure' });
  }
  res.status(200).json({
    status: 'UP',
    version: process.env.APP_VERSION || '1.0.0',
    timestamp: new Date()
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('Interior Design API is running with Session & Cookie Auth');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});