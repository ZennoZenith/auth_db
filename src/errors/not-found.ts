import CustomError from './custom-error'
import { ApiErrorType, ApiExtraError } from './ErrorCodes'

export default class NotFoundError extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
    errorCodes: ApiErrorType = 'NotFound',
  ) {
    super(errorCodes, extra)
  }
}
