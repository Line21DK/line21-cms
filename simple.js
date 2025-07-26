const http = require('http');
const port = process.env.PORT || 10000;

console.log('🚀 Starting ultra-simple Line21 CMS server...');
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
        host: '0.0.0.0',
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
      uptime: process.uptime(),
      port: port
    }));
  } else if (req.url === '/api/webhook/github' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log('Webhook received:', body);
      
      const githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        console.error('GitHub token not configured');
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'GitHub token not configured' }));
        return;
      }
      
      // Simple GitHub API call
      const https = require('https');
      const data = JSON.stringify({
        event_type: 'strapi-update',
        client_payload: { 
          source: 'webhook', 
          timestamp: new Date().toISOString(),
          data: JSON.parse(body || '{}')
        }
      });
      
      const options = {
        hostname: 'api.github.com',
        port: 443,
        path: '/repos/brianraaby/line21-website/dispatches',
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };
      
      const githubReq = https.request(options, (githubRes) => {
        if (githubRes.statusCode === 204) {
          console.log('GitHub Action triggered successfully');
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'GitHub Action triggered' }));
        } else {
          console.error('GitHub API failed:', githubRes.statusCode);
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'GitHub API failed' }));
        }
      });
      
      githubReq.on('error', (error) => {
        console.error('Webhook error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      });
      
      githubReq.write(data);
      githubReq.end();
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ 
      error: 'Not found',
      availableEndpoints: ['/', '/health', '/api/webhook/github'],
      timestamp: timestamp
    }, null, 2));
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔧 Port: ${port}`);
  console.log(`🏠 Host: 0.0.0.0`);
  console.log(`📁 Working directory: ${process.cwd()}`);
  console.log(`✅ Server is ready to accept connections`);
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