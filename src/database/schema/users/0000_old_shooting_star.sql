-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `apps` (
	`id` varchar(64) NOT NULL,
	`name` varchar(64) NOT NULL,
	`emailVerificationTokenLifetimeInMs` bigint NOT NULL DEFAULT 86400000,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apps_id` PRIMARY KEY(`id`),
	CONSTRAINT `name` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `dashboard_user_sessions` (
	`userId` varchar(64) NOT NULL,
	`sessionId` char(36) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`expiry` timestamp NOT NULL,
	CONSTRAINT `dashboard_user_sessions_userId_sessionId` PRIMARY KEY(`userId`,`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `dashboard_users` (
	`appId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`username` varchar(256) NOT NULL,
	`hashedPassword` varchar(256) NOT NULL,
	`failedAttempts` int unsigned NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `dashboard_users_appId_userId` PRIMARY KEY(`appId`,`userId`),
	CONSTRAINT `appId` UNIQUE(`appId`,`username`)
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
CREATE TABLE `role_permissions` (
	`appId` varchar(64) NOT NULL,
	`role` varchar(256) NOT NULL,
	`permission` varchar(256) NOT NULL,
	CONSTRAINT `role_permissions_appId_role_permission` PRIMARY KEY(`appId`,`role`,`permission`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`appId` varchar(64) NOT NULL,
	`role` varchar(256) NOT NULL,
	CONSTRAINT `roles_appId_role` PRIMARY KEY(`appId`,`role`)
);
--> statement-breakpoint
CREATE TABLE `user_last_active` (
	`userId` varchar(64) NOT NULL,
	`lastActiveIp` varchar(64) NOT NULL DEFAULT 'DEFAULT_IP',
	`lastActiveTime` timestamp NOT NULL,
	CONSTRAINT `user_last_active_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `username_password_users` (
	`userId` varchar(64) NOT NULL,
	`appId` varchar(64) NOT NULL,
	`username` varchar(256),
	`hashedPassword` varchar(256) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `username_password_users_userId_appId` PRIMARY KEY(`userId`,`appId`),
	CONSTRAINT `username_appid_unique` UNIQUE(`username`,`appId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(64) NOT NULL,
	`appId` varchar(64) NOT NULL,
	`role` varchar(256) NOT NULL,
	`firstName` varchar(64) NOT NULL,
	`middleName` varchar(64),
	`lastName` varchar(64),
	`fullName` varchar(192),
	`phoneNumber` varchar(20),
	`birthday` date,
	`usernamePasswordEnabled` tinyint NOT NULL DEFAULT 0,
	`emailPasswordEnabled` tinyint NOT NULL DEFAULT 0,
	`passwordlessEnabled` tinyint NOT NULL DEFAULT 0,
	`thirdPartyEnabled` tinyint NOT NULL DEFAULT 0,
	`userMetadata` json NOT NULL,
	`config` json NOT NULL,
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
CREATE INDEX `dashboard_user_sessions_expiry_index` ON `dashboard_user_sessions` (`expiry`);--> statement-breakpoint
CREATE INDEX `userId` ON `dashboard_users` (`userId`);--> statement-breakpoint
CREATE INDEX `stagingUserId` ON `emailverification_tokens` (`stagingUserId`,`email`);--> statement-breakpoint
CREATE INDEX `role_permissions_index` ON `role_permissions` (`role`,`permission`);--> statement-breakpoint
CREATE INDEX `appId` ON `username_password_users` (`appId`,`userId`);--> statement-breakpoint
CREATE INDEX `appId` ON `users` (`appId`);--> statement-breakpoint
ALTER TABLE `dashboard_user_sessions` ADD CONSTRAINT `dashboard_user_sessions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `dashboard_users`(`userId`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dashboard_users` ADD CONSTRAINT `dashboard_users_ibfk_1` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dashboard_users` ADD CONSTRAINT `dashboard_users_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `email_password_users` ADD CONSTRAINT `email_password_users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `emailpassword_pswd_reset_tokens` ADD CONSTRAINT `emailpassword_pswd_reset_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `emailverification_tokens` ADD CONSTRAINT `emailverification_tokens_ibfk_1` FOREIGN KEY (`stagingUserId`,`email`) REFERENCES `users_staging_email`(`id`,`email`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`appId`,`role`) REFERENCES `roles`(`appId`,`role`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roles` ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_last_active` ADD CONSTRAINT `user_last_active_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `username_password_users` ADD CONSTRAINT `username_password_users_ibfk_1` FOREIGN KEY (`appId`,`userId`) REFERENCES `users`(`appId`,`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`appId`) REFERENCES `apps`(`id`) ON DELETE cascade ON UPDATE cascade;
*/