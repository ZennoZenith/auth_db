import { StatusCodes } from 'http-status-codes'
import {
  ApiErrorObject,
  ApiErrorType,
  ApiExtraError,
  GetApiErrorObject,
} from './ErrorCodes'

export default class CustomError extends Error {
  statusCode: StatusCodes
  errorObj: ApiErrorObject
  constructor(
    errorCodes: ApiErrorType = 'UnDocumentedError',
    extra: ApiExtraError = { message: '' },
    statusCode?: StatusCodes,
  ) {
    super(extra.message.toString())
    this.errorObj = GetApiErrorObject(errorCodes)
    this.statusCode = this.errorObj.httpCode
    this.errorObj.extra = extra
    if (statusCode) {
      this.statusCode = statusCode
    }
  }
}
