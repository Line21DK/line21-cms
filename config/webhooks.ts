export default {
  webhooks: {
    'project.created': {
      url: 'https://line21-cms.onrender.com/api/webhook/github',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        event: 'project.created',
        data: '{{ data }}',
      },
    },
    'project.updated': {
      url: 'https://line21-cms.onrender.com/api/webhook/github',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        event: 'project.updated',
        data: '{{ data }}',
      },
    },
    'project.deleted': {
      url: 'https://line21-cms.onrender.com/api/webhook/github',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        event: 'project.deleted',
        data: '{{ data }}',
      },
    },
  },
}; 