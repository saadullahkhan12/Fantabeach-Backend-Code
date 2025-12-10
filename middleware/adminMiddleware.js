const protect = require('./auth');

const adminMiddleware = (req, res, next) => {
  // First check authentication
  protect(req, res, (err) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Then check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  });
};

module.exports = adminMiddleware;

