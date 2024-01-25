import { CustomError, MysqlError } from '@errors/index'
import { drizzleUserDb } from '@util/databaseConnection.util'
import { apps } from '@database/schema/users/schema'
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

export async function getAllApps() {
  try {
    const app = await drizzleUserDb.query.apps.findMany()
    return app!
  } catch (err: any) {
    throw new MysqlError(err.errno, { message: err.message })
  }
}

export async function updateApp(
  comparisonData: {
    id: string
  },
  updateData: Partial<typeof apps.$inferInsert>,
) {
  try {
    await drizzleUserDb.update(apps).set(updateData).where(
      eq(apps.id, comparisonData.id),
    )
    const app = await drizzleUserDb.query.apps.findFirst({
      where: eq(apps.id, updateData.id || comparisonData.id),
    })

    if (!app) {
      throw new CustomError('UnableToUpdate')
    }
    return app
  } catch (err: any) {
    if (err instanceof CustomError) {
      throw err
    }
    throw new MysqlError(err.errno, { message: err.message })
  }
}

export async function deleteApp(
  comparisonData: {
    id: string
  },
) {
  try {
    const app = await drizzleUserDb.query.apps.findFirst({
      where: eq(apps.id, comparisonData.id),
    })

    if (!app) {
      throw new CustomError('UnableToDelete')
    }

    await drizzleUserDb.delete(apps).where(
      eq(apps.id, comparisonData.id),
    )
    return app
  } catch (err: any) {
    if (err instanceof CustomError) {
      throw err
    }
    throw new MysqlError(err.errno, { message: err.message })
  }
}
