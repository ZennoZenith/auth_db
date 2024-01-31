import { BadRequestError, ConflictError, DontCareError } from '@errors/index'
import { ApiExtraError } from './ErrorCodes'
import {
  GetMysqlError,
  IsMysqlErrorFromNumber,
  IsMysqlErrorFromSymbol,
  MysqlErrorNumber,
} from './MysqlErrorCodes'

import CustomError from './custom-error'

export default class MysqlError extends CustomError {
  static IsMysqlError(e: any): boolean {
    if (typeof e.errno === 'number') {
      return IsMysqlErrorFromNumber(e.errno)
    }
    if (typeof e.code === 'string') {
      return IsMysqlErrorFromSymbol(e.code)
    }
    return false
  }

  constructor(e: any, extra: ApiExtraError = { message: '' }) {
    super('UnDocumentedError', { message: 'Unknow SQL error' })
    if (!MysqlError.IsMysqlError(e)) {
      console.log(e)
      return new DontCareError({ message: e.message })
      // return
    }

    const errorSymbol = GetMysqlError(e.errno as MysqlErrorNumber).symbol
    if (errorSymbol === 'ER_DUP_ENTRY') {
      return new ConflictError({ message: 'Duplicate entry' })
    }

    if (errorSymbol === 'ER_NO_DEFAULT_FOR_FIELD') {
      return new BadRequestError({ message: 'Some field are missing' })
    }
  }
}
