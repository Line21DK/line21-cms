FROM directus/directus:latest

# Kopier scripts til container
COPY . /directus

# Sæt arbejdsmappe
WORKDIR /directus

# Eksponer port
EXPOSE 8055

# Start Directus
CMD ["npx", "directus", "start"] 