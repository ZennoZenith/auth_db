import { MysqlError } from '@errors/index'
// import { genAPIKey, hashAPIKey } from '@util/users.util'
// import dbQuery from '@util/queryDatabase.util'
import { drizzleUserDb } from '@util/databaseConnection.util'
import {
  apps,
  dashboardUsers,
  users,
  usersStagingEmail,
} from '@database/schema/users/schema'
import { eq } from 'drizzle-orm'

export async function createApp(
  appInsertData: typeof apps.$inferInsert,
) {
  try {
    await drizzleUserDb.insert(apps).values(appInsertData)
    const app = await drizzleUserDb.query.apps.findFirst({
      where: eq(apps.id, appInsertData.id),
    })
    return app!
  } catch (err: any) {
    throw new MysqlError(err.errno, { message: err.message })
  }
}

export async function createUser(
  userInsertData: typeof users.$inferInsert,
) {
  try {
    await drizzleUserDb.insert(users).values(userInsertData)
    const user = await drizzleUserDb.query.users.findFirst({
      where: eq(users.id, userInsertData.id),
    })
    return user!
  } catch (err: any) {
    throw new MysqlError(err.errno, { message: err.message })
  }
}

export async function createDashboardUser(
  dashboardInsertData: typeof dashboardUsers.$inferInsert,
) {
  try {
    await drizzleUserDb.insert(dashboardUsers).values(dashboardInsertData)
    const user = await drizzleUserDb.query.dashboardUsers.findFirst({
      columns: {
        appId: true,
        failedAttempts: true,
        username: true,
        createdAt: true,
      },
      where: eq(dashboardUsers.userId, dashboardInsertData.userId),
    })
    return user!
  } catch (err: any) {
    throw new MysqlError(err.errno, { message: err.message })
  }
}

export async function stageUser(
  {
    id,
    email,
  }: {
    id: string
    email: string
  },
) {
  try {
    await drizzleUserDb.insert(usersStagingEmail).values(
      {
        appId: 'DEFAULT',
        email,
        role: 'User',
        id,
      },
    )
    const user = await drizzleUserDb.query.usersStagingEmail.findFirst({
      columns: { email: true },
      where: eq(usersStagingEmail.id, id),
    })
    return user!
  } catch (err: any) {
    throw new MysqlError(err.errno, { message: err.message })
  }
}

/// ----------------------------------------------------------

// export async function getUserInfoFromAPIkey(API_KEY: string) {
//   const apiKeyOrganization = API_KEY.split('.')[0]
//   const hashedApiKey = hashAPIKey(API_KEY)

//   const fullHashedKey = `${apiKeyOrganization}.${hashedApiKey}`

//   let query = `SELECT userId, hashedApiKey, reqPerMin, reqPerMonth FROM api_keys
//     WHERE hashedApiKey = ?;`

//   const user = await dbQuery(query, [fullHashedKey])

//   if (user.length === 0) {
//     throw new UnauthenticatedError({
//       message: 'No user with given API key exists',
//     })
//   }

//   return user.result[0] as CustomData['API_KEY_USER']
// }

// export async function checkUniqueUserId(id: string) {
//   let query = `SELECT EXISTS(SELECT 1 FROM users WHERE id = ?) AS idCheck;`
//   const user = await dbQuery(query, [id])
//   if (user.result[0]?.idCheck === 0) {
//     return true
//   }
//   return false
// }

// export async function createUser(
//   {
//     id,
//     email,
//     hashedEmail,
//     username,
//     hashedPassword,
//     storeEmail = false,
//   }: {
//     id: string
//     email: Email
//     username: string
//     hashedPassword: string
//     hashedEmail: string
//     storeEmail: boolean
//   },
// ) {
//   let query = `INSERT INTO users
//     (id, username, hashedEmail, email, hashedPassword)
//     VALUES (?, ?, ?, ?, ? )`
//   const user = await dbQuery(query, [
//     id,
//     username,
//     hashedEmail,
//     storeEmail ? email : null,
//     hashedPassword,
//   ])

