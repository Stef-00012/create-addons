import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const mods = sqliteTable(
	"mods",
	{
		platform: text("platform").notNull(),
		slug: text("slug").notNull(),
		author: text("author").notNull(),
		downloads: integer("downloads").notNull(),
		description: text("description").notNull(),
		icon: text("icon").notNull(),
		name: text("name").notNull(),
		version: text("version").notNull(),
		versions: text("versions", { mode: "json" }).notNull(),
		categories: text("categories", { mode: "json" }).notNull(),
		follows: integer("follows").notNull(),
		created: text("created").notNull(),
		modified: text("modified").notNull(),
		color: integer("color").notNull().default(1825130),
		license: text("license").notNull(),
		clientSide: text("client_side").notNull().default("unknown"),
		serverSide: text("server_side").notNull().default("unknown"),
	},
	(table) => [unique().on(table.slug, table.platform)],
);
