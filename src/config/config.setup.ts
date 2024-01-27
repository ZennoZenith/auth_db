import { load } from 'js-toml'
import fs from 'fs'

type Config = {
  core_config_version: number
  port: number
  host: string
  cors: string
  emailVerificationTokenLifetime: number
  dashboardUserIdPrefix: string
  basePath: string
}

function loadCustomConfig() {
  // process.argv.findIndex((val, index) => {
  //   console.log(val)
  // })
  const index = process.argv.findIndex((val) => {
    if (val === '--config') {
      return true
    }
  })

  if (index === -1) {
    return {}
  }

  if (process.argv[index + 1] == undefined) {
    console.error('Config file path not provided')
    return {}
  }

  const configFilePath = process.argv[index + 1]

  let config: string
  try {
    config = fs.readFileSync(configFilePath, 'utf-8')
  } catch (err) {
    console.error('Unable to read config file.')
    return {}
  }

  try {
    return load(config) as Partial<Config>
  } catch (err) {
    console.error('config toml badly formated')
  }
}

const defaultConfig = load(
  fs.readFileSync('./defaults/config.toml', 'utf-8'),
) as Config

const customConfig = loadCustomConfig()

console.log('Default config:')
console.log(defaultConfig)
console.log('Custom config:')
console.log(customConfig)

// TODO: config validation
/*
import * as v from 'valibot';

const ObjectSchema = v.object(
  {
    key1: v.string(),
    key2: v.number(),
  },
  v.never()
);

*/
export const config = {
  ...defaultConfig,
  ...customConfig,
} as const satisfies Config
