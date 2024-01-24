import { Hono } from 'hono'
import defaultConf from '@config/defaultConfig'

import security from '@middlewares/security.middleware'
import { validateEnv } from '@util/index'
import authRoute from '@routes/auth.routes'
import { ErrorHandler } from '@middlewares/error-handler.middleware'
import { ApiErrorObject } from '@errors/ErrorCodes'

const app = new Hono<{
  Variables: {
    ERROR: ApiErrorObject
  }
}>()

if (!validateEnv()) {
  throw new Error('Invalid environment variables')
}

app.route('*', security)
app.route('/', authRoute)
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
ErrorHandler(app)

export default {
  port: defaultConf.port,
  fetch: app.fetch,
}