//   if (user.err) {
//     if (user.errMsg?.includes('hashed_email_UNIQUE')) {
//       throw new ConflictError({
//         message: 'Email already exists',
//       })
//     } else if (user.errMsg?.includes('username_UNIQUE')) {
//       throw new ConflictError({
//         message: 'Username already exists',
//       })
//     } else {
//       throw new InternalServerError({
//         message: user.errMsg as string,
//       })
//     }
//   }
// }

// export async function getUserByUsername(username: string) {
//   let query = `SELECT id, username, email, hashedPassword
//   FROM users WHERE username = ?`
//   const user = await dbQuery(query, [username])

//   if (user.length === 0) {
//     return null
//   }
//   return user.result[0] as {
//     id: string
//     username: string
//     email: string | null
//     hashedPassword: string
//   }
// }

// export async function getUserByHashedEmail(hashedEmail: string) {
//   let query = `SELECT id, username, email, hashedPassword
//   FROM users WHERE hashedEmail = ?`
//   const user = await dbQuery(query, [hashedEmail])

//   if (user.length === 0) {
//     return null
//   }
//   return user.result[0] as {
//     id: string
//     username: string
//     email: string | null
//     hashedPassword: string
//   }
// }

// export async function storeApiKey(
//   data: {
//     userId: string
//     prefix: string
//     hashedApiKey: string
//     reqPerMin: number
//     reqPerMonth: number
//   },
// ) {
//   let query =
//     `INSERT INTO api_keys (userId, prefix, hashedApiKey, reqPerMin, reqPerMonth)
//   VALUES (?, ?, ?, ?, ? );`
//   const result = await dbQuery(query, [
//     data.userId,
//     data.prefix,
//     data.hashedApiKey,
//     data.reqPerMin,
//     data.reqPerMonth,
//   ])

//   if (result.err === true) {
//     return false
//   }

//   query = `UPDATE users SET lastApiKeyGenerateTime = ?
//     WHERE id = ?;`
//   await dbQuery(query, [
//     Math.round(Date.now() / 1000),
//     data.userId,
//   ])
//   return true
// }

// export async function canGenerateApiKey(
//   userId: string,
// ) {
//   let limitApiKeys = 0
//   let lastApiKeyGenerateTime = 0
//   let numberOfApiKeys = 0

//   let query =
//     `SELECT limitApiKeys, lastApiKeyGenerateTime FROM users WHERE id = ?;`
//   let result = await dbQuery(query, [userId])

//   if (result.length === 0) {
//     return [numberOfApiKeys, limitApiKeys, lastApiKeyGenerateTime] as const
//   } else {
//     limitApiKeys = result.result[0].limitApiKeys as number
//     lastApiKeyGenerateTime = result.result[0].lastApiKeyGenerateTime as number
//   }

//   query = `SELECT COUNT(*) as numberOfApiKey FROM api_keys WHERE userId = ?;`
//   result = await dbQuery(query, [userId])

//   numberOfApiKeys = result.result[0].numberOfApiKey as number

//   return [numberOfApiKeys, limitApiKeys, lastApiKeyGenerateTime] as const
// }

// export async function getAllApiKeys(userId: string) {
//   let query = `SELECT prefix, reqPerMin, reqPerMonth, createdAt, updatedAt
//       FROM api_keys
//       WHERE userId = ?;`
//   let result = await dbQuery(query, [userId])

//   const apiKeysList = result.result as {
//     prefix: string
//     reqPerMin: number
//     reqPerMonth: number
//     createdAt: string
//     updatedAt: string
//   }[]

//   return apiKeysList
// }

// export async function regenerateApiKey(userId: string, prefix: string) {
//   const lastApiKeyGenerateTime = (await canGenerateApiKey(userId))[2]

//   if (
//     (lastApiKeyGenerateTime + 30) * 1000 >= Date.now()
//   ) {
//     throw new IAmATeapot({
//       message: 'Wait for some time before regenerating new api key',
//     })
//   }

