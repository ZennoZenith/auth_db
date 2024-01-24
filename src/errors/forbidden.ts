import CustomError from './custom-api'
import { ApiErrorType, ApiExtraError } from './ErrorCodes'

export default class Forbidden extends CustomError {
  constructor(
    extra: ApiExtraError = { message: 'USER NOT AN ADMIN' },
    errorCodes: ApiErrorType = 'Forbidden',
  ) {
    super(errorCodes, extra)
  }
}
