import CustomError from './custom-error'
import { ApiExtraError } from './ErrorCodes'

export default class DontCareError extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
  ) {
    super('DontCare', extra)
  }
}
