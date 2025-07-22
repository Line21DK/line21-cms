import path from 'path';

export default ({ env }) => {
  const dbUrl = env('DATABASE_URL');
  if (dbUrl) {
    return {
      connection: {
        client: 'postgres',
        connection: dbUrl,
        ssl: { rejectUnauthorized: false },
      },
    };
  }
  // fallback til lokal SQLite hvis DATABASE_URL ikke er sat
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };
};
