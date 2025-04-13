import getModrinthMods from "@/functions/getModrinthMods";
import { mods as modsSchema } from "@/db/schema";
import schedule from "node-schedule";
import db from "@/db/db";

export const startScheduler = () => {
	console.log("Started fetching the mods from Modrinth");

	handleFetching();

	const job = schedule.scheduleJob("0 */3 * * *", () => {
		console.log("Started fetching the mods from Modrinth");

		handleFetching();
	});
};

async function handleFetching() {
	const mods = await getModrinthMods();

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
				versions: JSON.stringify(mod.versions),
				categories: JSON.stringify(mod.categories),
				follows: mod.follows,
				created: mod.date_created,
				modified: mod.date_modified,
				color: typeof mod.color === "number" ? mod.color : 1825130,
				license: mod.license,
				clientSide: mod.client_side,
				serverSide: mod.server_side,
			})
			.onConflictDoUpdate({
				target: [modsSchema.slug, modsSchema.platform],
				set: {
					downloads: mod.downloads,
					description: mod.description,
					icon: mod.icon_url,
					name: mod.title,
					version: mod.versions[mod.versions.length - 1],
					versions: JSON.stringify(mod.versions),
					categories: JSON.stringify(mod.categories),
					follows: mod.follows,
					author: mod.author,
					created: mod.date_created,
					modified: mod.date_modified,
					color: typeof mod.color === "number" ? mod.color : 1825130,
					license: mod.license,
					clientSide: mod.client_side,
					serverSide: mod.server_side,
				},
			});
	}

	console.log("Finished inserting mods");
}
