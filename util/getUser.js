const router = require("express").Router();
const User = require("../models/Users");
const authenticateToken = require('./authMiddleware');

router.get('/user', (req, res) => {
    // Retrieve user information based on the token
   // authenticateToken();
    const token = req.cookies.token;
    // Return the user information to the client
    //res.json({ username: user.username });
    res.json(token);
  });

  module.exports = router