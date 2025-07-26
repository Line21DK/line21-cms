const express = require('express');
const app = express();

// Get port from environment variable (Render sets this)
const port = process.env.PORT || 10000;

// Basic middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
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
  res.json({ 
    message: 'Line21 CMS Server', 
    status: 'running', 
    port,
    env: process.env.NODE_ENV || 'development'
  });
});

// Start server - MUST bind to 0.0.0.0 for Render
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌐 Host: 0.0.0.0`);
  console.log(`🔗 Health: http://0.0.0.0:${port}/health`);
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