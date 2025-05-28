export type Platforms = "modrinth" | "curseforge";

export type Modloaders =
	| "quilt"
	| "fabric"
	| "forge"
	| "neoforge"
	| "liteloader"
	| "modloader"
	| "rift"
    | "cauldron"
    | "any";

export type SupportTypes = "unknown" | "required" | "optional" | "unsupported";

export type SortOrders =
	| "name"
	| "downloads"
	| "followers"
	| "lastUpdated"
	| "created";

export interface DatabaseMod {
	platform: Platforms;
	slug: string;
	author: string;
	downloads: number;
	description: string;
	icon: string;
	name: string;
	version: string;
	versions: string[];
	categories: string[];
	follows: number;
	created: string;
	modified: string;
	color: number;
	license: string;
	clientSide: SupportTypes;
	serverSide: SupportTypes;
	modloaders: Modloaders[];
}

export type ModDatabaseKeys = keyof DatabaseMod;

export type ModDatabaseValues = DatabaseMod[ModDatabaseKeys];
