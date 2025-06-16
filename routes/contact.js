const express = require('express');
const router = express();
const { sales_contact, enquiry_contact } = require('../controllers/contact');

router.post('/sales-contact', sales_contact);
router.post('/enquiry-contact', enquiry_contact);

module.exports = router;