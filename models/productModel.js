const pool = require('../config/db');

const createProductTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
      name VARCHAR(100),
      description TEXT,
      price NUMERIC(10, 2),
      image_path VARCHAR(255), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

module.exports = createProductTable;
