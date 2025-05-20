import db from "@/db/db";
import Fuse from "fuse.js";

import type { Modloaders, SortOrders } from "@/types/modrinth";

interface Props {
	page?: number;
	version?: string | "all";
	modloader?: Modloaders | "all";
	search?: string;
	sortOrder?: SortOrders;
}

export async function fetchSortedMods({
	page = 0,
	version = "all",
	modloader = "all",
	search = "",
	sortOrder = "downloads",
}: Props) {
	const modsPerPage =
		Number.parseInt(process.env.MODS_PER_PAGE as string) || 50;

	const modsRes = await db.query.mods.findMany();

	const mods = modsRes.map((mod) => ({
		...mod,
		versions: mod.versions as string[],
		categories: mod.categories as string[],
		modloaders: mod.modloaders as string[],
	}));

	const versions = mods.find((mod) => mod.slug === "create")?.versions || [];

	if (version !== "all" && !versions.includes(version))
		return Response.json({ error: "Invalid version" }, { status: 400 });

	const modLoaders = [
		"quilt",
		"fabric",
		"forge",
		"neoforge",
		"liteloader",
		"modloader",
		"rift",
	];

	if (modloader !== "all" && !modLoaders.includes(modloader))
		return Response.json({ error: "Invalid modloader" }, { status: 400 });

	const fuse = new Fuse(mods, {
		keys: ["name", "description", "slug", "categories"],
		threshold: 0.4,
	});

	const searchFilteredMods =
		!search || search === ""
			? mods
			: fuse.search(search).map((result) => result.item);

	const filteredMods = searchFilteredMods.filter((mod) => {
		return (
			(modloader === "all" || mod.modloaders.includes(modloader)) &&
			(version === "all" || mod.versions.includes(version))
		);
	});

	const sortedMods = filteredMods.sort((a, b) => {
		if (sortOrder === "downloads") {
			return b.downloads - a.downloads;
		}

		if (sortOrder === "followers") {
			return b.follows - a.follows;
		}

		if (sortOrder === "lastUpdated") {
			return new Date(b.modified).getTime() - new Date(a.modified).getTime();
		}

		if (sortOrder === "created") {
			return new Date(b.created).getTime() - new Date(a.created).getTime();
		}

		if (sortOrder === "name") {
			return a.name.localeCompare(b.name);
		}

		return 0;
	});

	return {
		page,
		mods: sortedMods.slice(page * modsPerPage, (page + 1) * modsPerPage),
		totalMods: sortedMods.length,
		totalPages: Math.ceil(sortedMods.length / modsPerPage),
	};
}
