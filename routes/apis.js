const express = require('express');
const router = express();
const { create_api, check_balance } = require('../controllers/apis.js');

router.get('/:uid', check_balance);
router.post('/create-api', create_api);

module.exports = router;