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

export type ModData = Record<Platforms, DatabaseModData>;

export interface DatabaseMod {
	platforms: Platforms[];
	modData: Partial<ModData>;
}

export interface DatabaseModData {
	slug: string;
	authors: DatabaseModDataAuthor[];
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
	id: string;
	createVersion?: string;
}

interface DatabaseModDataAuthor {
	name: string;
	url: string;
}

export type ModDataDatabaseKeys = keyof DatabaseModData;

export type ModDataDatabaseValues = DatabaseModData[ModDataDatabaseKeys];
