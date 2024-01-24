import { Hono } from 'hono'
import * as userDatabase from '@database/users.database'
import {
  email,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  safeParse,
  string,
  toTrimmed,
} from 'valibot'
import { validator } from 'hono/validator'
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes'

import { genUniqueUserId, hashUserDetails } from '@util/auth.util'
import { BadRequestError, IAmATeapot, InternalServerError } from '@errors/index'
import { stageUser } from '@recipes/auth.recipe'

const app = new Hono()

app.post(
  `/signup`,
  validator('json', (value) => {
    const result = safeParse(
      object({
        email: string('Your email must be a string.', [
          toTrimmed(),
          minLength(1, 'Please enter your email.'),
          email('The email address is badly formatted.'),
        ]),
      }),
      value,
    )

    if (result.success) {
      return {
        email: result.output.email,
      }
    } else {
      throw new BadRequestError({
        message: result.issues.map((issue) => issue.message),
      })
    }
  }),
  async (c) => {
    const { email } = c.req.valid('json')
    const id = await genUniqueUserId()

    const data = await stageUser({
      id,
      email,
    })

    c.status(StatusCodes.OK)
    return c.json({ data })
  },
)

export default app

// =====================================================================
// app.post(
//   `/`,
//   validator('json', (value) => {
//     const storeEmail =
//       value.storeEmail === undefined || value.storeEmail === false
//         ? false
//         : true

//     const result = safeParse(
//       object({
//         username: string([
//           toTrimmed(),
//           minLength(1, 'Please enter your username.'),
//           minLength(4, 'Your username must have 4 characters or more.'),
//         ]),
//         email: string('Your email must be a string.', [
//           toTrimmed(),
//           minLength(1, 'Please enter your email.'),
//           email('The email address is badly formatted.'),
//         ]),
//         password: string([
//           toTrimmed(),
//           minLength(1, 'Please enter your password.'),
//           minLength(8, 'Your password must have 8 characters or more.'),
//         ]),
//       }),
//       value,
//     )

//     if (result.success) {
//       return {
//         email: result.output.email,
//         username: result.output.username,
//         password: result.output.password,
//         storeEmail,
//       }
//     } else {
//       throw new BadRequestError({
//         message: result.issues.map((issue) => issue.message),
//       })
//     }
//   }),
//   async (c) => {
//     const { email, password, username, storeEmail } = c.req.valid('json')
//     const { hashedEmail, hashedPassword } = await hashUserDetails({
//       email: email,
//       password: password,
//     })

//     const id = await genUniqueUserId()
//     await database.users.createUser({
//       id,
//       username,
//       email,
//       storeEmail,
//       hashedPassword,
//       hashedEmail,
//     })

//     c.status(StatusCodes.NO_CONTENT)
//     return c.body(null)
//   },
// )

// app.post(
//   `/login`,
//   validator('json', (value) => {
//     const result = safeParse(
//       object({
//         username: string([
//           toTrimmed(),
//           minLength(1),
//         ]),
//         password: string([
//           toTrimmed(),
//           minLength(1),
//         ]),
//       }),
//       value,
//     )
//     if (result.success) {
//       return {
//         username: result.output.username,
//         password: result.output.password,
//       }
//     } else {
//       throw new BadRequestError({
//         message: 'Email or username or password field in invalid',
//       })
//     }
//   }),
//   async (c) => {
//     const { username, password } = c.req.valid('json')
//     const user = await validateLogin(username, undefined, password)

//     const jwt = generateJwtToken({
//       id: user.id,
//       username: user.username,
//       email: user.email,
//     })

//     c.status(StatusCodes.OK)
//     return c.json({
//       jwt,
//     })
//   },
// )

// app.post(
//   `/apikey`,
//   userAuth,
//   validator('json', (value) => {
//     let reqPerMin = API_KEY_LEVEL.BASIC_API_KEY.reqPerMin as number
//     let reqPerMonth = API_KEY_LEVEL.BASIC_API_KEY.reqPerMonth as number

//     if (value.reqPerMin !== undefined) {
//       reqPerMin = parseInt(value.reqPerMin)
//       if (
//         Number.isNaN(reqPerMin) ||
//         reqPerMin > API_KEY_LEVEL.BASIC_API_KEY.reqPerMin
//       ) {
//         reqPerMin = API_KEY_LEVEL.BASIC_API_KEY.reqPerMin
//       }
//     }

//     if (value.reqPerMonth !== undefined) {
//       reqPerMonth = parseInt(value.reqPerMonth)
//       if (
//         Number.isNaN(reqPerMonth) ||
//         reqPerMonth > API_KEY_LEVEL.BASIC_API_KEY.reqPerMonth
//       ) {
//         reqPerMonth = API_KEY_LEVEL.BASIC_API_KEY.reqPerMonth
//       }
//     }

//     return {
//       reqPerMin,
//       reqPerMonth,
//     }
//   }),
//   async (c) => {
//     const [numberOfApiKeys, limitApiKeys, lastApiKeyGenerateTime] =
//       await database
//         .users.canGenerateApiKey(c.var.USERS.id)

