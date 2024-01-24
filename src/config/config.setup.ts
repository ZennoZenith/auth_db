import { load } from 'js-toml'
import fs from 'fs'

type Config = {
  core_config_version: number
  port: number
  host: string
  cors: string
  emailVerificationTokenLifetime: number
  dashboardUserIdPrefix: string
}

const defaultConfig = load(
  fs.readFileSync('./defaults/config.toml', 'utf-8'),
) as Config

const customConfig = load(
  fs.readFileSync('./defaults/config.toml', 'utf-8'),
) as Partial<Config>

console.log(defaultConfig)

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
