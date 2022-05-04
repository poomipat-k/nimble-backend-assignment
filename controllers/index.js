const express = require('express');
const keyword = require('./keyword');

const api = express.Router();

const controllers = [keyword];
api.use(controllers);

module.exports = api;