//     if (numberOfApiKeys >= limitApiKeys) {
//       throw new IAmATeapot({
//         message: 'Maximum number of api keys limit reached',
//       })
//     }

//     if (
//       (lastApiKeyGenerateTime + API_CREATION_RESET_TIME_SEC) * 1000 >=
//         Date.now()
//     ) {
//       throw new IAmATeapot({
//         message: 'Wait for some time before generating new api key',
//       })
//     }

//     const [apiKey, prefix, hashedApiKey] = genAPIKey()

//     const { reqPerMin, reqPerMonth } = c.req.valid('json')

//     if (
//       !await database.users.storeApiKey({
//         userId: c.var.USERS.id,
//         hashedApiKey,
//         prefix,
//         reqPerMin,
//         reqPerMonth,
//       })
//     ) {
//       throw new InternalServerError({
//         message: 'Unable to genereate unique prefix try again',
//       })
//     }
//     await UserApikeyLogger(
//       {
//         ip: c.var.IP || 'ERROR_IP',
//         userId: c.var.USERS.id,
//         prefix,
//         reqPerMin,
//         reqPerMonth,
//         userAction: 'CREATED',
//       },
//     )

//     c.status(StatusCodes.OK)
//     return c.json({
//       data: { apiKey, prefix, reqPerMin, reqPerMonth },
//     })
//   },
// )

// app.get(`/apikey`, userAuth, async (c) => {
//   const apiKeys = await database.users.getAllApiKeys(c.var.USERS.id)
//   c.status(StatusCodes.OK)
//   return c.json({
//     data: { apiKeys },
//   })
// })

// app.patch(`/apikey/:prefix`, userAuth, async (c) => {
//   const prefix = c.req.param('prefix')
//   if (prefix === undefined) {
//     throw new BadRequestError({
//       message: "Url does not contain parameter 'prefix'",
//     }, 'UrlParameterUnspecified')
//   }
//   const [apiKey, _] = await database.users.regenerateApiKey(
//     c.var.USERS.id,
//     prefix,
//   )
//   UserApikeyLogger(
//     {
//       ip: c.var.IP || 'ERROR_IP',
//       userId: c.var.USERS.id,
//       prefix,
//       reqPerMin: null,
//       reqPerMonth: null,
//       userAction: 'REGENERATED',
//     },
//   )

//   c.status(StatusCodes.OK)
//   return c.json({
//     data: { apiKey, prefix },
//   })
// })

// app.patch(
//   `/apikey/:prefix/update`,
//   userAuth,
//   validator('json', (value) => {
//     const result = safeParse(
//       object({
//         reqPerMin: number([
//           minValue(1),
//           maxValue(API_KEY_LEVEL.BASIC_API_KEY.reqPerMin),
//         ]),
//         reqPerMonth: number([
//           minValue(1),
//           maxValue(API_KEY_LEVEL.BASIC_API_KEY.reqPerMonth),
//         ]),
//       }),
//       value,
//     )
//     if (result.success) {
//       return {
//         reqPerMin: result.output.reqPerMin,
//         reqPerMonth: result.output.reqPerMonth,
//       }
//     } else {
//       throw new BadRequestError({
//         message: 'Invalid body data',
//       })
//     }
//   }),
//   async (c) => {
//     const prefix = c.req.param('prefix')

//     const { reqPerMin, reqPerMonth } = c.req.valid('json')

//     if (prefix === undefined) {
//       throw new BadRequestError({
//         message: "Url does not contain parameter 'prefix'",
//       }, 'UrlParameterUnspecified')
//     }

//     if (reqPerMin === undefined) {
//       throw new BadRequestError({
//         message: 'reqPerMin unspecified in request body',
//       }, 'ReqBodyInvalid')
//     }

//     if (reqPerMonth === undefined) {
//       throw new BadRequestError({
//         message: 'reqPerMonth unspecified in request body',
//       }, 'ReqBodyInvalid')
//     }

//     const apiKey = await database.users.updateApiKey(
//       c.var.USERS.id,
//       prefix,
//       reqPerMin,
//       reqPerMonth,
//     )

//     UserApikeyLogger({
//       ip: c.var.IP || 'ERROR_IP',
//       userId: c.var.USERS.id,
//       prefix,
//       reqPerMin,
//       reqPerMonth,
//       userAction: 'UPDATED',
//     })
//     c.status(StatusCodes.OK)
//     return c.json({
//       data: apiKey,
//     })
//   },
// )
// app.delete(`/apikey/:prefix`, userAuth, async (c) => {
//   const prefix = c.req.param('prefix')
//   if (prefix === undefined) {
//     throw new BadRequestError({
//       message: "Url does not contain parameter 'prefix'",
//     }, 'UrlParameterUnspecified')
//   }
//   const apiKeys = await database.users.deleteApiKey(
//     c.var.USERS.id,
//     prefix,
//   )
//   UserApikeyLogger({
//     ip: c.var.IP || 'ERROR_IP',
//     userId: c.var.USERS.id,
//     prefix,
//     reqPerMin: null,
//     reqPerMonth: null,
//     userAction: 'DELETED',
//   })
//   c.status(StatusCodes.OK)
//   return c.json({
//     data: { apiKeys },
//   })
// })
