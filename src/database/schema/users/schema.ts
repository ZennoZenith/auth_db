import {
  bigint,
  char,
  date,
  foreignKey,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  smallint,
  timestamp,
  tinyint,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

export const apiKeys = mysqlTable('api_keys', {
  tenantId: varchar('tenantId', { length: 64 }).notNull().references(
    () => tenants.id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ),
  prefix: char('prefix', { length: 8 }).notNull(),
  hashedApiKey: varchar('hashedApiKey', { length: 128 }).notNull(),
  reqPerMin: smallint('reqPerMin', { unsigned: true }).default(10).notNull(),
  reqPerMonth: int('reqPerMonth', { unsigned: true }).default(1000).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).onUpdateNow().notNull(),
}, (table) => {
  return {
    apiKeysHashedApiKey: primaryKey({
      columns: [table.hashedApiKey],
      name: 'api_keys_hashedApiKey',
    }),
    tenantidPrefixUnique: unique('tenantid_prefix_UNIQUE').on(
      table.tenantId,
      table.prefix,
    ),
  }
})

export const apps = mysqlTable('apps', {
  id: varchar('id', { length: 64 }).default('DEFAULT').notNull(),
  name: varchar('name', { length: 64 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).onUpdateNow().notNull(),
}, (table) => {
  return {
    appsId: primaryKey({ columns: [table.id], name: 'apps_id' }),
    name: unique('name').on(table.name),
  }
})

export const emailPasswordUsers = mysqlTable('email_password_users', {
  userId: varchar('userId', { length: 64 }).notNull().references(
    () => users.id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ),
  email: varchar('email', { length: 256 }),
  hashedEmail: varchar('hashedEmail', { length: 256 }).notNull(),
  hashedPassword: varchar('hashedPassword', { length: 256 }).notNull(),
  varified: tinyint('varified').default(0).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).notNull(),
}, (table) => {
  return {
    emailPasswordUsersUserId: primaryKey({
      columns: [table.userId],
      name: 'email_password_users_userId',
    }),
    userEmailUnique: unique('user_email_unique').on(table.hashedEmail),
  }
})

