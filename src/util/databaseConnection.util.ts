import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

import * as usersSchema from '@database/schema/users/schema'
import * as usersRelationsSchema from '@database/schema/users/relations'

const userDatabaseUriArr = process.env.USER_DATABASE_URL.split('|')

const userDatabaseConf: mysql.PoolOptions = {
  user: userDatabaseUriArr[1],
  password: userDatabaseUriArr[2],
  host: userDatabaseUriArr[3],
  port: parseInt(userDatabaseUriArr[4]),
  database: userDatabaseUriArr[5],
  multipleStatements: false,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
}

export const userDatabaseConnection = mysql.createPool(userDatabaseConf)

try {
  console.log('Trying to get database connection')
  await userDatabaseConnection.getConnection()
} catch (err) {
  console.log('Database connection error!')
  process.exit(-1)
}

export const drizzleUserDb = drizzle(userDatabaseConnection, {
  schema: {
    ...usersSchema,
    ...usersRelationsSchema,
  },
  mode: 'default',
})

console.log('Database connection successful!')
