CREATE TABLE `mods` (
	`platform` text NOT NULL,
	`id` text,
	`slug` text NOT NULL,
	`author` text NOT NULL,
	`downloads` integer NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`name` text NOT NULL,
	`version` text NOT NULL,
	`versions` text NOT NULL,
	`categories` text NOT NULL,
	`follows` integer NOT NULL,
	PRIMARY KEY(`id`, `platform`)
);
