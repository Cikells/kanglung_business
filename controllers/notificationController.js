const pool = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, p.name AS product_name, o.phone_number AS phone
      FROM orders o
      JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
    `);
    const notifications = result.rows;
    res.render('notifications', { notifications });
  } catch (err) {
    console.error('Error loading notifications:', err);
    res.status(500).send('Error loading notifications');
  }
};

exports.acceptNotification = async (req, res) => {
  const notificationId = req.params.id;
  try {
    await pool.query(
      `UPDATE orders SET status = 'Accepted' WHERE id = $1`,
      [notificationId]
    );
    res.redirect('/notifications');
  } catch (err) {
    console.error('Error accepting notification:', err);
    res.status(500).send('Error accepting notification');
  }
};

exports.declineNotification = async (req, res) => {
  const notificationId = req.params.id;
  try {
    await pool.query(
      `UPDATE orders SET status = 'Declined' WHERE id = $1`,
      [notificationId]
    );
    res.redirect('/notifications');
  } catch (err) {
    console.error('Error declining notification:', err);
    res.status(500).send('Error declining notification');
  }
};