//   let query =
//     `SELECT COUNT(*) as numberOfApiKey FROM api_keys WHERE userId = ? AND prefix = ?;`
//   let result = await dbQuery(query, [userId, prefix])
//   const numberOfApiKeys = result.result[0].numberOfApiKey as number

//   if (numberOfApiKeys === 0) {
//     throw new NotFoundError({
//       message: `No api key found with prefix: '${prefix}'`,
//     })
//   }

//   const [apiKey, _, hashedApiKey] = genAPIKey('fa3e16e2', prefix)
//   query = `UPDATE api_keys SET
//       hashedApiKey = ?
//       WHERE userId = ? AND prefix = ?`
//   result = await dbQuery(query, [
//     hashedApiKey,
//     userId,
//     prefix,
//   ])

//   if (result.err === true) {
//     throw new BadRequestError(
//       { message: 'Unable to regenerate api key' },
//       'UnableToUpdate',
//     )
//   } else {
//     query = `UPDATE users SET lastApiKeyGenerateTime = ?
//     WHERE id = ?;`
//     await dbQuery(query, [
//       Math.round(Date.now() / 1000),
//       userId,
//     ])
//   }

//   return [apiKey, prefix] as const
// }

// export async function updateApiKey(
//   userId: string,
//   prefix: string,
//   reqPerMin: number,
//   reqPerMonth: number,
// ) {
//   const lastApiKeyGenerateTime = (await canGenerateApiKey(userId))[2]

//   if (
//     (lastApiKeyGenerateTime + 30) * 1000 >= Date.now()
//   ) {
//     throw new IAmATeapot({
//       message: 'Wait for some time before updating new api key',
//     })
//   }

//   let query =
//     `SELECT COUNT(*) as numberOfApiKey FROM api_keys WHERE userId = ? AND prefix = ?;`
//   let result = await dbQuery(query, [userId, prefix])
//   const numberOfApiKeys = result.result[0].numberOfApiKey as number

//   if (numberOfApiKeys === 0) {
//     throw new NotFoundError({
//       message: `No api key found with prefix: '${prefix}'`,
//     })
//   }

//   query = `UPDATE api_keys SET
//       reqPerMin = ?, reqPerMonth = ?
//       WHERE userId = ? AND prefix = ?`
//   result = await dbQuery(query, [
//     reqPerMin,
//     reqPerMonth,
//     userId,
//     prefix,
//   ])

//   if (result.err === true) {
//     throw new BadRequestError(
//       { message: 'Unable to regenerate api key' },
//       'UnableToUpdate',
//     )
//   } else {
//     query = `UPDATE users SET lastApiKeyGenerateTime = ?
//     WHERE id = ?;`
//     await dbQuery(query, [
//       Math.round(Date.now() / 1000),
//       userId,
//     ])
//   }

//   query = `SELECT prefix, reqPerMin, reqPerMonth, createdAt, updatedAt
//       FROM api_keys
//       WHERE userId = ? LIMIT 1;`
//   result = await dbQuery(query, [userId])

//   const apiKey = result.result[0] as {
//     prefix: string
//     reqPerMin: number
//     reqPerMonth: number
//     createdAt: string
//     updatedAt: string
//   }

//   return apiKey
// }

// export async function deleteApiKey(
//   userId: string,
//   prefix: string,
// ) {
//   let query =
//     `SELECT COUNT(*) as numberOfApiKey FROM api_keys WHERE userId = ? AND prefix = ?;`
//   let result = await dbQuery(query, [userId, prefix])
//   const numberOfApiKeys = result.result[0].numberOfApiKey as number

//   if (numberOfApiKeys === 0) {
//     throw new NotFoundError({
//       message: `No api key found with prefix: '${prefix}'`,
//     })
//   }

//   query = `DELETE FROM api_keys
//       WHERE userId = ? AND prefix = ?`
//   result = await dbQuery(query, [
//     userId,
//     prefix,
//   ])

//   if (result.err === true) {
//     throw new BadRequestError(
//       { message: 'Unable to delete' },
//       'UnableToDelete',
//     )
//   }

//   return await getAllApiKeys(userId)
// }
