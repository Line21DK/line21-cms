# Thumbnail Fields Guide

## 🖼️ Thumbnail & ThumbnailUrl Felter

I Strapi admin interfacet er `thumbnail` og `thumbnailUrl` felterne nu visuelt grupperet sammen for bedre brugeroplevelse.

## 📋 Felterne

### 1. **Thumbnail (Upload)**
- **Type**: Media upload
- **Formål**: Upload en thumbnail billede direkte til Strapi
- **Format**: Kun billeder (images)
- **Placering**: Første felt i thumbnail sektionen

### 2. **ThumbnailUrl (External URL)**
- **Type**: String/URL
- **Formål**: Angiv en ekstern URL til thumbnail billede
- **Format**: HTTPS URL til billede
- **Placering**: Andet felt i thumbnail sektionen

## 🎨 Visuel Gruppering

Felterne er nu visuelt grupperet med:
- **Grønne borders** (#34c0ae) for at vise sammenhæng
- **Ikoner** for at skelne mellem upload og URL
- **Beskrivelser** under hvert felt
- **Sammenhængende styling**

## 💡 Brugsvejledning

### Valg mellem Upload og URL:

**Brug Upload (Thumbnail):**
- Når du har billedet lokalt
- Når du vil have billedet gemt i Strapi
- Når du vil have automatisk optimering

**Brug URL (ThumbnailUrl):**
- Når billedet allerede er hostet et andet sted
- Når du vil spare plads i Strapi
- Når du bruger eksterne billeder (f.eks. Unsplash)

### Eksempel:
```
Thumbnail: [Upload billede fra computer]
ThumbnailUrl: https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop
```

## 🔧 Teknisk Implementation

### Database:
- `thumbnail`: Media relation til Strapi's media library
- `thumbnail_url`: String kolonne i database

### API Response:
```json
{
  "id": 102,
  "title": "SpeakerBee Corporate Production",
  "thumbnail": {
    "id": 1,
    "url": "/uploads/thumbnail.jpg",
    "formats": { ... }
  },
  "thumbnailUrl": "https://example.com/external-thumbnail.jpg"
}
```

### Frontend Brug:
```javascript
// Prioritér thumbnailUrl hvis tilgængelig, ellers brug thumbnail
const thumbnailUrl = project.thumbnailUrl || project.thumbnail?.url;
```

## 🚀 Næste Skridt

1. **Test felterne** i Strapi admin
2. **Upload billeder** til eksisterende projekter
3. **Tilføj eksterne URLs** hvor relevant
4. **Opdater frontend** til at bruge begge felter

## 📝 Noter

- Begge felter er valgfrie
- Du kan bruge begge samtidigt (frontend kan prioritere)
- ThumbnailUrl tjekkes ikke for gyldighed i admin
- Upload felter understøtter kun billeder 