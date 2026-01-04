export interface FabricModJson {
	schemaVersion: number;
	id: string;
	version: string;
	name: string;
	description: string;
	authors: string[];
	license: string;
	icon: string;
	environment: string;
	entrypoints: Record<string, string[]>;
	mixins: string[];
	depends: Record<string, string>;
	accesaccessWidener?: string;
}

export interface ForgeModJson {
	modLoader: string;
	loaderVersion: string;
	mods: ForgeMod[];
	dependencies: Record<string, ForgeDependencyMod[]>;
}

interface ForgeMod {
	modId: string;
	version: string;
	displayName: string;
	authors: string;
	description: string;
	logoFile: string;
}

interface ForgeDependencyMod {
	modId: string;
	mandatory: boolean;
	versionRange: string;
	ordering: "BEFORE" | "AFTER" | "NONE";
	side: "CLIENT" | "SERVER" | "BOTH";
}
