import CustomError from './custom-api'
import { ApiErrorType, ApiExtraError } from './ErrorCodes'

export default class NotFoundError extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
    errorCodes: ApiErrorType = 'NotFound',
  ) {
    super(errorCodes, extra)
  }
}
