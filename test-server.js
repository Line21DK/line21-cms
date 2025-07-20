const express = require('express');
const app = express();

const port = process.env.PORT || 10000;
const host = process.env.HOST || '0.0.0.0';

console.log('Starting test server...');
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- HOST:', process.env.HOST);
console.log('- NODE_ENV:', process.env.NODE_ENV);

app.get('/', (req, res) => {
  res.json({
    message: 'Test server is running!',
    port: port,
    host: host,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working!',
    serverInfo: {
      port: port,
      host: host,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
const server = app.listen(port, host, () => {
  console.log(`✅ Test server running on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Port: ${port}`);
  console.log(`Host: ${host}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
}); 