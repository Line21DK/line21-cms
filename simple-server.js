const http = require('http');

const port = process.env.PORT || 10000;
const host = process.env.HOST || '0.0.0.0';

console.log('Starting simple HTTP server...');
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- HOST:', process.env.HOST);
console.log('- NODE_ENV:', process.env.NODE_ENV);

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'Simple HTTP server is running!',
      port: port,
      host: host,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      url: req.url
    }));
  } else if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    }));
  } else if (req.url === '/test') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'Test endpoint working!',
      serverInfo: {
        port: port,
        host: host,
        nodeEnv: process.env.NODE_ENV
      }
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ 
      error: 'Not found',
      availableEndpoints: ['/', '/health', '/test']
    }));
  }
});

server.listen(port, host, () => {
  console.log(`✅ Simple HTTP server running on http://${host}:${port}`);
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