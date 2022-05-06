const express = require('express');
const keyword = require('./keyword');
const user = require('./user');

const api = express.Router();

const controllers = [keyword, user];
api.use(controllers);

module.exports = api;
