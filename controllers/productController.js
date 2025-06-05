const pool = require('../config/db');

const getAllProducts = async (req, res) => {
  try {
    const productsRes = await pool.query(
      `SELECT p.*, s.shop_name FROM products p JOIN shops s ON p.shop_id = s.id`
    );
    res.render('products', { products: productsRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading products');
  }
};

const getBuyForm = async (req, res) => {
  const productId = req.params.id;
  try {
    const productRes = await pool.query(
      `SELECT p.*, s.shop_name FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = $1`,
      [productId]
    );
    if (productRes.rowCount === 0) return res.status(404).send('Product not found');
    res.render('buyForm', { product: productRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading buy form');
  }
};

const postBuyRequest = async (req, res) => {
  const productId = req.params.id;
  const { buyer_name, phone } = req.body;

  try {
    const productRes = await pool.query(`SELECT * FROM products WHERE id = $1`, [productId]);
    if (productRes.rowCount === 0) return res.status(404).send('Product not found');

    await pool.query(
      `INSERT INTO orders (product_id, buyer_name, phone_number, status)
       VALUES ($1, $2, $3, 'pending')`,
      [productId, buyer_name, phone]
    );

    res.send('Purchase request sent! The shop owner will contact you soon.');
  } catch (err) {
    console.error('Error in postBuyRequest:', err);
    res.status(500).send('Error submitting purchase request');
  }
};

const getProductsByShop = async (req, res) => {
  const shopId = req.params.shopId;

  try {
    const result = await pool.query('SELECT * FROM products WHERE shop_id = $1', [shopId]);
    const products = result.rows;

    res.render('products', { products, shopId });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal Server Error');
  }
};

// ✅ Add product with image - FIXED image path to be relative for static serving
const addProduct = async (req, res) => {
  const { name, description, price, shop_id } = req.body;

  // Remove 'public/' prefix to store relative path for static access
  const imagePath = req.file ? req.file.path.replace(/^public[\\/]/, '') : null;

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, shop_id, image_path)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, price, shop_id, imagePath]
    );

    res.status(201).send(`Product "${result.rows[0].name}" added successfully`);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Error adding product');
  }
};

module.exports = {
  getAllProducts,
  getBuyForm,
  postBuyRequest,
  getProductsByShop,
  addProduct,
};
