const express = require('express');
const router = express();
const multer = require('multer');
const { new_payment, update_payment_api } = require('../controllers/payments.js');

const upload = multer({storage: multer.memoryStorage()});

router.post('/new-payment', upload.single("payment"), new_payment);
router.post('/update-payment', upload.single("payment"), update_payment_api);

module.exports = router;