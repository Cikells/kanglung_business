const pool = require('../config/db');

const getDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Find user's shop
    const shopRes = await pool.query(`SELECT * FROM shops WHERE user_id = $1`, [userId]);
    const shop = shopRes.rows[0];

    if (!shop) return res.send('No shop found.');

    // Get products by shop
    const productRes = await pool.query(`SELECT * FROM products WHERE shop_id = $1`, [shop.id]);

    res.render('dashboard', {
      user: req.session.user,
      products: productRes.rows,
      shopId: shop.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Dashboard Error');
  }
};

// Add product with image support
const addProduct = async (req, res) => {
  const { name, description, price, shop_id } = req.body;
  const imagePath = req.file ? req.file.path.replace(/^public[\\/]/, '') : null;

  try {
    await pool.query(
      `INSERT INTO products (shop_id, name, description, price, image_path)
       VALUES ($1, $2, $3, $4, $5)`,
      [shop_id, name, description, price, imagePath]
    );
    res.redirect('/user/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Add Product Failed');
  }
};

// Edit product with optional image update
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const imagePath = req.file ? req.file.path.replace(/^public[\\/]/, '') : null;

  try {
    if (imagePath) {
      await pool.query(
        `UPDATE products SET name = $1, description = $2, price = $3, image_path = $4 WHERE id = $5`,
        [name, description, price, imagePath, id]
      );
    } else {
      await pool.query(
        `UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4`,
        [name, description, price, id]
      );
    }
    res.redirect('/user/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Edit Failed');
  }
};

// ✅ Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
    res.redirect('/user/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete Failed');
  }
};

module.exports = {
  getDashboard,
  addProduct,
  editProduct,
  deleteProduct,
};
