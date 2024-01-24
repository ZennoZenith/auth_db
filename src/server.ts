import { Hono } from 'hono'
import { config } from '@config/config.setup'

import security from '@middlewares/security.middleware'
import { validateEnv } from '@util/index'
import sudoRoute from '@routes/sudo.routes'
import userRoute from '@routes/user.routes'
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
app.route('/', sudoRoute)
app.route('/', userRoute)
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
ErrorHandler(app)

export default {
  port: config.port,
  fetch: app.fetch,
}
