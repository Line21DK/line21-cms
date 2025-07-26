import { prefixPluginTranslations } from '@strapi/helper-plugin';

export default {
  register(app: any) {
    // Add custom CSS for thumbnail grouping
    const style = document.createElement('style');
    style.textContent = `
      /* Group thumbnail fields together */
      [data-testid="thumbnail"] {
        border: 2px solid #34c0ae !important;
        border-radius: 8px !important;
        padding: 16px !important;
        margin-bottom: 16px !important;
        background: #f8f9fa !important;
      }
      
      [data-testid="thumbnailUrl"] {
        border: 2px solid #34c0ae !important;
        border-radius: 8px !important;
        padding: 16px !important;
        margin-bottom: 16px !important;
        background: #f8f9fa !important;
      }
      
      /* Add visual connection between fields */
      [data-testid="thumbnail"]::before,
      [data-testid="thumbnailUrl"]::before {
        content: "🖼️ THUMBNAIL SECTION";
        display: block;
        font-weight: bold;
        color: #34c0ae;
        margin-bottom: 8px;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      [data-testid="thumbnail"]::before {
        content: "📤 UPLOADED THUMBNAIL";
      }
      
      [data-testid="thumbnailUrl"]::before {
        content: "🔗 EXTERNAL URL";
      }
    `;
    document.head.appendChild(style);
  },

  bootstrap(app: any) {
    // Add custom field descriptions
    const addFieldDescriptions = () => {
      const thumbnailField = document.querySelector('[data-testid="thumbnail"]');
      const thumbnailUrlField = document.querySelector('[data-testid="thumbnailUrl"]');
      
      if (thumbnailField && !thumbnailField.querySelector('.custom-description')) {
        const desc = document.createElement('div');
        desc.className = 'custom-description';
        desc.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
        desc.textContent = 'Upload a thumbnail image for this project';
        thumbnailField.appendChild(desc);
      }
      
      if (thumbnailUrlField && !thumbnailUrlField.querySelector('.custom-description')) {
        const desc = document.createElement('div');
        desc.className = 'custom-description';
        desc.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
        desc.textContent = 'Or provide an external URL for the thumbnail';
        thumbnailUrlField.appendChild(desc);
      }
    };
    
    // Run after DOM is ready
    setTimeout(addFieldDescriptions, 1000);
    
    // Also run when navigating between pages
    const observer = new MutationObserver(addFieldDescriptions);
    observer.observe(document.body, { childList: true, subtree: true });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, 'thumbnail-grouping'),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
}; 