const express = require('express');
const app = express();

const port = process.env.PORT || 10000;
const host = process.env.HOST || '0.0.0.0';

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

app.listen(port, host, () => {
  console.log(`Test server running on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Port: ${port}`);
  console.log(`Host: ${host}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
}); 