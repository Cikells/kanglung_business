const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// View all notifications
router.get('/', notificationController.getNotifications);

// Accept/Decline routes
router.post('/:id/accept', notificationController.acceptNotification);
router.post('/:id/decline', notificationController.declineNotification);

module.exports = router;
