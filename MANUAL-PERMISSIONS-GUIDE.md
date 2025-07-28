# 🔐 MANUEL PERMISSIONS GUIDE

## Problem
API token har ikke tilladelse til at læse alle felter i projects collection.

## Løsning

### 1. Gå til Directus Admin Panel
```
http://localhost:8055/admin
```

### 2. Log ind med din admin bruger
- Email: admin@line21.dk
- Password: admin123

### 3. Gå til Settings → Roles & Permissions

### 4. Find din API token's rolle
- Klik på "Roles" i venstre menu
- Find rollen der er tildelt til din API token

### 5. Opdater Projects Collection Permissions
- Klik på "Projects" collection
- Sæt alle permissions til "All" eller "Create/Read/Update/Delete"
- Gem ændringerne

### 6. Alternativt - Opret ny API token
- Gå til "Settings" → "API Tokens"
- Opret en ny token med "Full Access" permissions
- Opdater .env filen med den nye token

### 7. Test igen
```bash
npm run import
```

## Felter der skal have adgang:
- ✅ title
- ✅ slug  
- ✅ client
- ✅ category
- ✅ project_icon
- ✅ thumbnail
- ✅ thumbnail_url
- ✅ role
- ✅ year
- ✅ start_date
- ✅ end_date
- ✅ description
- ✅ short_description
- ✅ challenge
- ✅ solution
- ✅ featured
- ✅ featured_video
- ✅ featured_images_title
- ✅ featured_images_description
- ✅ featured_images
- ✅ short_form_videos_title
- ✅ short_form_videos
- ✅ long_form_videos_title
- ✅ long_form_videos
- ✅ content_strategy
- ✅ production_techniques
- ✅ results
- ✅ links
- ✅ seo

## Næste trin efter permissions er opdateret:
1. Kør `npm run import` for at importere alle projekter
2. Gå til "Content" → "Projects" for at se resultatet
3. Alle felter skal nu være tilgængelige og udfyldt 