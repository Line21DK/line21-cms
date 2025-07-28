FROM directus/directus:latest

# Eksponer port
EXPOSE 8055

# Start Directus
CMD ["npx", "directus", "start"] 