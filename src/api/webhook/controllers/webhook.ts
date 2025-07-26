import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async triggerGitHubAction(ctx) {
    try {
      const { body } = ctx.request;
      
      console.log('🔗 Webhook triggered:', body);
      
      // GitHub repository dispatch URL
      const githubUrl = 'https://api.github.com/repos/brianraaby/line21-website/dispatches';
      const githubToken = process.env.GITHUB_TOKEN;
      
      if (!githubToken) {
        console.error('❌ GITHUB_TOKEN not configured');
        return ctx.badRequest('GitHub token not configured');
      }
      
      // Trigger GitHub Action
      const response = await fetch(githubUrl, {
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
            data: body
          }
        })
      });
      
      if (response.ok) {
        console.log('✅ GitHub Action triggered successfully');
        return ctx.send({ 
          success: true, 
          message: 'GitHub Action triggered successfully' 
        });
      } else {
        console.error('❌ Failed to trigger GitHub Action:', response.status, response.statusText);
        return ctx.badRequest('Failed to trigger GitHub Action');
      }
      
    } catch (error) {
      console.error('❌ Webhook error:', error);
      return ctx.badRequest('Webhook error: ' + error.message);
    }
  },
  
  async health(ctx) {
    return ctx.send({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      strapi: strapi.config.get('info.name'),
      version: strapi.config.get('info.version')
    });
  }
}); 