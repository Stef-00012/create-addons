import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

export const mods = sqliteTable("mods", {
    platform: text("platform").notNull(),
    id: text("id"),
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
}, (table) => {
    return {
        pk: primaryKey({
            columns: [table.id, table.platform],
        }),
    };
},);
