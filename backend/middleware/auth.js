const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function authenticate(req, res, next) {
  console.log('authenticate middleware called for route:', req.originalUrl);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid user' });

    console.log('Authenticated user:', user.id, user.role); // Debug log
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};