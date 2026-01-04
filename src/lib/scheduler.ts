import getModrinthMods, {
	getMinecraftVersions,
} from "@/functions/getModrinthMods";
import { mods as modsSchema } from "@/db/schema";
import db from "@/db/db";
import { or, sql } from "drizzle-orm";
import type { Modloaders, DatabaseMod, DatabaseModData } from "@/types/addons";
import type { UpdateMessage } from "@/types/websocket";
import { compareAddons, getCreatVersion, sortVersions } from "@/functions/util";
import getCurseforgeMods from "@/functions/getCurseforgeMods";
import { curseforgeModloaders } from "@/constants/loaders";

export type FetchResult = {
	created: DatabaseMod[];
	updated: UpdateMessage["data"];
};

export async function handleFetching(): Promise<FetchResult> {
	const curseforgeMods = await getCurseforgeMods();

	console.info("-".repeat(60));

	const modrinthMods = await getModrinthMods();

	const minecraftVersions = await getMinecraftVersions();

	const addons: {
		dbData: DatabaseMod;
		hashes: string[];
		downloads: string[];
	}[] = [];

	for (const addon of curseforgeMods) {
		const mod = addon.mod;
		const hashes = addon.hashes;
		const downloads = addon.downloads;
		const versions = sortVersions(
			Array.from(
				new Set(mod.latestFilesIndexes.map((version) => version.gameVersion)),
			),
			minecraftVersions,
		);

		addons.push({
			dbData: {
				platforms: ["curseforge"],
				modData: {
					curseforge: {
						authors: mod.authors.map((author) => ({
							name: author.name,
							url: author.url,
						})),
						downloads: mod.downloadCount,
						description: mod.summary,
						categories: mod.categories.map((category) => category.name).sort(),
						color: 15625524,
						clientSide: "unknown",
						serverSide: "unknown",
						icon: mod.logo.url,
						name: mod.name,
						slug: mod.slug,
						version: versions[versions.length - 1],
						versions,
						follows: mod.thumbsUpCount,
						created: mod.dateCreated,
						id: mod.id.toString(),
						modified: mod.dateModified,
						license: "Unknown",
						modloaders: Array.from(
							new Set(
								mod.latestFilesIndexes
									.filter((file) => typeof file.modLoader === "number")
									.map((file) => curseforgeModloaders[file.modLoader]),
							),
						).sort() as Modloaders[],
					},
				},
			},
			hashes,
			downloads,
		});
	}

	for (const addon of modrinthMods) {
		const mod = addon.mod;
		const hashes = addon.hashes;
		const downloads = addon.downloads;
		const versions = sortVersions(mod.game_versions, minecraftVersions);

		const index = addons.findIndex((x) =>
			hashes.some((hash) => x.hashes.includes(hash)),
		);

		const addonData: DatabaseModData = {
			authors: addon.authors.map((author) => ({
				name: author,
				url: `https://modrinth.com/user/${author}`,
			})),
			categories: mod.categories.sort(),
			clientSide: mod.client_side,
			color: mod.color ?? 1825130,
			serverSide: mod.server_side,
			description: mod.description,
			icon: mod.icon_url,
			name: mod.title,
			slug: mod.slug,
			version: versions[versions.length - 1],
			versions,
			follows: mod.followers,
			created: mod.published,
			id: mod.id,
			downloads: mod.downloads,
			modified: mod.updated,
			license: mod.license.name,
			modloaders: mod.loaders.sort() as Modloaders[],
		};

		if (index !== -1) {
			addons[index].dbData.platforms.push("modrinth");
			addons[index].dbData.modData.modrinth = addonData;
		} else {
			addons.push({
				dbData: {
					platforms: ["modrinth"],
					modData: {
						modrinth: addonData,
					},
				},
				hashes,
				downloads,
			});
		}
	}

	const created: FetchResult["created"] = [];
	const updated: FetchResult["updated"] = [];

	for (const addon of addons) {
		const mod = addon.dbData;

		console.info(
			`\x1b[36mProcessing addon "\x1b[0;1m${mod.modData.modrinth?.slug ?? mod.modData.curseforge?.slug}\x1b[0;36m"\x1b[0m`,
		);

		const exists = await db.query.mods.findFirst({
			where: or(
				sql`json_extract(${modsSchema.modData}, '$.modrinth.slug') = ${mod.modData.modrinth?.slug || "<missing slug>"}`,
				sql`json_extract(${modsSchema.modData}, '$.curseforge.slug') = ${mod.modData.curseforge?.slug || "<missing slug>"}`,
			),
		});

		if (!exists) {
			const latestDownloadUrl = addon.downloads[addon.downloads.length - 1];

			if (!latestDownloadUrl)
				console.error(
					`\x1b[31mNo download URL found for the addon "\x1b[0;1m${mod.modData.modrinth?.slug ?? mod.modData.curseforge?.slug}\x1b[0;36m"\x1b[0m]`,
				);

			console.info(
				`\x1b[36mFetching create version for the addon "\x1b[0;1m${mod.modData.modrinth?.slug ?? mod.modData.curseforge?.slug}\x1b[0;36m" from "\x1b[0m${latestDownloadUrl}\x1b[0;36m"\x1b[0m`,
			);

			if (latestDownloadUrl) {
				const createVersion = await getCreatVersion(latestDownloadUrl);

				if (createVersion) {
					console.info(
						`\x1b[36mObtained create version "\x1b[0m${createVersion}\x1b[0;36m" for the addon "\x1b[0;1m${mod.modData.modrinth?.slug ?? mod.modData.curseforge?.slug}\x1b[0;36m"\x1b[0m`,
					);

					if (mod.modData.curseforge) {
						mod.modData.curseforge.createVersion = createVersion;
					}

					if (mod.modData.modrinth) {
						mod.modData.modrinth.createVersion = createVersion;
					}
				}
			}

			await db.insert(modsSchema).values(mod);
			created.push(mod);

			continue;
		}

		if (
			exists.modData.curseforge &&
			mod.modData.curseforge &&
			"createVersion" in exists.modData.curseforge
		) {
			mod.modData.curseforge.createVersion =
				exists.modData.curseforge.createVersion;
		}

		if (
			exists.modData.modrinth &&
			mod.modData.modrinth &&
			"createVersion" in exists.modData.modrinth
		) {
			mod.modData.modrinth.createVersion =
				exists.modData.modrinth.createVersion;
		}

		const curseforgeChanges = compareAddons(
			exists.modData.curseforge,
			mod.modData.curseforge,
		);
		const modrinthChanges = compareAddons(
			exists.modData.modrinth,
			mod.modData.modrinth,
		);

		const changes = {
			curseforge: curseforgeChanges,
			modrinth: modrinthChanges,
		};

		if (
			curseforgeChanges?.versions ||
			curseforgeChanges?.version ||
			modrinthChanges?.versions ||
			modrinthChanges?.version ||
			(exists.modData.curseforge && !exists.modData.curseforge.createVersion) ||
			(exists.modData.modrinth && !exists.modData.modrinth.createVersion)
		) {
			const latestDownloadUrl = addon.downloads[addon.downloads.length - 1];

			if (!latestDownloadUrl)
				console.error(
					`\x1b[31mNo download URL found for the addon "\x1b[0;1m${mod.modData.modrinth?.slug ?? mod.modData.curseforge?.slug}\x1b[0;36m"\x1b[0m]`,
				);

			console.info(
				`\x1b[36mFetching create version for the addon "\x1b[0;1m${mod.modData.modrinth?.slug ?? mod.modData.curseforge?.slug}\x1b[0;36m" from "\x1b[0m${latestDownloadUrl}\x1b[0;36m"\x1b[0m`,
			);

			if (latestDownloadUrl) {
				const createVersion = await getCreatVersion(latestDownloadUrl);

				if (createVersion) {
					console.info(
						`\x1b[36mObtained create version "\x1b[0m${createVersion}\x1b[0;36m" for the addon "\x1b[0;1m${mod.modData.modrinth?.slug ?? mod.modData.curseforge?.slug}\x1b[0;36m"\x1b[0m`,
					);

					if (mod.modData.curseforge) {
						if (
							changes.curseforge?.createVersion &&
							mod.modData.curseforge.createVersion !== createVersion
						) {
							changes.curseforge.createVersion = {
								old: mod.modData.curseforge.createVersion,
								new: createVersion,
							};
						}

						mod.modData.curseforge.createVersion = createVersion;
					}

					if (mod.modData.modrinth) {
						if (
							changes.modrinth?.createVersion &&
							mod.modData.modrinth.createVersion !== createVersion
						) {
							changes.modrinth.createVersion = {
								old: mod.modData.modrinth.createVersion,
								new: createVersion,
							};
						}

						mod.modData.modrinth.createVersion = createVersion;
					}
				}
			}
		}

		await db
			.update(modsSchema)
			.set(mod)
			.where(
				or(
					sql`json_extract(${modsSchema.modData}, '$.modrinth.slug') = ${mod.modData.modrinth?.slug || "<missing slug>"}`,
					sql`json_extract(${modsSchema.modData}, '$.curseforge.slug') = ${mod.modData.curseforge?.slug || "<missing slug>"}`,
				),
			);

		if (
			Object.keys(changes.curseforge ?? {}).length > 0 ||
			Object.keys(changes.modrinth ?? {}).length > 0
		) {
			const changeResult: FetchResult["updated"][0] = {
				slugs: {
					modrinth: mod.modData.modrinth?.slug ?? null,
					curseforge: mod.modData.curseforge?.slug ?? null,
				},
				icons: {
					curseforge: mod.modData.curseforge?.icon ?? null,
					modrinth: mod.modData.modrinth?.icon ?? null,
				},
				changes,
				platforms: mod.platforms,
				names: {
					modrinth: mod.modData.modrinth?.name ?? null,
					curseforge: mod.modData.curseforge?.name ?? null,
				},
			};

			updated.push(changeResult);
		}
	}

	console.info(
		`\x1b[33m[\x1b[1m${new Date().toISOString()}\x1b[0;33m] \x1b[32mFinished processing mods\x1b[0m`,
	);

	return { created, updated };
}
