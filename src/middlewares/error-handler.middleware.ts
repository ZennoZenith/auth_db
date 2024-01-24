import { ApiErrorObject, GetApiErrorObject } from '@errors/ErrorCodes'
import CustomAPIError from '@errors/custom-api'
// import { ErrorLogger } from '@util/logger.util'
import { Hono } from 'hono'

export function ErrorHandler(
  app: Hono<{
    Variables: {
      ERROR: ApiErrorObject
    }
  }>,
) {
  app.notFound((c) => {
    let errorObj: ApiErrorObject = GetApiErrorObject('RouteNotExist')

    c.set('ERROR', errorObj)
    c.status(errorObj.httpCode)
    errorObj.extra ??= { message: '' }
    errorObj.extra.method ??= c.req.method
    errorObj.extra.path ??= c.req.path
    return c.json({ error: errorObj })
  })

  app.onError((err, c) => {
    let errorObj: ApiErrorObject = GetApiErrorObject('UnDocumentedError')
    if (err instanceof CustomAPIError) {
      // console.error(err)
      errorObj = err.errorObj
    } else {
      errorObj.extra = {
        message: 'Catastrophic error occured.',
      }

      if (err?.message?.toString().includes('JSON Parse error')) {
        errorObj = GetApiErrorObject('BadRequest')
        errorObj.extra = {
          message: 'JSON Parse error',
        }
      } else {
        // ErrorLogger(err, { logFullError: true })
        console.log(err)
      }
    }
    c.set('ERROR', errorObj)
    c.status(errorObj.httpCode)
    errorObj.extra ??= { message: '' }
    errorObj.extra.method ??= c.req.method
    errorObj.extra.path ??= c.req.path
    return c.json({ error: errorObj })
  })
}
