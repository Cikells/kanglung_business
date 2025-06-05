const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware to protect admin routes
function isAdmin(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  res.redirect('/login');
}

// Admin dashboard route (renamed)
router.get('/admindashboard', isAdmin, adminController.dashboard);

// User management page
router.get('/users', isAdmin, adminController.userManagement);

// Delete user route
router.post('/users/delete/:id', isAdmin, adminController.deleteUser);

// Logout route
router.get('/logout', isAdmin, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
