FROM directus/directus:latest

# Installer pg for database test
RUN npm install pg

# Eksponer port
EXPOSE 10000

# Start Directus - bruger PORT miljøvariabel fra Render
CMD ["npx", "directus", "start", "--host", "0.0.0.0", "--port", "10000"] 