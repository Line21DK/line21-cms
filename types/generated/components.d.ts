import type { Schema, Struct } from '@strapi/strapi';

export interface SharedProjectResult extends Struct.ComponentSchema {
  collectionName: 'components_shared_project_results';
  info: {
    description: 'Project result with metric, value and description';
    displayName: 'Project Result';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    metric: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO information for pages and projects';
    displayName: 'SEO';
  };
  attributes: {
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_shared_seo_s';
  info: {
    displayName: 'shared.seo,';
  };
  attributes: {};
}

export interface SharedTechnique extends Struct.ComponentSchema {
  collectionName: 'components_shared_techniques';
  info: {
    description: 'A technique or skill used in the project';
    displayName: 'Technique';
  };
  attributes: {
    technique: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedVideoContent extends Struct.ComponentSchema {
  collectionName: 'components_shared_video_contents';
  info: {
    description: 'Video content with title, URL, thumbnail and description';
    displayName: 'Video Content';
  };
  attributes: {
    description: Schema.Attribute.Text;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Videos'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.project-result': SharedProjectResult;
      'shared.seo': SharedSeo;
      'shared.shared-seo': SharedSharedSeo;
      'shared.technique': SharedTechnique;
      'shared.video-content': SharedVideoContent;
    }
  }
}
