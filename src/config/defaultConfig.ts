type Config = { port: number; host: string; cors: string }
export default {
  port: 6789,
  host: 'localhost',
  cors: '*' as stirng,
} as const satisfies Config
