CREATE DATABASE IF NOT EXISTS `AUTH_DB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `AUTH_DB`;

CREATE TABLE `apps` (
    `id` varchar(64),
    `name` varchar(64) NOT NULL,
    `emailVerificationTokenLifetimeInMs` bigint NOT NULL DEFAULT 86400000,
    `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`name`)
);

CREATE TABLE `users` (
    `id` varchar(64),
    `firstName` varchar(64) NOT NULL,
    `middleName` varchar(64) DEFAULT NULL,
    `lastName` varchar(64) DEFAULT NULL,
    `fullName` varchar(192) GENERATED ALWAYS AS (CONCAT_WS(' ',firstName, middleName, lastName)),
    `phoneNumber` varchar(20) DEFAULT NULL,
    `birthday` DATE DEFAULT NULL,
    `emailPasswordEnabled` tinyint NOT NULL DEFAULT 0,
    `passwordlessEnabled` tinyint NOT NULL DEFAULT 0,
    `thirdPartyEnabled` tinyint NOT NULL DEFAULT 0,
    `userMetadata` JSON NOT NULL,
    `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `user_last_active` (
    `userId` varchar(64) NOT NULL,
    `lastActiveIp` varchar(64) NOT NULL DEFAULT 'DEFAULT_IP',
    `lastActiveTime` timestamp NOT NULL,
    PRIMARY KEY (`userId`),
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `dashboard_users` (
    `appId` varchar(64) NOT NULL,
    `userId` varchar(64) NOT NULL,
    `username` varchar(256) NOT NULL,
    `hashedPassword` varchar(256) NOT NULL,
    `failedAttempts` int unsigned NOT NULL DEFAULT 0,
    `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`appId`,`userId`),
    UNIQUE KEY (`appId`,`username`),
    FOREIGN KEY (`appId`) REFERENCES `apps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `dashboard_user_sessions` (
    `userId` varchar(64) NOT NULL,
    `sessionId` char(36) NOT NULL,
    `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `expiry` timestamp NOT NULL,
    PRIMARY KEY (`userId`,`sessionId`),
    FOREIGN KEY (`userId`) REFERENCES `dashboard_users` (`userId`) ON DELETE CASCADE
);
CREATE INDEX `dashboard_user_sessions_expiry_index` ON `dashboard_user_sessions` (`expiry`);


CREATE TABLE `email_password_users` (
    `userId` varchar(64) NOT NULL,
    `email` varchar(256) DEFAULT NULL,
    `hashedEmail` varchar(256) NOT NULL, 
    `hashedPassword` varchar(256) NOT NULL,
    `varified` tinyint NOT NULL DEFAULT 0,
    `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`userId`),
    UNIQUE KEY `user_email_unique` (`hashedEmail`),
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `users_staging_email` (
    `id` varchar(64) NOT NULL,
    `email` varchar(256) NOT NULL,
    `appId` varchar(64) NOT NULL,
    `role` varchar(256) NOT NULL,
    `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`email`),
    UNIQUE KEY (`id`)
);

CREATE TABLE `emailverification_tokens` (
    `stagingUserId` varchar(64) NOT NULL,
    `email` varchar(256) NOT NULL,
    `token` varchar(128) NOT NULL,
    `tokenExpiry` timestamp NOT NULL,
    PRIMARY KEY (`stagingUserId`),
    UNIQUE KEY `email_varification_token_unique` (`token`),
    FOREIGN KEY (`stagingUserId`, `email`) REFERENCES `users_staging_email` (`id`, `email`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `emailpassword_pswd_reset_tokens` (
    `userId` varchar(64) NOT NULL,
    `token` varchar(128) NOT NULL,
    `tokenExpiry` timestamp NOT NULL,
    `email` varchar(256) NOT NULL,
    PRIMARY KEY (`userId`),
    UNIQUE KEY `pswd_reset_token_unique` (`token`),
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `roles` (
    `appId` varchar(64) NOT NULL,
    `role` varchar(256) NOT NULL,
    PRIMARY KEY (`appId`, `role`),
    FOREIGN KEY (`appId`) REFERENCES `apps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `role_permissions` (
    `appId` varchar(64) NOT NULL,
    `role` varchar(256) NOT NULL,
    `permission` varchar(256) NOT NULL,
    PRIMARY KEY (`appId`, `role`, `permission`),
    FOREIGN KEY (`appId`, `role`) REFERENCES `roles` (`appId`, `role`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX `role_permissions_index` ON `role_permissions` (`role`, `permission`);

CREATE TABLE `tenants` (
    `id` varchar(64) NOT NULL,
    `userId` varchar(64) NOT NULL,
    `appId` varchar(64) NOT NULL,
    `role` varchar(256) NOT NULL,
    `useDefaultAuth` tinyint NOT NULL DEFAULT 1,
    `config` JSON NOT NULL,
    `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_tenants` (`appId`,`userId`),
    FOREIGN KEY (`appId`, `role`) REFERENCES `roles` (`appId`, `role`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `tenant_last_active` (
    `tenantId` varchar(64) NOT NULL,
    `lastActiveIp` varchar(64) NOT NULL DEFAULT 'DEFAULT_IP',
    `lastActiveTime` timestamp NOT NULL,
    PRIMARY KEY (`tenantId`),
    FOREIGN KEY (`tenantId`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `username_password_tenants` (
    `tenantId` varchar(64) NOT NULL,
    `appId` varchar(64) NOT NULL,
    `username` varchar(256) DEFAULT NULL,
    `hashedPassword` varchar(256) NOT NULL,
    `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`tenantId`),
    UNIQUE KEY `username_appid_unique` (`username`, `appId`),
    FOREIGN KEY (`tenantId`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`appId`) REFERENCES `apps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `apps` (`id`, `name`) VALUES ('DEFAULT' ,'My App');
