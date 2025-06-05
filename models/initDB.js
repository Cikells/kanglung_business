const createUserTable = require('./userModel');
const createShopTable = require('./shopModel');
const createProductTable = require('./productModel');
const createOrderTable = require('./orderModel');

const initDB = async () => {
  try {
    await createUserTable();
    await createShopTable();
    await createProductTable();
    await createOrderTable();
    console.log('All tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

initDB();
