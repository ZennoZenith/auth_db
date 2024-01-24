import type { Config } from 'drizzle-kit'

const databaseUriArr = process.env.USER_DATABASE_URL.split('|')
export default {
  out: './src/database/schema/users',
  driver: 'mysql2',
  dbCredentials: {
    user: databaseUriArr[1],
    password: databaseUriArr[2],
    host: databaseUriArr[3],
    port: parseInt(databaseUriArr[4]),
    database: databaseUriArr[5],
  },
  verbose: true,
  strict: true,
  introspect: {
    casing: 'camel',
  },
} satisfies Config
