import CustomError from './custom-error'
import { ApiErrorType, ApiExtraError } from './ErrorCodes'

export default class UnauthenticatedError extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
    errorCodes: ApiErrorType = 'Unauthorized',
  ) {
    super(errorCodes, extra)
  }
}
