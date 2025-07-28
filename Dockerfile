FROM directus/directus:latest

# Eksponer port
EXPOSE 8055

# Sæt entrypoint til Directus
ENTRYPOINT ["directus"]

# Start Directus med den korrekte kommando
CMD ["start"] 