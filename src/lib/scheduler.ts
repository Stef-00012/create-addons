import getModrinthMods from "@/functions/getModrinthMods";
import { mods as modsSchema } from "@/db/schema";
import schedule from "node-schedule";
import db from "@/db/db";

export const startScheduler = () => {
	console.log("Started fetching the mods from Modrinth");

	handleFetching();

	const cronJobInterval = process.env.MODS_FETCH_CRON_INTERVAL || "0 */3 * * *";

	schedule.scheduleJob(cronJobInterval, () => {
		console.log("Started fetching the mods from Modrinth");

		handleFetching();
	});
};

async function handleFetching() {
	const mods = await getModrinthMods();

	const modLoaders = [
		"quilt",
		"fabric",
		"forge",
		"neoforge",
		"liteloader",
		"modloader",
		"rift",
	];

	for (const mod of mods) {
		console.log("Inserting mod", mod.slug);

		await db
			.insert(modsSchema)
			.values({
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
				),
			})
			.onConflictDoUpdate({
				target: [modsSchema.slug, modsSchema.platform],
				set: {
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
					author: mod.author,
					created: mod.date_created,
					modified: mod.date_modified,
					color: typeof mod.color === "number" ? mod.color : 1825130,
					license: mod.license,
					clientSide: mod.client_side,
					serverSide: mod.server_side,
					modloaders: mod.categories.filter((category: string) =>
						modLoaders.includes(category),
					),
				},
			});
	}

	console.log("Finished inserting mods");
}
