const asyncHandler = require('express-async-handler')
const express = require('express');
const router = express();

// index
router.get('/', asyncHandler( async (req, res) => {
  res.send("Great, you are in the index route!");
}));

module.exports = router;