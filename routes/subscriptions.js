const express = require('express');
const router = express();
const { new_subscription, update_subscription } = require('../controllers/subscription.js');

router.post('/new-subscription', new_subscription);
router.post('/update-subscription', update_subscription);

module.exports = router;