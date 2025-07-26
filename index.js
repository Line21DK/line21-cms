const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

console.log('🚀 Starting Line21 CMS server...');
console.log('📊 Environment variables:');
console.log('  - PORT:', process.env.PORT);
console.log('  - HOST:', process.env.HOST);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - PWD:', process.cwd());

// Basic middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  console.log('📝 Health check requested');
  res.json({ 
    status: 'ok', 
    port, 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Webhook endpoint
app.post('/api/webhook/github', (req, res) => {
  console.log('Webhook received:', req.body);
  
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.error('GitHub token not configured');
    return res.status(400).json({ error: 'GitHub token not configured' });
  }
  
  // Simple GitHub API call
  fetch('https://api.github.com/repos/brianraaby/line21-website/dispatches', {
    method: 'POST',
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: 'strapi-update',
      client_payload: { 
        source: 'webhook', 
        timestamp: new Date().toISOString(),
        data: req.body 
      }
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('GitHub Action triggered successfully');
      res.json({ success: true, message: 'GitHub Action triggered' });
    } else {
      console.error('GitHub API failed:', response.status);
      res.status(400).json({ error: 'GitHub API failed' });
    }
  })
  .catch(error => {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('📝 Root endpoint requested');
  res.json({ 
    message: 'Line21 CMS Server', 
    status: 'running', 
    port,
    env: process.env.NODE_ENV || 'development'
  });
});

// Start server - MUST bind to 0.0.0.0 for Render
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌐 Host: 0.0.0.0`);
  console.log(`🔗 Health: http://0.0.0.0:${port}/health`);
  console.log(`🔗 Webhook: http://0.0.0.0:${port}/api/webhook/github`);
  console.log(`✅ Server is ready to accept connections`);
});

// Error handling for server
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error('❌ Port is already in use');
  }
  process.exit(1);
});

// Graceful shutdown
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