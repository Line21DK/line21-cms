FROM node:18-alpine

# Installer Directus globalt
RUN npm install -g directus

# Opret app mappe
WORKDIR /app

# Eksponer port
EXPOSE 8055

# Start Directus
CMD ["directus", "start"] 