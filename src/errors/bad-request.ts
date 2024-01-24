import CustomError from './custom-api'
import { ApiErrorType, ApiExtraError } from './ErrorCodes'

export default class BadRequestError extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
    errorCodes: ApiErrorType = 'BadRequest',
  ) {
    super(errorCodes, extra)
  }
}
