import CustomError from './custom-error'
import { ApiErrorType, ApiExtraError } from './ErrorCodes'

export default class BadRequestError extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
    errorCodes: ApiErrorType = 'BadRequest',
  ) {
    super(errorCodes, extra)
  }
}
