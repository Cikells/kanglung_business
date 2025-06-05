const pool = require('../config/db');

const getLandingPage = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT shops.*, users.name as owner_name
      FROM shops
      JOIN users ON users.id = shops.user_id
      ORDER BY shops.created_at DESC
    `);
    res.render('landing', { shops: result.rows });
  } catch (err) {
    console.error('Error loading landing page:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getLandingPage,
};
