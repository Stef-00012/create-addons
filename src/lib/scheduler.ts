import getModrinthMods from "@/functions/getModrinthMods";
import { mods as modsSchema } from "@/db/schema";
import db from "@/db/db";
import { and, eq, or, sql } from "drizzle-orm";
import type {
	Modloaders,
	DatabaseMod,
	ModDataDatabaseValues,
	DatabaseModData,
} from "@/types/addons";
import type { UpdateMessage } from "@/types/websocket";
import { compareArrays } from "@/functions/util";
import getCurseforgeMods from "@/functions/getCurseforgeMods";
import { curseforgeModloaders, modLoaders } from "@/constants/loaders";

export type FetchResult = {
    created: DatabaseMod[];
    updated: UpdateMessage["data"];
}

export async function handleFetching(): Promise<FetchResult> {
	const curseforgeMods = await getCurseforgeMods();
	const modrinthMods = await getModrinthMods();

	const addons: ({
		dbData: DatabaseMod,
		hashes: string[]
	})[] = [];

	for (const addon of curseforgeMods) {
		const mod = addon.mod;
		const hashes = addon.hashes

		addons.push({
			dbData: {
				platforms: ["curseforge"],
				modData: {
					curseforge: {
						authors: mod.authors.map(author => ({
							name: author.name,
							url: author.url
						})),
						downloads: mod.downloadCount,
						description: mod.summary,
						categories: mod.categories.map(category => category.name),
						color: 15625524,
						clientSide: "unknown",
						serverSide: "unknown",
						icon: mod.logo.url,
						name: mod.name,
						slug: mod.slug,
						version: mod.latestFilesIndexes[0].gameVersion,
						versions: mod.latestFilesIndexes.map(version => version.gameVersion),
						follows: mod.thumbsUpCount,
						created: mod.dateCreated,
						id: mod.id.toString(),
						modified: mod.dateModified,
						license: "Unknown",
						modloaders: mod.latestFilesIndexes.map(file => curseforgeModloaders[file.modLoader]) as Modloaders[],
					}
				}
			},
			hashes
		})
	}

	for (const addon of modrinthMods) {
		const mod = addon.mod;
		const hashes = addon.hashes;

		const index = addons.findIndex(x => hashes.some(hash => x.hashes.includes(hash)));

		const addonData: DatabaseModData = {
			authors: addon.authors.map(author => ({
				name: author,
				url: `https://modrinth.com/user/${author}`,
			})),
			categories: mod.categories,
			clientSide: mod.client_side,
			color: mod.color ?? 1825130,
			serverSide: mod.server_side,
			description: mod.description,
			icon: mod.icon_url,
			name: mod.title,
			slug: mod.slug,
			version: mod.game_versions[mod.game_versions.length - 1],
			versions: mod.game_versions,
			follows: mod.followers,
			created: mod.published,
			id: mod.id,
			downloads: mod.downloads,
			modified: mod.updated,
			license: mod.license,
			modloaders: mod.loaders as Modloaders[],
		}

		if (index !== -1) {
			addons[index].dbData.platforms.push("modrinth")
			addons[index].dbData.modData.modrinth = addonData;
		} else {
			addons.push({
				dbData: {
					platforms: ["modrinth"],
					modData: {
						modrinth: addonData,
					}
				},
				hashes: addon.hashes
			})
		}
	}

	const created: FetchResult["created"] = [];
	const updated: FetchResult["updated"] = [];

	for (const addon of addons) {
		const mod = addon.dbData

		const exists = await db.query.mods.findFirst({
			where: or(
				sql`json_extract(${modsSchema.modData}, '$.modData.modrinth.slug') = ${mod.modData.modrinth?.slug}`,
				sql`json_extract(${modsSchema.modData}, '$.modData.curseforge.slug') = ${mod.modData.curseforge?.slug}`,
			)
		})
	}

	// for (const mod of modrinthMods) {
	// 	console.log(`\x1b[36mProcessing modrinth mod "\x1b[0;1m${mod.slug}\x1b[0;36m"\x1b[0m`);

	// 	const existingMod = await db.query.mods.findFirst({
	// 		where: and(
	// 			eq(modsSchema.slug, mod.slug),
	// 			eq(modsSchema.platform, "modrinth")
	// 		),
	// 	});

	// 	const newModData: DatabaseMod = {
	// 		platform: "modrinth",
	// 		slug: mod.slug,
	// 		author: mod.author,
	// 		downloads: mod.downloads,
	// 		description: mod.description,
	// 		icon: mod.icon_url,
	// 		name: mod.title,
	// 		version: mod.versions[mod.versions.length - 1],
	// 		versions: mod.versions,
	// 		categories: mod.categories.filter(
	// 			(category: string) => !modLoaders.includes(category),
	// 		),
	// 		follows: mod.follows,
	// 		created: mod.date_created,
	// 		modified: mod.date_modified,
	// 		color: typeof mod.color === "number" ? mod.color : 1825130,
	// 		license: mod.license,
	// 		clientSide: mod.client_side,
	// 		serverSide: mod.server_side,
	// 		modloaders: mod.categories.filter((category: string) =>
	// 			modLoaders.includes(category),
	// 		) as Modloaders[],
	// 	};

	// 	if (!existingMod) {
	// 		await db
	// 			.insert(modsSchema)
	// 			.values(newModData);

	// 		created.push(newModData);

	// 		continue;
	// 	}

	// 	const changes: Record<
	// 		string,
	// 		{ old: ModDataDatabaseValues; new: ModDataDatabaseValues }
	// 	> = {};

	// 	for (const _key in newModData) {
	// 		const key = _key as keyof typeof existingMod;

	// 		if (Array.isArray(newModData[key]) && Array.isArray(existingMod[key])) {
	// 			if (
	// 				!compareArrays(newModData[key], existingMod[key])
	// 			)
	// 				changes[key] = { old: existingMod[key], new: newModData[key] };
	// 		} else if (newModData[key] !== existingMod[key]) {
	// 			changes[key] = {
	// 				old: existingMod[key] as ModDataDatabaseValues,
	// 				new: newModData[key],
	// 			};
	// 		}
	// 	}

	// 	await db
	// 		.update(modsSchema)
	// 		.set(newModData)
	// 		.where(
	// 			and(
	// 				eq(modsSchema.slug, mod.slug),
	// 				eq(modsSchema.platform, "modrinth")
	// 			),
	// 		);

	// 	if (Object.keys(changes).length > 0) updated.push({
	// 		slug: newModData.slug,
	// 		platform: newModData.platform,
	// 		name: newModData.name,
	// 		changes,
	// 	});
	// }

	// for (const mod of curseforgeMods) {
	// 	console.log(`\x1b[36mProcessing curseforge mod "\x1b[0;1m${mod.slug}\x1b[0;36m"\x1b[0m`);

	// 	const existingMod = await db.query.mods.findFirst({
	// 		where: and(
	// 			eq(modsSchema.slug, mod.slug),
	// 			eq(modsSchema.platform, "curseforge")
	// 		),
	// 	});

	// 	const versions = mod.latestFilesIndexes.map((x) => x.gameVersion);

	// 	const newModData: DatabaseMod = {
	// 		platform: "curseforge",
	// 		slug: mod.slug,
	// 		author: mod.authors[0].name,
	// 		downloads: mod.downloadCount,
	// 		description: mod.summary,
	// 		icon: mod.logo.url,
	// 		name: mod.name,
	// 		version: versions[versions.length - 1],
	// 		versions,
	// 		categories: mod.categories.map((category) => category.name),
	// 		follows: mod.thumbsUpCount,
	// 		created: mod.dateCreated,
	// 		modified: mod.dateModified,
	// 		color: 15625524,
	// 		license: "Unknown",
	// 		clientSide: "unknown",
	// 		serverSide: "unknown",
	// 		modloaders: mod.latestFilesIndexes.map(
	// 			(x) => curseforgeModloaders[x.modLoader] as DatabaseMod["modloaders"][0],
	// 		).filter(loader => loader !== "any")
	// 	};

	// 	if (!existingMod) {
	// 		await db
	// 			.insert(modsSchema)
	// 			.values(newModData);

	// 		created.push(newModData);

	// 		continue;
	// 	}

	// 	const changes: Record<
	// 		string,
	// 		{ old: ModDataDatabaseValues; new: ModDataDatabaseValues }
	// 	> = {};

	// 	for (const _key in newModData) {
	// 		const key = _key as keyof typeof existingMod;

	// 		if (Array.isArray(newModData[key]) && Array.isArray(existingMod[key])) {
	// 			if (
	// 				!compareArrays(newModData[key], existingMod[key])
	// 			)
	// 				changes[key] = { old: existingMod[key], new: newModData[key] };
	// 		} else if (newModData[key] !== existingMod[key]) {
	// 			changes[key] = {
	// 				old: existingMod[key] as ModDataDatabaseValues,
	// 				new: newModData[key],
	// 			};
	// 		}
	// 	}

	// 	await db
	// 		.update(modsSchema)
	// 		.set(newModData)
	// 		.where(
	// 			and(
	// 				eq(modsSchema.slug, mod.slug),
	// 				eq(modsSchema.platform, "curseforge")
	// 			),
	// 		);

	// 	if (Object.keys(changes).length > 0) updated.push({
	// 		slug: newModData.slug,
	// 		platform: newModData.platform,
	// 		name: newModData.name,
	// 		changes,
	// 	});
	// }

	console.log(`\x1b[33m[\x1b[1m${new Date().toISOString()}\x1b[0;33m] \x1b[32mFinished processing mods\x1b[0m`);

	return { created, updated };
}
