import CustomError from './custom-error'
import { ApiExtraError } from './ErrorCodes'

export default class InternalServerError extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
  ) {
    super('InternalServerError', extra)
  }
}
