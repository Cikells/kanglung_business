const pool = require('../config/db');
const bcrypt = require('bcrypt');

const getSignup = (req, res) => res.render('signup');
const getLogin = (req, res) => res.render('login');



const postSignup = async (req, res) => {
  const { name, email, password, shop_name, description } = req.body;
  const shopImage = req.file ? req.file.filename : null;

  try {
    console.log('Signup request received:', req.body);
    
    // Validate required fields
    if (!name || !email || !password || !shop_name || !description || !shopImage) {
      console.warn('Missing signup fields');
      return res.status(400).send('All fields including image are required.');
    }

    // Check if user already exists
    const existingUser = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      console.warn('Email already exists:', email);
      return res.status(400).send('Email already registered.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    // Insert user
    const userRes = await pool.query(
      `INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, email, hashedPassword, false]
    );
    const userId = userRes.rows[0].id;
    console.log('User inserted with ID:', userId);

    // Insert shop
    await pool.query(
      `INSERT INTO shops (user_id, shop_name, description, image_path) VALUES ($1, $2, $3, $4)`,
      [userId, shop_name, description, shopImage]
    );
    console.log('Shop created for user ID:', userId);

    res.redirect('/login');
  } catch (err) {
    console.error('Signup error:', err.message || err);
    res.status(500).send('Signup failed. Please try again.');
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // First check for admin login
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
  req.session.admin = true;
  return res.redirect('/admin/admindashboard');
}


    // Then check for user login
    const userRes = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (userRes.rowCount === 0) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      is_admin: user.is_admin,
    };

    res.redirect('/user/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Login failed');
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

module.exports = {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout,
};
