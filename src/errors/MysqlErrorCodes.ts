export type MysqlErrorType = {
  readonly errorNumber: number
  readonly symbol: string
  readonly sqlState: string
  readonly message: string
  readonly description: string
}

export const MysqlErrors = [
  {
    errorNumber: 1062,
    symbol: 'ER_DUP_ENTRY',
    sqlState: '23000',
    message: "Duplicate entry '%s' for key %d",
    description:
      'The message returned with this error uses the format string for ER_DUP_ENTRY_WITH_KEY_NAME.',
  },
  // TODO
  {
    errorNumber: 1364,
    symbol: 'ER_NO_DEFAULT_FOR_FIELD',
    sqlState: '23000',
    message: '',
    description: '',
  },
] as const satisfies MysqlErrorType[]

export type MysqlErrorNumber = typeof MysqlErrors[number]['errorNumber']
export type MysqlErrorSymbol = typeof MysqlErrors[number]['symbol']

const MysqlErrorNumberMap = new Map<number, MysqlErrorType>()
const MysqlErrorSymbolMap = new Map<string, MysqlErrorType>()

for (let errObj of MysqlErrors) {
  MysqlErrorNumberMap.set(errObj.errorNumber, errObj)
  MysqlErrorSymbolMap.set(errObj.symbol, errObj)
}

export function IsMysqlErrorFromNumber(errorNumber: number) {
  return MysqlErrorNumberMap.get(errorNumber) ? true : false
}

export function IsMysqlErrorFromSymbol(symbol: string) {
  return MysqlErrorSymbolMap.get(symbol) ? true : false
}

export function GetMysqlError(a: MysqlErrorNumber): MysqlErrorType
export function GetMysqlError(a: MysqlErrorSymbol): MysqlErrorType
export function GetMysqlError(a: any): MysqlErrorType {
  if (typeof a === 'number') {
    return MysqlErrorNumberMap.get(a as MysqlErrorNumber)!
  } else {
    return MysqlErrorSymbolMap.get(a as MysqlErrorSymbol)!
  }
}
