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