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
	project_id: string;
	author: string;
	display_categories: string[];
	versions: string[];
	follows: number;
	date_created: string;
	date_modified: string;
	latest_version: string;
	license: string;
	gallery: string[];
	featured_gallery: string | null;
}

export interface ModrinthGetProjectsMod {
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
	color: number | null;
	thread_id: string;
	monetization_status: "monetized" | "demonetized" | "force-demonetized";
	id: string;
	team: string;
	body_url: string | null;
	moderator_message: ModrinthModModeratorMessage | null;
	published: string;
	updated: string;
	approved: string | null;
	queued: string | null;
	followers: number;
	license: ModrinthModLicense;
	versions: string[];
	game_versions: string[];
	loaders: string[];
	gallery: ModrinthModGallery[];
}

interface ModrinthModLicense {
	id: string;
	name: string;
	url: string | null;
}

interface ModrinthModModeratorMessage {
	message: string;
	body: string | null;
}

interface ModrinthModGallery {
	url: string;
	featured: boolean;
	title: string | null;
	description: string | null;
	created: string;
	ordering: number;
}

export interface ModrinthGetVersionsVersion {
	name: string;
	version_number: string;
	changelog: string | null;
	dependencies: ModrinthGetVersionsVersionDependency[];
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
	files: ModrinthGetVersionsVersionFile[];
}

interface ModrinthGetVersionsVersionDependency {
	version_id: string | null;
	project_id: string | null;
	file_name: string | null;
	dependency_type: "required" | "optional" | "incompatible" | "embedded";
}

interface ModrinthGetVersionsVersionFile {
	hashes: ModrinthGetVersionsVersionFileHashes;
	url: string;
	filename: string;
	primary: boolean;
	size: number;
	file_type: "required-resource-pack" | "optional-resource-pack" | null;
}

interface ModrinthGetVersionsVersionFileHashes {
	sha512: string;
	sha1: string;
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

export interface ModrinthTeamUsers {
	team_id: string;
	user: ModrinthTeamUser;
	role: string;
	permissions: number;
	accepted: boolean;
	payouts_split: number;
	ordering: number;
}

interface ModrinthTeamUser {
	username: string;
	name: string | null;
	email: string | null;
	bio: string | null;
	payout_data: ModrinthTeamUserPayoutData | null;
	id: string;
	avatar_url: string;
	created: string;
	role: "admin" | "moderator" | "developer";
	badges: number;
	auth_providers: string[];
	email_verified: boolean | null;
	has_password: boolean | null;
	has_totp: boolean | null;
	github_id: string | null;
}

interface ModrinthTeamUserPayoutData {
	balance: number;
	payout_wallet: "paypal" | "venmo";
	payout_wallet_type: "email" | "phone" | "user_handle";
	payout_address: string;
}

export interface ModrinthGameVersion {
	version: string;
	version_type: "release" | "snapshot" | "alpha" | "beta";
	date: string;
	major: boolean;
}
