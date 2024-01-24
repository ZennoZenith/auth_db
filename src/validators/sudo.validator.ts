import {
  maxLength,
  minLength,
  minValue,
  number,
  object,
  optional,
  safeParse,
  string,
  toTrimmed,
} from 'valibot'
import { config } from '@config/config.setup'
import { BadRequestError } from '@errors'

export const createAppValidator = (value: any) => {
  const result = safeParse(
    object({
      id: string('App id must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter app id'),
        maxLength(64, 'App id string length should be less than 64'),
      ]),
      name: string('App name must be a string', [
        toTrimmed(),
        minLength(1, 'Please enter app name'),
        maxLength(64, 'App name string length should be less than 64'),
      ]),
      emailVerificationTokenLifetimeInMs: optional(
        number(
          'Lifetime must be a number',
          [
            minValue(60000, 'Lifetime must be greater than 60000ms'),
          ],
        ),
        config.emailVerificationTokenLifetime,
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

export const updateAppValidator = (value: any) => {
  const result = safeParse(
    object({
      comparisonData: object(
        {
          id: string('App id must be a string', [
            toTrimmed(),
            minLength(1, 'Please enter app id'),
            maxLength(64, 'App id string length should be less than 64'),
          ]),
        },
      ),
      updateData: object(
        {
          id: optional(string('App id must be a string', [
            toTrimmed(),
            minLength(1, 'Please enter app id'),
            maxLength(64, 'App id string length should be less than 64'),
          ])),
          name: optional(string('App name must be a string', [
            toTrimmed(),
            minLength(1, 'Please enter app name'),
            maxLength(64, 'App name string length should be less than 64'),
          ])),
          emailVerificationTokenLifetimeInMs: optional(
            number(
              'Lifetime must be a number',
              [
                minValue(60000, 'Lifetime must be greater than 60000ms'),
              ],
            ),
          ),
        },
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
