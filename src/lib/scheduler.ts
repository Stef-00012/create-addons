import getModrinthMods from "@/functions/getModrinthMods";
import { mods as modsSchema } from "@/db/schema";
import db from "@/db/db";
import { and, eq } from "drizzle-orm";
import type {
	Modloaders,
	ModrinthDatabaseMod,
	ModrinthModDatabaseValues,
} from "@/types/modrinth";
import type { UpdateMessage } from "@/types/websocket";
import { compareArrays } from "@/functions/util";

export type FetchResult = {
    created: ModrinthDatabaseMod[];
    updated: UpdateMessage["data"];
}

export async function handleFetching(): Promise<FetchResult> {
	const modrinthMods = await getModrinthMods();

	const modLoaders = [
		"quilt",
		"fabric",
		"forge",
		"neoforge",
		"liteloader",
		"modloader",
		"rift",
	];

	const created: FetchResult["created"] = [];
	const updated: FetchResult["updated"] = [];

	for (const mod of modrinthMods) {
		console.log(`\x1b[36mProcessing mod "\x1b[0;1m${mod.slug}\x1b[0;36m"\x1b[0m`);

		const existingMod = await db.query.mods.findFirst({
			where: and(
				eq(modsSchema.slug, mod.slug),
				eq(modsSchema.platform, "modrinth"),
			),
		});

		const newModData: NonNullable<typeof existingMod> = {
			platform: "modrinth",
			slug: mod.slug,
			author: mod.author,
			downloads: mod.downloads,
			description: mod.description,
			icon: mod.icon_url,
			name: mod.title,
			version: mod.versions[mod.versions.length - 1],
			versions: mod.versions,
			categories: mod.categories.filter(
				(category: string) => !modLoaders.includes(category),
			),
			follows: mod.follows,
			created: mod.date_created,
			modified: mod.date_modified,
			color: typeof mod.color === "number" ? mod.color : 1825130,
			license: mod.license,
			clientSide: mod.client_side,
			serverSide: mod.server_side,
			modloaders: mod.categories.filter((category: string) =>
				modLoaders.includes(category),
			) as Modloaders[],
		};

		if (!existingMod) {
			await db.insert(modsSchema).values(newModData);

			created.push(newModData);

			continue;
		}

		const changes: Record<
			string,
			{ old: ModrinthModDatabaseValues; new: ModrinthModDatabaseValues }
		> = {};

		for (const _key in newModData) {
			const key = _key as keyof typeof existingMod;

			if (Array.isArray(newModData[key]) && Array.isArray(existingMod[key])) {
				if (
					!compareArrays(newModData[key], existingMod[key])
				)
					changes[key] = { old: existingMod[key], new: newModData[key] };
			} else if (newModData[key] !== existingMod[key]) {
				changes[key] = {
					old: existingMod[key] as ModrinthModDatabaseValues,
					new: newModData[key],
				};
			}
		}

		await db
			.update(modsSchema)
			.set(newModData)
			.where(
				and(eq(modsSchema.slug, mod.slug), eq(modsSchema.platform, "modrinth")),
			);

		if (Object.keys(changes).length > 0) updated.push({
			slug: newModData.slug,
			platform: newModData.platform,
			name: newModData.name,
			changes,
		});
	}

	console.log(`\x1b[33m[\x1b[1m${new Date().toISOString()}\x1b[0;33m] \x1b[32mFinished processing mods\x1b[0m`);

	return { created, updated };
}
