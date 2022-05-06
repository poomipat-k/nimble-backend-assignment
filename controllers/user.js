const express = require('express');

const userServices = require('../services/user');

const router = express.Router();

router.post('/user/signup', async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  try {
    const result = await userServices.signup({
      email,
      password,
      confirmPassword,
    });
    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

router.post('/user/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await userServices.login({
      email,
      password,
    });
    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
