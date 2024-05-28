ALTER TABLE `user` RENAME COLUMN `lastConnectedAt` TO `connectionStatusChangedAt`;--> statement-breakpoint
ALTER TABLE `user` ADD `connectionStatus` text DEFAULT 'offline' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `sessionStartedAt`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `lastSessionEndedAt`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `away`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `awayChangedAt`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `connections`;