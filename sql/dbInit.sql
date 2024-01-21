CREATE DATABASE IF NOT EXISTS `AUTH_DB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `AUTH_DB`;

CREATE TABLE `apps` (
    `id` varchar(64) DEFAULT 'DEFAULT',
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `roles` (
    `role` varchar(256) NOT NULL DEFAULT 'DEFAULT_TENANT',
    PRIMARY KEY (`role`)
);

CREATE TABLE `role_permissions` (
    `role` varchar(256) NOT NULL,
    `permission` varchar(256) NOT NULL,
    PRIMARY KEY (`role`, `permission`),
    FOREIGN KEY (`role`) REFERENCES `roles` (`role`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE INDEX `role_permissions_index` ON `role_permissions` (`role`, `permission`);

CREATE TABLE `users` (
    `id` varchar(64),
    `firstName` varchar(64) NOT NULL,
    `middleName` varchar(64) DEFAULT NULL,
    `lastName` varchar(64) DEFAULT NULL,
    `fullName` varchar(192) GENERATED ALWAYS AS (CONCAT_WS(' ',firstName, middleName, lastName)),
    `phoneNumber` varchar(20) DEFAULT NULL,
    `birthday` DATE DEFAULT NULL,
    `userMetadata` JSON NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `tenants` (
    `id` varchar(64) NOT NULL,
    `userId` varchar(64) NOT NULL,
    `appId` varchar(64) NOT NULL,
    `role` varchar(256) NOT NULL DEFAULT 'DEFAULT_TENANT',
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_tenants` (`appId`,`userId`),
    FOREIGN KEY (`appId`) REFERENCES `apps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`role`) REFERENCES `roles` (`role`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `tenant_configs` (
    `tenantId` varchar(64) NOT NULL,
    `coreConfig` JSON NOT NULL,
    `emailPasswordEnabled` tinyint NOT NULL DEFAULT 0,
    `passwordlessEnabled` tinyint NOT NULL DEFAULT 0,
    `thirdPartyEnabled` tinyint NOT NULL DEFAULT 0,
    PRIMARY KEY (`tenantId`),
    FOREIGN KEY (`tenantId`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `emailpassword_users` (
    `tenantId` varchar(64) NOT NULL,
    `email` varchar(256) DEFAULT NULL,
    `hashedEmail` varchar(256) NOT NULL, 
    `hashedPassword` varchar(256) NOT NULL,
    `varified` tinyint NOT NULL DEFAULT 0,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`tenantId`),
    UNIQUE KEY `email_password_unique` (`tenantId`, `hashedEmail`),
    FOREIGN KEY (`tenantId`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `emailverification_tokens` (
    `tenantId` varchar(64) NOT NULL,
    `email` varchar(256) NOT NULL,
    `token` varchar(128) NOT NULL,
    `tokenExpiry` timestamp NOT NULL,
    PRIMARY KEY (`tenantId`, `email`, `token`),
    UNIQUE KEY `email_varification_token_unique` (`token`),
    FOREIGN KEY (`tenantId`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `emailpassword_pswd_reset_tokens` (
    `tenantId` varchar(64) NOT NULL,
    `token` varchar(128) NOT NULL,
    `tokenExpiry` timestamp NOT NULL,
    `email` varchar(256) NOT NULL,
    PRIMARY KEY (`tenantId`),
    UNIQUE KEY `token` (`token`),
    FOREIGN KEY (`tenantId`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `users_staging` (
    `id` varchar(64),
    `firstName` varchar(64) NOT NULL,
    `middleName` varchar(64) DEFAULT NULL,
    `lastName` varchar(64) DEFAULT NULL,
    `fullName` varchar(192) GENERATED ALWAYS AS (CONCAT_WS(' ',firstName, middleName, lastName)),
    `phoneNumber` varchar(20) DEFAULT NULL,
    `birthday` DATE DEFAULT NULL,
    `userMetadata` JSON NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    `appId` varchar(64) NOT NULL,
    `role` varchar(256) NOT NULL DEFAULT 'DEFAULT_TENANT',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`appId`) REFERENCES `apps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`role`) REFERENCES `roles` (`role`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `roles` (`role`) VALUES ('SUDO'), ('ADMIN');
