FROM directus/directus:latest

# Eksponer port
EXPOSE 8055

# Start Directus - bruger PORT miljøvariabel fra Render
CMD ["npx", "directus", "start", "--host", "0.0.0.0"] 