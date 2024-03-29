import {
  boolean,
  custom,
  email,
  maxLength,
  minLength,
  object,
  optional,
  record,
  safeParse,
  string,
  toTrimmed,
  transform,
  unknown,
} from 'valibot'
import { BadRequestError } from '@errors'
import { isValidBirthday } from '@util/index'

export const createUserValidator = (value: any) => {
  const result = safeParse(
    object({
      appId: string('App id must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter app id'),
        maxLength(64, 'App id string length should be less than 64'),
      ]),
      role: string('Role must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter role'),
        maxLength(256, 'Role string length should be less than 64'),
      ]),
      firstName: string('First name must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter first name'),
        maxLength(64, 'First name string length should be less than 64'),
      ]),
      middleName: optional(string('Middle name must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter middle name'),
        maxLength(64, 'Middle name string length should be less than 64'),
      ])),
      lastName: optional(string('Last name must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter last name'),
        maxLength(64, 'Last name string length should be less than 64'),
      ])),
      phoneNumber: optional(string('Phone number must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter number'),
        maxLength(20, 'Phone number string length should be less than 20'),
      ])),
      birthday: optional(string('Birthday must be a string', [
        toTrimmed(),
        custom(
          isValidBirthday,
          "Invalid birthday. Birthday format should be : 'YYYY-MM-DD', with it should not lie in future",
        ),
      ])),
      usernamePasswordEnabled: transform(
        optional(
          boolean('usernamePasswordEnabled should be a boolean'),
          false,
        ),
        (value) => value === true ? 1 : 0,
      ),
      emailPasswordEnabled: transform(
        optional(
          boolean('emailPasswordEnabled should be a boolean'),
          false,
        ),
        (value) => value === true ? 1 : 0,
      ),
      passwordlessEnabled: transform(
        optional(
          boolean('passwordlessEnabled should be a boolean'),
          false,
        ),
        (value) => value === true ? 1 : 0,
      ),
      thirdPartyEnabled: transform(
        optional(
          boolean('thirdPartyEnabled should be a boolean'),
          false,
        ),
        (value) => value === true ? 1 : 0,
      ),
      userMetadata: record(
        unknown(),
        'User meta data should be a JSON object',
      ),
      config: record(
        unknown(),
        'User config  should be a JSON object',
      ),
    }),
    value,
  )

  if (result.success) {
    return result.output
  } else {
    throw new BadRequestError({
      message: result.issues.map((issue) => issue.message),
    })
  }
}

export const createDashboardUserValidator = (value: any) => {
  const result = safeParse(
    object({
      appId: string('App id must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter app id'),
        maxLength(64, 'App id string length should be less than 64'),
      ]),
      username: string('Username must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter username'),
        maxLength(64, 'username string length should be less than 64'),
      ]),
      password: string('passowrd must be a string', [
        toTrimmed(),
        minLength(9, 'Password length should be grater than 8'),
      ]),
    }),
    value,
  )

  if (result.success) {
    return result.output
  } else {
    throw new BadRequestError({
      message: result.issues.map((issue) => issue.message),
    })
  }
}

export const signupValidator = (value: any) => {
  const result = safeParse(
    object({
      email: string('Your email must be a string.', [
        toTrimmed(),
        minLength(1, 'Please enter your email.'),
        email('The email address is badly formatted.'),
      ]),
    }),
    value,
  )

  if (result.success) {
    return {
      email: result.output.email,
    }
  } else {
    throw new BadRequestError({
      message: result.issues.map((issue) => issue.message),
    })
  }
}
