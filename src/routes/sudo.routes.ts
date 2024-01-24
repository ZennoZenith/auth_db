import * as sudoDatabase from '@database/sudo.database'
import { createAppValidator } from '@validators/sudo.validator'
import { validator } from 'hono/validator'
import { Hono } from 'hono'
import { StatusCodes } from 'http-status-codes'
import { updateAppValidator } from '@validators/sudo.validator'

const app = new Hono()

app.post(
  '/apps',
  validator('json', (value) => createAppValidator(value)),
  async (c) => {
    const { id, name, emailVerificationTokenLifetimeInMs } = c.req.valid('json')

    const data = await sudoDatabase.createApp({
      id,
      name,
      emailVerificationTokenLifetimeInMs,
    })

    c.status(StatusCodes.OK)
    return c.json({ data })
  },
)

app.get(
  '/apps',
  async (c) => {
    const data = await sudoDatabase.getAllApps()

    c.status(StatusCodes.OK)
    return c.json({ data })
  },
)

app.patch(
  '/apps',
  validator('json', (value) => updateAppValidator(value)),
  async (c) => {
    const { comparisonData, updateData } = c.req.valid('json')

    const data = await sudoDatabase.updateApp(comparisonData, updateData)

    c.status(StatusCodes.OK)
    return c.json({ data })
  },
)

export default app
