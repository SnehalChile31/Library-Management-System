const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  console.log("token",token);
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  console.log("req.user",req.user);
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

exports.authorizeUser = (req, res, next) => {
  if (req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
