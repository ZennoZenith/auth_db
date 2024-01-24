import { config } from '@config/config.setup'
import { users } from '@database/schema/users/schema'
import * as userDatabase from '@database/users.database'
import moment from 'moment'
import { genUniqueUserId, hashPassword } from '@util/auth.util'

export async function createDashboardUserRecipe(
  userData:
    & Omit<typeof users.$inferInsert, 'id'>
    & {
      appId: string
      username: string
      password: string
    },
) {
  const id = await genUniqueUserId('dash_usr')

  const hashedPassword = await hashPassword(userData.password)

  const user = await userDatabase.createUser({
    id,
    ...userData,
  })

  const dashUser = await userDatabase.createDashboardUser({
    userId: id,
    appId: userData.appId,
    username: userData.username,
    hashedPassword,
  })

  return { user, dashUser }
}

export async function stageUserRecipe(
  {
    id,
    email,
  }: {
    id: string
    email: string
  },
) {
  const expireTimestamp = moment(
    Date.now() + config.emailVerificationTokenLifetime,
  ).format('YYYY-MM-DD HH:mm:ss')
  const data = await userDatabase.stageUser({
    id,
    email,
  })

  return data
}
