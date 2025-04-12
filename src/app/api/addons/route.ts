import db from "@/db/db";

export type APIModsResponse = {
	platform: string;
	slug: string;
	author: string;
	downloads: number;
	description: string;
	icon: string;
	name: string;
	version: string;
	modloaders: ("quilt" | "fabric" | "forge" | "neoforge" | "liteloader" | "modloader" | "rift")[];
	versions: string[];
	categories: string[];
	follows: number;
	created: string;
	modified: string;
	color: number;
	license: string;
	clientSide: string;
	serverSide: string;
}[];

export async function GET(_req: Request) {
	const mods = await db.query.mods.findMany();

	const modLoaders = [
		"quilt",
		"fabric",
		"forge",
		"neoforge",
		"liteloader",
		"modloader",
		"rift",
	];

	const formattedMods = mods.map((mod) => ({
		...mod,
		versions: JSON.parse(mod.versions as string),
		categories: JSON.parse(mod.categories as string).filter(
			(category: string) => !modLoaders.includes(category),
		),
		modloaders: JSON.parse(mod.categories as string).filter(
			(category: string) => modLoaders.includes(category),
		),
	}));

	return Response.json(formattedMods);
}
