# 🎯 Line21 Directus CMS

Dette er en komplet Directus setup til Line21 portfolio website.

## 🚀 Hurtig Start

### 1. Setup Directus
```bash
# Kør setup scriptet
npm run setup
```

### 2. Start Directus
```bash
# Start Directus med Docker
npm start
```

### 3. Konfigurer API Token
1. Gå til http://localhost:8055/admin
2. Log ind med admin@line21.dk / admin123
3. Gå til Settings → API Tokens
4. Opret en ny token med "Full access" permissions
5. Kopier token værdien

### 4. Sæt miljøvariabler
Opret eller opdater `.env` filen:
```env
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=din-api-token-her
```

### 5. Importer projekter
```bash
# Test import først (DRY RUN)
npm run import:dry

# Kør rigtig import
npm run import
```

## 📊 Kommandoer

### Docker Kommandoer
```bash
npm start          # Start Directus
npm run stop       # Stop Directus
npm run restart    # Genstart Directus
npm run logs       # Se logs
npm run status     # Tjek status
```

### Import Kommandoer
```bash
npm run import        # Sikker import (kun nye projekter)
npm run import:dry    # Test import (DRY RUN)
npm run import:force  # Force update alle projekter
npm run import:test   # Test force update
```

## 🔧 Konfiguration

### Miljøvariabler
| Variabel | Beskrivelse | Standard |
|----------|-------------|----------|
| `DIRECTUS_URL` | Directus server URL | `http://localhost:8055` |
| `DIRECTUS_TOKEN` | API token for authentication | `your-api-token-here` |
| `LOG_LEVEL` | Log niveau (debug, info, warn, error) | `info` |
| `DRY_RUN` | Test mode uden ændringer | `false` |
| `FORCE_UPDATE` | Opdater eksisterende projekter | `false` |

### Docker Compose
Directus kører med:
- **Directus**: Port 8055
- **PostgreSQL**: Port 5432 (internt)
- **Volumes**: `./extensions`, `./uploads`, `postgres_data`

## 🛡️ Sikkerhedsfunktioner

### ✅ Beskytter eksisterende data
- **Sletter IKKE** eksisterende projekter
- **Spring over** eksisterende projekter som standard
- **Kun opretter** nye projekter

### 🔍 DRY RUN mode
- Test import uden at ændre noget
- Viser præcis hvad der ville ske
- Perfekt til at verificere før rigtig import

### 📊 Detaljeret logging
- Viser præcis hvad der sker
- Tæller oprettede/opdaterede/sprunget over projekter
- Fejlhåndtering med detaljerede fejlmeddelelser

## 🔄 Workflow

### Første gang
1. `npm run setup`
2. `npm start`
3. Opret admin bruger og API token
4. Sæt miljøvariabler i `.env`
5. `npm run import:dry` (test)
6. `npm run import` (rigtig import)

### Efterfølgende imports
1. Tilføj nye JSON filer til `../public/static-data/`
2. `npm run import` (kun nye projekter)
3. Eller `npm run import:force` (opdater alle)

## 🚨 Troubleshooting

### "Docker er ikke installeret"
- Download Docker Desktop fra: https://www.docker.com/products/docker-desktop
- Start Docker Desktop
- Prøv igen

### "Port 8055 er optaget"
- Stop eksisterende Directus: `npm run stop`
- Eller ændr port i `docker-compose.yml`

### "Kunne ikke forbinde til Directus"
- Tjek at Directus kører: `npm run status`
- Vent lidt og prøv igen: Directus tager tid at starte
- Se logs: `npm run logs`

### "Unauthorized"
- Tjek `DIRECTUS_TOKEN` i `.env`
- Generer ny token i Directus admin
- Tjek token permissions

## 📁 Fil Struktur

```
directus/
├── docker-compose.yml      # Docker konfiguration
├── .env                    # Miljøvariabler
├── package.json           # Node.js dependencies
├── setup-directus.js      # Setup guide
├── import-projects.js     # Import script
├── README.md              # Denne fil
├── extensions/            # Directus extensions
└── uploads/               # Uploadede filer

project/
└── public/
    └── static-data/
        ├── project-golf-in-europe.json
        ├── project-another-project.json
        └── ...
```

## 🎯 Fordele ved Directus

1. **Moderne API** - GraphQL og REST
2. **Fleksibel** - Tilpasset til alle behov
3. **Open Source** - Gratis og transparent
4. **Bedre Performance** - Hurtigere end Strapi
5. **Bedre UX** - Mere intuitivt admin panel
6. **TypeScript Support** - Førsteklasses TypeScript support

## 🔗 Nyttige Links

- [Directus Admin](http://localhost:8055/admin)
- [Directus API](http://localhost:8055)
- [Directus Dokumentation](https://docs.directus.io)
- [Directus GitHub](https://github.com/directus/directus) 