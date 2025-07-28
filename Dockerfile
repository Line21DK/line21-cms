FROM directus/directus:latest

# Eksponer port
EXPOSE 8055

# Start Directus med den korrekte kommando
CMD ["directus", "start"] 