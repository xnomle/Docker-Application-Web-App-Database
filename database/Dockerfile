FROM postgres:15-alpine

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432
