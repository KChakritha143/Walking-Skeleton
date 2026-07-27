require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const app = express();
connectDB();
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/payments', require('./routes/payments'));
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error occurred' });
});
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Security Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Backend API URL: http://localhost:${PORT}`);
  console.log(`Backend Status Check: http://localhost:${PORT}/api/status`);
});