declare module 'bun' {
  interface Env {
    NODE_ENV?: string
    PORT: string
    BASE_PATH: string
    EMAIL_SALT: string
    LOG_DIR: string
    LOG_PREFIX: string
    ERROR_LOG_PREFIX: string
    API_ORIGIN: string
    FRONTEND_ORIGIN: string
    RAILWAY_DATABASE_URL: string
    USER_DATABASE_URL: string
    DEFAULT_RESULT_LIMIT: string
    MAX_RESULT_LIMIT: string
    JWT_SECRET: string
  }
}
