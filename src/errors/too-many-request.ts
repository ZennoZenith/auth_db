import CustomError from './custom-error'
import { ApiExtraError } from './ErrorCodes'

class TooManyRequest extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
  ) {
    super('TooManyReqeust', extra)
  }
}

export default TooManyRequest
