const express = require('express');
const router = express.Router();
const { getLandingPage } = require('../controllers/publicController');

router.get('/', getLandingPage);

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/aboutus', (req, res) => {
  res.render('aboutus');
});



module.exports = router;
