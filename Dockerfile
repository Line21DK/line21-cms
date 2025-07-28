FROM directus/directus:latest

# Eksponer port
EXPOSE 8055

# Start Directus med eksplicit port og host
CMD ["npx", "directus", "start", "--host", "0.0.0.0", "--port", "8055"] 