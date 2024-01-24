import crypto from 'crypto'

type BufferEncoding =
  | 'ascii'
  | 'utf8'
  | 'utf-8'
  | 'utf16le'
  | 'utf-16le'
  | 'ucs2'
  | 'ucs-2'
  | 'base64'
  | 'base64url'
  | 'latin1'
  | 'binary'
  | 'hex'

export function randomString(
  length: number,
  bufferEncoding: BufferEncoding = 'hex',
) {
  return crypto.randomBytes(length * 2 + 256).toString(bufferEncoding)
}

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

export async function hashPassword(
  password: string,
  config: Parameters<typeof Bun.password.hash>[1] = {
    algorithm: 'argon2id',

    memoryCost: 4, // memory usage in kibibytes
    timeCost: 3, // the number of iterations
  },
) {
  return await Bun.password.hash(password, config)
}

export async function hashUserDetails(
  { email, password }: { email: string; password: string },
) {
  const hashedEmail = hashEmail(email)
  const hashedPassword = hashPassword(password)
  return { hashedEmail, hashedPassword }
}

export async function genUniqueUserId(
  apiKeyOrganization: 'user__id' | 'dash_usr' = 'user__id',
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
