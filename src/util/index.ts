import defaultConf from '@config/defaultConfig'
export function setOrigin() {
  let origin: string[] | string = []
  const envOrigin = defaultConf.cors
  if (envOrigin) {
    if (envOrigin === '*') {
      origin = '*'
    } else {
      origin.push(...envOrigin.split(','))
    }
  }
  return origin
}

export function validateEnv(): boolean {
  return true
}
