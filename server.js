const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: port,
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV
  });
});

// Webhook endpoint
app.post('/api/webhook/github', (req, res) => {
  console.log('🔗 Webhook received:', req.body);
  
  // Simulate GitHub API call
  const githubUrl = 'https://api.github.com/repos/brianraaby/line21-website/dispatches';
  const githubToken = process.env.GITHUB_TOKEN;
  
  if (!githubToken) {
    console.error('❌ GITHUB_TOKEN not configured');
    return res.status(400).json({ error: 'GitHub token not configured' });
  }
  
  // Trigger GitHub Action
  fetch(githubUrl, {
    method: 'POST',
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: 'strapi-update',
      client_payload: {
        source: 'strapi-webhook',
        timestamp: new Date().toISOString(),
        data: req.body
      }
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ GitHub Action triggered successfully');
      res.json({ success: true, message: 'GitHub Action triggered successfully' });
    } else {
      console.error('❌ Failed to trigger GitHub Action:', response.status, response.statusText);
      res.status(400).json({ error: 'Failed to trigger GitHub Action' });
    }
  })
  .catch(error => {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook error: ' + error.message });
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Line21 CMS Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    port: port,
    endpoints: {
      health: '/health',
      webhook: '/api/webhook/github'
    }
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌐 Host: 0.0.0.0`);
  console.log(`🔗 Health check: http://0.0.0.0:${port}/health`);
  console.log(`🔗 Webhook: http://0.0.0.0:${port}/api/webhook/github`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
}); 