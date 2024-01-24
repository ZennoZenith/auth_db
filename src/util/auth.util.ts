import crypto from 'crypto'
import { BadRequestError, InternalServerError } from '@errors/index'

function hashEmail(email: string) {
  return crypto
    .createHash('sha256')
    .update(email + Bun.env.EMAIL_SALT)
    .digest('base64')
}

export function hashAPIKey(token: string): string {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('base64')
}

export async function hashUserDetails(
  { email, password }: { email: string; password: string },
) {
  const hashedEmail = hashEmail(email)
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: 'argon2id',

    memoryCost: 4, // memory usage in kibibytes
    timeCost: 3, // the number of iterations
  })

  return { hashedEmail, hashedPassword }
}

export async function genUniqueUserId(
  apiKeyOrganization: 'user__id' = 'user__id',
) {
  return `${apiKeyOrganization}.${crypto.randomUUID()}` as const
}

// export async function validateLogin(
//   username: string | undefined,
//   email: string | undefined,
//   password: string,
// ) {
//   let user
//   if (username) {
//     user = await database.users.getUserByUsername(username)
//   } else {
//     user = await database.users.getUserByHashedEmail(hashEmail(email))
//   }

//   if (user === null) {
//     throw new BadRequestError({
//       message: 'Incorrect credentials',
//     })
//   }

//   const match = await Bun.password.verify(password, user.hashedPassword)
//   if (!match) {
//     throw new BadRequestError({
//       message: 'Incorrect credentials',
//     })
//   }

//   return user
// }
