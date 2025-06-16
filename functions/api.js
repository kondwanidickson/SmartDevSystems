require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.use('/.netlify/functions/api', require('../server'));

module.exports.handler = serverless(app);
