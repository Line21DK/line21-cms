const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

// Basic middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port, timestamp: new Date().toISOString() });
});

// Webhook endpoint
app.post('/api/webhook/github', (req, res) => {
  console.log('Webhook received');
  
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
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
      client_payload: { source: 'webhook', timestamp: new Date().toISOString() }
    })
  })
  .then(response => response.ok ? res.json({ success: true }) : res.status(400).json({ error: 'GitHub API failed' }))
  .catch(error => res.status(500).json({ error: error.message }));
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Line21 CMS Server', status: 'running', port });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0)); 