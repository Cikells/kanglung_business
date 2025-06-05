const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { upload, setUploadType } = require('../controllers/multerController');

// Signup + Login
router.get('/signup', authController.getSignup);
router.post('/signup', setUploadType('user'), upload.single('profileImage'), authController.postSignup);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;
