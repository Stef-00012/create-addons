import type { Modloaders, Platforms, SupportTypes } from "@/types/modrinth";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const mods = sqliteTable(
	"mods",
	{
		platform: text("platform").notNull().$type<Platforms>(),
		slug: text("slug").notNull(),
		author: text("author").notNull(),
		downloads: integer("downloads").notNull().default(0),
		description: text("description").notNull(),
		icon: text("icon").notNull().default(""),
		name: text("name").notNull(),
		version: text("version").notNull(),
		versions: text("versions", { mode: "json" }).notNull().default("[]").$type<string[]>(),
		categories: text("categories", { mode: "json" }).notNull().default("[]").$type<string[]>(),
		follows: integer("follows").notNull().default(0),
		created: text("created").notNull(),
		modified: text("modified").notNull(),
		color: integer("color").notNull().default(1825130),
		license: text("license").notNull(),
		clientSide: text("client_side").notNull().default("unknown").$type<SupportTypes>(),
		serverSide: text("server_side").notNull().default("unknown").$type<SupportTypes>(),
		modloaders: text("modloader", { mode: "json" }).notNull().default("[]").$type<Modloaders[]>(),
	},
	(table) => [unique().on(table.slug, table.platform)],
);
