import CustomError from './custom-error'
import { ApiExtraError } from './ErrorCodes'

export default class IAmATeapot extends CustomError {
  constructor(
    extra: ApiExtraError = { message: '' },
  ) {
    super('IAmATeapot', extra)
  }
}
