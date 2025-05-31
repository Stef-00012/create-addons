import type { ModData, Platforms } from "@/types/addons";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const mods = sqliteTable("mods", {
	id: integer("id").notNull().primaryKey({
		autoIncrement: true,
	}),
	platforms: text("platforms", {
		mode: "json",
	})
		.notNull()
		.$type<Platforms[]>(),
	modData: text("mod_data", {
		mode: "json",
	})
		.notNull()
		.default({})
		.$type<Partial<ModData>>(),
});
