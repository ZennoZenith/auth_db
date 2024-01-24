import CustomError from './custom-error'
import { ApiErrorType, ApiExtraError } from './ErrorCodes'

export default class ConflictError extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
    errorCodes: ApiErrorType = 'Conflict',
  ) {
    super(errorCodes, extra)
  }
}
