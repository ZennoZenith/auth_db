import { setOrigin } from '@util/index'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { csrf } from 'hono/csrf'

const app = new Hono()

app.use('*', cors({ origin: setOrigin() }))
app.use('*', csrf({ origin: setOrigin() }))
app.use('*', secureHeaders())

export default app
