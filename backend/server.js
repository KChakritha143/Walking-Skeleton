require('dotenv').config();

// Standardize fatal crash termination early
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
connectDB();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(generalLimiter);
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/ai', require('./routes/ai'));

app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running securely', time: new Date() });
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Auth API Backend</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 50px; background: #0f0f13; color: #e1e1e6; }
          a { color: #a78bfa; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
          .card { max-width: 500px; margin: 0 auto; background: #1a1a24; padding: 30px; border-radius: 12px; border: 1px solid #2d2d3d; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
          h2 { color: #f3f4f6; margin-top: 0; }
          code { background: #262636; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #f472b6; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Backend API Server is Running! </h2>
          <p>This is the backend server running on port <strong>5000</strong>.</p>
          <p>To view the website interface, please open the frontend URL:</p>
          <p><a href="http://localhost:5173" target="_blank" style="font-size: 1.2em;">http://localhost:5173</a></p>
          <p style="font-size: 0.9em; color: #9ca3af; margin-top: 20px;">Make sure to start the development servers by running <code>npm run dev</code> from the root project directory!</p>
        </div>
      </body>
    </html>
  `);
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.redirect('/');
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({ message: err.message || 'Internal server error occurred' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Security Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});