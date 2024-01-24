import { ConflictError } from '@errors/index'
import { ApiExtraError } from './ErrorCodes'
import {
  GetMysqlError,
  IsMysqlErrorFromNumber,
  IsMysqlErrorFromSymbol,
  MysqlErrorNumber,
} from './MysqlErrorCodes'

import CustomError from './custom-api'

export default class MysqlError extends CustomError {
  static IsMysqlError(errorNumber: number): boolean
  static IsMysqlError(code: string): boolean
  static IsMysqlError(a: any): boolean {
    if (typeof a === 'number') {
      return IsMysqlErrorFromNumber(a)
    }
    if (typeof a === 'string') {
      return IsMysqlErrorFromSymbol(a)
    }
    return false
  }

  constructor(e: number, extra?: ApiExtraError)
  constructor(e: string, extra?: ApiExtraError)
  constructor(e: any, extra: ApiExtraError = { message: '' }) {
    super('DontCare')
    if (!MysqlError.IsMysqlError(e)) {
      return
    }
    if (GetMysqlError(e as MysqlErrorNumber).symbol === 'ER_DUP_ENTRY') {
      return new ConflictError({ message: 'Duplicate entry' })
    }
  }
}
