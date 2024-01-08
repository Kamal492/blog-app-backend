
const jwt = require('jsonwebtoken');
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  

  if (!req.headers.hasOwnProperty('cookie')) {
    req.user = null;
    return res.status(401).json({ user: null, message: 'Authorization denied' });
  } 
  
  
  try {
    // Verify and decode the token
    const cookie_string = req.headers.cookie
    const token = cookie_string.split("=")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    req.user = null;
    res.status(401).json({ message: 'Token is not valid' });
    
  }
};




module.exports = authMiddleware;
