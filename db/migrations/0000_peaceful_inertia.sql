CREATE TABLE IF NOT EXISTS `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `session` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionToken` text NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`sessionStartedAt` integer,
	`lastConnectedAt` integer,
	`lastSessionEndedAt` integer,
	`update` text,
	`status` text DEFAULT 'offline' NOT NULL,
	`updateChangedAt` integer,
	`statusChangedAt` integer,
	`away` integer DEFAULT false NOT NULL,
	`awayChangedAt` integer,
	`apiKey` text NOT NULL,
	`connections` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `Account_userId_index` ON `account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `session_sessionToken_unique` ON `session` (`sessionToken`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `Session_userId_index` ON `session` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `user_apiKey_unique` ON `user` (`apiKey`);