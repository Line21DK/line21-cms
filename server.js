const http = require('http');
const port = process.env.PORT || 10000;

console.log('🚀 Starting ultra-simple server...');
console.log('📊 PORT:', process.env.PORT);
console.log('📊 NODE_ENV:', process.env.NODE_ENV);

const server = http.createServer((req, res) => {
  console.log(`📝 ${req.method} ${req.url}`);
  
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'ok', 
      port: port,
      timestamp: new Date().toISOString()
    }));
  } else if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'Line21 CMS Server', 
      status: 'running',
      port: port
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🌐 Host: 0.0.0.0`);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received');
  server.close(() => process.exit(0));
}); 