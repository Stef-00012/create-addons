interface ModrinthSearchMod {
	slug: string;
	title: string;
	description: string;
	categories: string[];
	client_side: "required" | "optional" | "unsupported" | "unknown";
	server_side: "required" | "optional" | "unsupported" | "unknown";
	project_type: "mod" | "modpack" | "resourcepack" | "shader";
	downloads: number;
	icon_url: string;
	color: number | null;
	thread_id: string;
	monetization_status: "monetized" | "demonetized" | "force-demonetized";
	author: string;
	display_categories: string[];
	versions: string[];
	follows: number;
	date_created: string;
	date_modified: string;
	latest_version: string;
	license: string;
	gallery: string[];
	featured_gallery: string;
}

export interface ModrinthSearchResponse {
	hits: ModrinthSearchMod[];
	total_hits: number;
	offset: number;
	limit: number;
}

interface ModrinthDependencyMod {
	slug: string;
	title: string;
	description: string;
	categories: string[];
	client_side: "required" | "optional" | "unsupported" | "unknown";
	server_side: "required" | "optional" | "unsupported" | "unknown";
	body: string;
	status:
		| "approved"
		| "archived"
		| "rejected"
		| "draft"
		| "unlisted"
		| "processing"
		| "withheld"
		| "scheduled"
		| "private"
		| "unknown";
	requested_status:
		| "approved"
		| "archived"
		| "unlisted"
		| "private"
		| "draft"
		| null;
	additional_categories: string[];
	issues_url: string;
	source_url: string;
	wiki_url: string;
	discord_url: string;
	donation_urls: string[];
	project_type: "mod" | "modpack" | "resourcepack" | "shader";
	downloads: number;
	icon_url: string;
	color: number;
	thread_id: string;
	monetization_status: "monetized" | "demonetized" | "force-demonetized";
	id: string;
	team: string;
	body_url: string;
	published: string;
	updated: string;
	approved: string | null;
	queued: string | null;
	follows: number;
	license: string;
	versions: string[];
	game_versions: string[];
	loaders: string[];
}

interface ModrinthDependecyVersion {
	name: string;
	version_number: string;
	changelog: string | null;

	game_versions: string[];
	version_type: "release" | "beta" | "alpha";
	loaders: string[];
	featured: boolean;
	status:
		| "listed"
		| "archived"
		| "draft"
		| "unlisted"
		| "scheduled"
		| "unknown";
	requested_status: "listed" | "archived" | "draft" | "unlisted" | null;
	id: string;
	project_id: string;
	author_id: string;
	date_published: string;
	downloads: number;
	changelog_url: string | null;
}

export interface ModrinthDependenciesResponse {
	projects: ModrinthDependencyMod[];
	versions: ModrinthDependecyVersion;
}
export type Modloaders =
	| "quilt"
	| "fabric"
	| "forge"
	| "neoforge"
	| "liteloader"
	| "modloader"
	| "rift";

export type Platforms = "modrinth";

export type SupportTypes = "unknown" | "required" | "optional" | "unsupported";

export type SortOrders =
	| "name"
	| "downloads"
	| "followers"
	| "lastUpdated"
	| "created";

export type ModrinthModDatabaseKeys = keyof ModrinthDatabaseMod;
export type ModrinthModDatabaseValues =
	ModrinthDatabaseMod[ModrinthModDatabaseKeys];

export interface ModrinthDatabaseMod {
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
