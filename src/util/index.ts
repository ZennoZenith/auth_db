import { config } from '@config/config.setup'

export function setOrigin() {
  let origin: string[] | string = []
  const envOrigin = config.cors
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

export function isValidBirthday(dateString: string) {
  // Check if the input is a valid date
  const birthday = new Date(dateString)
  if (isNaN(birthday.getTime())) {
    return false // Invalid date
  }

  // Check if the date is not in the future
  const currentDate = new Date()
  if (birthday > currentDate) {
    return false // Future date
  }

  // // Check if the person is at least 18 years old
  // const minimumAge = 18
  // const requiredBirthYear = currentDate.getFullYear() - minimumAge
  // const minimumBirthDate = new Date(
  //   requiredBirthYear,
  //   currentDate.getMonth(),
  //   currentDate.getDate(),
  // )

  // if (birthday > minimumBirthDate) {
  //   return false // Under 18
  // }

  return true
}
