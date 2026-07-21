#!/bin/sh
set -e

# Wait for PostgreSQL to be ready (docker-compose healthcheck handles this)
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for PostgreSQL to be ready..."
  sleep 5
  echo "PostgreSQL should be ready!"
  
  # Seed the database if not already seeded
  echo "Checking if database needs seeding..."
  node -e "
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    pool.query('SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = \\'users\\')')
      .then(res => {
        if (!res.rows[0].exists) {
          console.log('Database not seeded. Running seed...');
          pool.end();
          process.exit(1);
        } else {
          console.log('Database already seeded.');
          pool.end();
          process.exit(0);
        }
      })
      .catch(err => {
        console.error('Error checking database:', err);
        pool.end();
        process.exit(1);
      });
  " || (echo "Seeding database..." && npm run db:seed)
fi

# Start the application
exec "$@"
