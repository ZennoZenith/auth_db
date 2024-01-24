-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `api_keys` (
	`tenantId` varchar(64) NOT NULL,
	`prefix` char(8) NOT NULL,
	`hashedApiKey` varchar(128) NOT NULL,
	`reqPerMin` smallint unsigned NOT NULL DEFAULT 10,
	`reqPerMonth` int unsigned NOT NULL DEFAULT 1000,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `api_keys_hashedApiKey` PRIMARY KEY(`hashedApiKey`),
	CONSTRAINT `tenantid_prefix_UNIQUE` UNIQUE(`tenantId`,`prefix`)
);
--> statement-breakpoint
CREATE TABLE `apps` (
	`id` varchar(64) NOT NULL DEFAULT 'DEFAULT',
	`name` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apps_id` PRIMARY KEY(`id`),
	CONSTRAINT `name` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `email_password_users` (
	`userId` varchar(64) NOT NULL,
	`email` varchar(256),
	`hashedEmail` varchar(256) NOT NULL,
	`hashedPassword` varchar(256) NOT NULL,
	`varified` tinyint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `email_password_users_userId` PRIMARY KEY(`userId`),
	CONSTRAINT `user_email_unique` UNIQUE(`hashedEmail`)
);
--> statement-breakpoint
CREATE TABLE `emailpassword_pswd_reset_tokens` (
	`userId` varchar(64) NOT NULL,
	`token` varchar(128) NOT NULL,
	`tokenExpiry` timestamp NOT NULL,
	`email` varchar(256) NOT NULL,
	CONSTRAINT `emailpassword_pswd_reset_tokens_userId` PRIMARY KEY(`userId`),
	CONSTRAINT `pswd_reset_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `emailverification_tokens` (
	`stagingUserId` varchar(64) NOT NULL,
	`email` varchar(256) NOT NULL,
	`token` varchar(128) NOT NULL,
	`tokenExpiry` timestamp NOT NULL,
	CONSTRAINT `emailverification_tokens_stagingUserId` PRIMARY KEY(`stagingUserId`),
	CONSTRAINT `email_varification_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `rate_limiter_table` (
	`uniqueKey` varchar(256) NOT NULL,
	`duration` enum('minute','hour','month') NOT NULL,
	`remainingPoints` int unsigned NOT NULL DEFAULT 0,
	`expireTime` bigint NOT NULL DEFAULT 0,
	CONSTRAINT `rate_limiter_table_uniqueKey_duration` PRIMARY KEY(`uniqueKey`,`duration`)
);
--> statement-breakpoint
CREATE TABLE `request_log` (
	`tenantId` varchar(64) NOT NULL,
	`prefix` char(8) NOT NULL,
	`status` smallint unsigned NOT NULL DEFAULT 0,
	`requestedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`appId` varchar(64) NOT NULL DEFAULT 'DEFAULT',
	`role` varchar(256) NOT NULL,
	`permission` varchar(256) NOT NULL,
	CONSTRAINT `role_permissions_appId_role_permission` PRIMARY KEY(`appId`,`role`,`permission`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`appId` varchar(64) NOT NULL DEFAULT 'DEFAULT',
	`role` varchar(256) NOT NULL,
	CONSTRAINT `roles_appId_role` PRIMARY KEY(`appId`,`role`)
);
--> statement-breakpoint
CREATE TABLE `tenant_api_info` (
	`tenantId` varchar(64) NOT NULL,
	`pointsUsed` int unsigned NOT NULL DEFAULT 0,
	`totalPoints` int unsigned NOT NULL DEFAULT 10000,
	`limitApiKeys` tinyint NOT NULL DEFAULT 2,
	`lastApiKeyGenerateTime` bigint unsigned NOT NULL DEFAULT 1016476200,
	CONSTRAINT `tenant_api_info_tenantId` PRIMARY KEY(`tenantId`)
);
--> statement-breakpoint
CREATE TABLE `tenant_last_active` (
	`tenantId` varchar(64) NOT NULL,
	`lastActiveIp` varchar(64) NOT NULL DEFAULT 'DEFAULT_IP',
	`lastActiveTime` timestamp NOT NULL,
	CONSTRAINT `tenant_last_active_tenantId` PRIMARY KEY(`tenantId`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`appId` varchar(64) NOT NULL,
	`role` varchar(256) NOT NULL,
	`useDefaultAuth` tinyint NOT NULL DEFAULT 1,
	`config` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_tenants` UNIQUE(`appId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `user_api_log` (
	`ip` varchar(46) NOT NULL,
	`tenantId` varchar(64) NOT NULL,
	`prefix` char(8) NOT NULL,
	`reqPerMin` smallint unsigned,
	`reqPerMonth` int unsigned,
	`performedAction` enum('CREATED','UPDATED','REGENERATED','DELETED') NOT NULL,
	`performedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);
--> statement-breakpoint
CREATE TABLE `user_last_active` (
	`userId` varchar(64) NOT NULL,
	`lastActiveIp` varchar(64) NOT NULL DEFAULT 'DEFAULT_IP',
	`lastActiveTime` timestamp NOT NULL,
	CONSTRAINT `user_last_active_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `username_password_tenants` (
	`tenantId` varchar(64) NOT NULL,
	`appId` varchar(64) NOT NULL,
	`username` varchar(256),
	`hashedPassword` varchar(256) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `username_password_tenants_tenantId` PRIMARY KEY(`tenantId`),
	CONSTRAINT `username_appid_unique` UNIQUE(`username`,`appId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(64) NOT NULL,
	`firstName` varchar(64) NOT NULL,
	`middleName` varchar(64),
	`lastName` varchar(64),
	`fullName` varchar(192),
	`phoneNumber` varchar(20),
	`birthday` date,
	`emailPasswordEnabled` tinyint NOT NULL DEFAULT 0,
	`passwordlessEnabled` tinyint NOT NULL DEFAULT 0,
	`thirdPartyEnabled` tinyint NOT NULL DEFAULT 0,
	`userMetadata` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_staging_email` (
	`id` varchar(64) NOT NULL,
	`email` varchar(256) NOT NULL,
	`appId` varchar(64) NOT NULL,
	`role` varchar(256) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_staging_email_email` PRIMARY KEY(`email`),
	CONSTRAINT `id` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE INDEX `stagingUserId` ON `emailverification_tokens` (`stagingUserId`,`email`);--> statement-breakpoint
CREATE INDEX `tenantId` ON `request_log` (`tenantId`);--> statement-breakpoint
CREATE INDEX `role_permissions_index` ON `role_permissions` (`role`,`permission`);--> statement-breakpoint
CREATE INDEX `appId` ON `tenants` (`appId`,`role`);--> statement-breakpoint
CREATE INDEX `userId` ON `tenants` (`userId`);--> statement-breakpoint
CREATE INDEX `tenantId` ON `user_api_log` (`tenantId`);--> statement-breakpoint
CREATE INDEX `appId` ON `username_password_tenants` (`appId`);--> statement-breakpoint
ALTER TABLE `api_keys` ADD CONSTRAINT `api_keys_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `email_password_users` ADD CONSTRAINT `email_password_users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `emailpassword_pswd_reset_tokens` ADD CONSTRAINT `emailpassword_pswd_reset_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `emailverification_tokens` ADD CONSTRAINT `emailverification_tokens_ibfk_1` FOREIGN KEY (`stagingUserId`,`email`) REFERENCES `users_staging_email`(`id`,`email`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `request_log` ADD CONSTRAINT `request_log_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`appId`,`role`) REFERENCES `roles`(`appId`,`role`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roles` ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenant_api_info` ADD CONSTRAINT `tenant_api_info_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `tenant_last_active` ADD CONSTRAINT `tenant_last_active_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `tenants` ADD CONSTRAINT `tenants_ibfk_1` FOREIGN KEY (`appId`,`role`) REFERENCES `roles`(`appId`,`role`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenants` ADD CONSTRAINT `tenants_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `user_api_log` ADD CONSTRAINT `user_api_log_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_last_active` ADD CONSTRAINT `user_last_active_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `username_password_tenants` ADD CONSTRAINT `username_password_tenants_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `username_password_tenants` ADD CONSTRAINT `username_password_tenants_ibfk_2` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE cascade ON UPDATE cascade;
*/