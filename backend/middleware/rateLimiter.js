const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts. Please try again after a minute.'
  }
});

const aiSuggestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many AI suggestion requests. Please try again after a minute.'
  }
});

module.exports = {
  generalLimiter,
  loginLimiter,
  aiSuggestLimiter
};
