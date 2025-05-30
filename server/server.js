require('dotenv').config(); // Modified line
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const path = require('path');
const _dirname = path.resolve()

console.log(_dirname)
// Initialize Express app
const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Dev frontend
    'https://yourdomain.com', // Production
    'https://www.yourdomain.com'
  ],
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



 app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/employee', require('./routes/employeeRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));

  
app.use(express.static(path.join(_dirname, '/client/dist')));
app.get(/(.*)/,(req,res)=> res.sendFile(path.join(_dirname,'client/dist/index.html')))


// API Routes
// ================= PRODUCTION CONFIG =================


// ================= DEVELOPMENT CONFIG =================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  Server running in ${process.env.NODE_ENV || 'development'} mode
  Backend: http://localhost:${PORT}
  Frontend: ${process.env.NODE_ENV === 'production' 
    ? 'Served from /client/dist' 
    : 'http://localhost:5173'}
  `);
});