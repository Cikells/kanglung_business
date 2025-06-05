const pool = require('../config/db');

const createShopTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS shops (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      shop_name VARCHAR(100),
      description TEXT,
      image_path VARCHAR(255),  
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

module.exports = createShopTable;
