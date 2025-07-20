const http = require('http');

const port = process.env.PORT || 10000;
const host = process.env.HOST || '0.0.0.0';

console.log('🚀 Starting Line21 CMS server...');
console.log('📊 Environment variables:');
console.log('  - PORT:', process.env.PORT);
console.log('  - HOST:', process.env.HOST);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - PWD:', process.cwd());

const server = http.createServer((req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`📝 ${timestamp} - ${req.method} ${req.url}`);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: '🎉 Line21 CMS Server is running!',
      server: {
        port: port,
        host: host,
        nodeEnv: process.env.NODE_ENV,
        timestamp: timestamp,
        uptime: process.uptime()
      },
      request: {
        method: req.method,
        url: req.url
      }
    }, null, 2));
  } else if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'ok', 
      timestamp: timestamp,
      uptime: process.uptime()
    }));
  } else if (req.url === '/test') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: '✅ Test endpoint working!',
      serverInfo: {
        port: port,
        host: host,
        nodeEnv: process.env.NODE_ENV,
        cwd: process.cwd(),
        nodeVersion: process.version
      }
    }, null, 2));
  } else if (req.url === '/debug') {
    res.writeHead(200);
    res.end(JSON.stringify({
      environment: {
        PORT: process.env.PORT,
        HOST: process.env.HOST,
        NODE_ENV: process.env.NODE_ENV,
        PWD: process.cwd()
      },
      process: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
      }
    }, null, 2));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ 
      error: 'Not found',
      availableEndpoints: ['/', '/health', '/test', '/debug'],
      timestamp: timestamp
    }, null, 2));
  }
});

server.listen(port, host, () => {
  console.log(`✅ Server running on http://${host}:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔧 Port: ${port}`);
  console.log(`🏠 Host: ${host}`);
  console.log(`📁 Working directory: ${process.cwd()}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('🎯 Server setup complete, waiting for connections...'); 