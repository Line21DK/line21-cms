FROM directus/directus:latest

# Kopier scripts til container
COPY . /directus

# Sæt arbejdsmappe
WORKDIR /directus

# Installer dependencies
RUN npm install

# Eksponer port
EXPOSE 8055

# Start Directus
CMD ["npx", "directus", "start"] 