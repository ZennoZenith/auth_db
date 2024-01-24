import CustomError from './custom-error'
import { ApiExtraError } from './ErrorCodes'
// import { ErrorLogger } from '@util/logger.util'

export default class UnDocumented extends CustomError {
  constructor(
    err: any,
    extra: ApiExtraError = { message: '' },
  ) {
    super('UnDocumentedError', extra)
    // ErrorLogger(err)
    console.error(err)
  }
}