export const emailpasswordPswdResetTokens = mysqlTable(
  'emailpassword_pswd_reset_tokens',
  {
    userId: varchar('userId', { length: 64 }).notNull().references(
      () => users.id,
      { onDelete: 'cascade', onUpdate: 'cascade' },
    ),
    token: varchar('token', { length: 128 }).notNull(),
    tokenExpiry: timestamp('tokenExpiry', { mode: 'string' }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
  },
  (table) => {
    return {
      emailpasswordPswdResetTokensUserId: primaryKey({
        columns: [table.userId],
        name: 'emailpassword_pswd_reset_tokens_userId',
      }),
      pswdResetTokenUnique: unique('pswd_reset_token_unique').on(table.token),
    }
  },
)

export const emailverificationTokens = mysqlTable('emailverification_tokens', {
  stagingUserId: varchar('stagingUserId', { length: 64 }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  token: varchar('token', { length: 128 }).notNull(),
  tokenExpiry: timestamp('tokenExpiry', { mode: 'string' }).notNull(),
}, (table) => {
  return {
    stagingUserId: index('stagingUserId').on(table.stagingUserId, table.email),
    emailverificationTokensIbfk1: foreignKey({
      columns: [table.stagingUserId, table.email],
      foreignColumns: [usersStagingEmail.id, usersStagingEmail.email],
      name: 'emailverification_tokens_ibfk_1',
    }).onDelete('cascade'),
    emailverificationTokensStagingUserId: primaryKey({
      columns: [table.stagingUserId],
      name: 'emailverification_tokens_stagingUserId',
    }),
    emailVarificationTokenUnique: unique('email_varification_token_unique').on(
      table.token,
    ),
  }
})

export const rateLimiterTable = mysqlTable('rate_limiter_table', {
  uniqueKey: varchar('uniqueKey', { length: 256 }).notNull(),
  duration: mysqlEnum('duration', ['minute', 'hour', 'month']).notNull(),
  remainingPoints: int('remainingPoints', { unsigned: true }).default(0)
    .notNull(),
  expireTime: bigint('expireTime', { mode: 'number' }).notNull(),
}, (table) => {
  return {
    rateLimiterTableUniqueKeyDuration: primaryKey({
      columns: [table.uniqueKey, table.duration],
      name: 'rate_limiter_table_uniqueKey_duration',
    }),
  }
})

export const requestLog = mysqlTable('request_log', {
  tenantId: varchar('tenantId', { length: 64 }).notNull().references(() =>
    tenants.id
  ),
  prefix: char('prefix', { length: 8 }).notNull(),
  status: smallint('status', { unsigned: true }).notNull(),
  requestedAt: timestamp('requestedAt', { fsp: 3, mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP(3)`,
  ).notNull(),
}, (table) => {
  return {
    tenantId: index('tenantId').on(table.tenantId),
  }
})

export const rolePermissions = mysqlTable('role_permissions', {
  appId: varchar('appId', { length: 64 }).default('DEFAULT').notNull(),
  role: varchar('role', { length: 256 }).notNull(),
  permission: varchar('permission', { length: 256 }).notNull(),
}, (table) => {
  return {
    index: index('role_permissions_index').on(table.role, table.permission),
    rolePermissionsIbfk1: foreignKey({
      columns: [table.appId, table.role],
      foreignColumns: [roles.appId, roles.role],
      name: 'role_permissions_ibfk_1',
    }).onDelete('cascade'),
    rolePermissionsAppIdRolePermission: primaryKey({
      columns: [table.appId, table.role, table.permission],
      name: 'role_permissions_appId_role_permission',
    }),
  }
})

export const roles = mysqlTable('roles', {
  appId: varchar('appId', { length: 64 }).default('DEFAULT').notNull()
    .references(() => apps.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 256 }).notNull(),
}, (table) => {
  return {
    rolesAppIdRole: primaryKey({
      columns: [table.appId, table.role],
      name: 'roles_appId_role',
    }),
  }
})

export const tenantApiInfo = mysqlTable('tenant_api_info', {
  tenantId: varchar('tenantId', { length: 64 }).notNull().references(
    () => tenants.id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ),
  pointsUsed: int('pointsUsed', { unsigned: true }).default(0).notNull(),
  totalPoints: int('totalPoints', { unsigned: true }).default(10000).notNull(),
  limitApiKeys: tinyint('limitApiKeys').default(2).notNull(),
  lastApiKeyGenerateTime: bigint('lastApiKeyGenerateTime', {
    mode: 'number',
    unsigned: true,
  }).default(1016476200).notNull(),
}, (table) => {
  return {
    tenantApiInfoTenantId: primaryKey({
      columns: [table.tenantId],
      name: 'tenant_api_info_tenantId',
    }),
  }
})

export const tenantLastActive = mysqlTable('tenant_last_active', {
  tenantId: varchar('tenantId', { length: 64 }).notNull().references(
    () => tenants.id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ),
  lastActiveIp: varchar('lastActiveIp', { length: 64 }).default('DEFAULT_IP')
    .notNull(),
  lastActiveTime: timestamp('lastActiveTime', { mode: 'string' }).notNull(),
}, (table) => {
  return {
    tenantLastActiveTenantId: primaryKey({
      columns: [table.tenantId],
      name: 'tenant_last_active_tenantId',
    }),
  }
})

export const tenants = mysqlTable('tenants', {
  id: varchar('id', { length: 64 }).notNull(),
  userId: varchar('userId', { length: 64 }).notNull().references(
    () => users.id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ),
  appId: varchar('appId', { length: 64 }).notNull(),
  role: varchar('role', { length: 256 }).notNull(),
  useDefaultAuth: tinyint('useDefaultAuth').default(1).notNull(),
  config: json('config').notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).notNull(),
}, (table) => {
  return {
    appId: index('appId').on(table.appId, table.role),
    userId: index('userId').on(table.userId),
    tenantsIbfk1: foreignKey({
      columns: [table.appId, table.role],
      foreignColumns: [roles.appId, roles.role],
      name: 'tenants_ibfk_1',
    }).onDelete('cascade'),
    tenantsId: primaryKey({ columns: [table.id], name: 'tenants_id' }),
    uniqueTenants: unique('unique_tenants').on(table.appId, table.userId),
  }
})

export const userApiLog = mysqlTable('user_api_log', {
  ip: varchar('ip', { length: 46 }).notNull(),
  tenantId: varchar('tenantId', { length: 64 }).notNull().references(() =>
    tenants.id
  ),
  prefix: char('prefix', { length: 8 }).notNull(),
  reqPerMin: smallint('reqPerMin', { unsigned: true }),
  reqPerMonth: int('reqPerMonth', { unsigned: true }),
  performedAction: mysqlEnum('performedAction', [
    'CREATED',
    'UPDATED',
    'REGENERATED',
    'DELETED',
  ]).notNull(),
  performedAt: timestamp('performedAt', { fsp: 3, mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP(3)`,
  ).notNull(),
}, (table) => {
  return {
    tenantId: index('tenantId').on(table.tenantId),
  }
})

export const userLastActive = mysqlTable('user_last_active', {
  userId: varchar('userId', { length: 64 }).notNull().references(
    () => users.id,
    { onDelete: 'cascade' },
  ),
  lastActiveIp: varchar('lastActiveIp', { length: 64 }).default('DEFAULT_IP')
    .notNull(),
  lastActiveTime: timestamp('lastActiveTime', { mode: 'string' }).notNull(),
}, (table) => {
  return {
    userLastActiveUserId: primaryKey({
      columns: [table.userId],
      name: 'user_last_active_userId',
    }),
  }
})

export const usernamePasswordTenants = mysqlTable('username_password_tenants', {
  tenantId: varchar('tenantId', { length: 64 }).notNull().references(
    () => tenants.id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ),
  appId: varchar('appId', { length: 64 }).notNull().references(() => apps.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  username: varchar('username', { length: 256 }),
  hashedPassword: varchar('hashedPassword', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).notNull(),
}, (table) => {
  return {
    appId: index('appId').on(table.appId),
    usernamePasswordTenantsTenantId: primaryKey({
      columns: [table.tenantId],
      name: 'username_password_tenants_tenantId',
    }),
    usernameAppidUnique: unique('username_appid_unique').on(
      table.username,
      table.appId,
    ),
  }
})

export const users = mysqlTable('users', {
  id: varchar('id', { length: 64 }).notNull(),
  firstName: varchar('firstName', { length: 64 }).notNull(),
  middleName: varchar('middleName', { length: 64 }),
  lastName: varchar('lastName', { length: 64 }),
  fullName: varchar('fullName', { length: 192 }),
  phoneNumber: varchar('phoneNumber', { length: 20 }),
  // you can use { mode: 'date' }, if you want to have Date as type for this column
  birthday: date('birthday', { mode: 'string' }),
  emailPasswordEnabled: tinyint('emailPasswordEnabled').default(0).notNull(),
  passwordlessEnabled: tinyint('passwordlessEnabled').default(0).notNull(),
  thirdPartyEnabled: tinyint('thirdPartyEnabled').default(0).notNull(),
  userMetadata: json('userMetadata').notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).onUpdateNow().notNull(),
}, (table) => {
  return {
    usersId: primaryKey({ columns: [table.id], name: 'users_id' }),
  }
})

export const usersStagingEmail = mysqlTable('users_staging_email', {
  id: varchar('id', { length: 64 }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  appId: varchar('appId', { length: 64 }).notNull(),
  role: varchar('role', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ).notNull(),
}, (table) => {
  return {
    usersStagingEmailEmail: primaryKey({
      columns: [table.email],
      name: 'users_staging_email_email',
    }),
    id: unique('id').on(table.id),
  }
})
