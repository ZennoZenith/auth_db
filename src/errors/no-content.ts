import CustomError from './custom-api'
import { ApiErrorType, ApiExtraError } from './ErrorCodes'

export default class NoContent extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
    errorCodes: ApiErrorType = 'NoContent',
  ) {
    super(errorCodes, extra)
  }
}
