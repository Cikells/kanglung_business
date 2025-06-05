const pool = require('../config/db');

// Dashboard stats - renamed view to admindashboard
const dashboard = async (req, res) => {
  try {
    const userCountRes = await pool.query('SELECT COUNT(*) FROM users');
    const productCountRes = await pool.query('SELECT COUNT(*) FROM products');

    const userCount = userCountRes.rows[0].count;
    const productCount = productCountRes.rows[0].count;

    res.render('admin/admindashboard', {
      userCount,
      productCount,
      navActive: 'admindashboard'
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).send('Server error');
  }
};

const userManagement = async (req, res) => {
  try {
    const usersRes = await pool.query('SELECT id, name, email FROM users ORDER BY id DESC');
    const users = usersRes.rows;

    res.render('admin/users', {
      users,
      navActive: 'users'
    });
  } catch (err) {
    console.error('User management error:', err);
    res.status(500).send('Server error');
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  dashboard,
  userManagement,
  deleteUser,
};
