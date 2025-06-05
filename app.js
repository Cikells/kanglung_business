// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const session = require('./config/session');
app.use(session);

const createUserTable = require('./models/userModel');
const createShopTable = require('./models/shopModel');
const createProductTable = require('./models/productModel');
const createOrderTable = require('./models/orderModel');

// DB connection
const pool = require('./config/db');

// Routes
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', publicRoutes);
app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/notifications', notificationRoutes);
app.use('/admin', adminRoutes);

// Server start
const PORT = process.env.PORT || 3000;

const initDB = async () => {
  await createUserTable();
  await createShopTable();
  await createProductTable();
  await createOrderTable();
};

const startServer = async () => {
  try {
    await initDB();
    console.log('✅ All tables created successfully!');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  }
};

startServer();
