import db from "@/db/db";
import Fuse from "fuse.js";

import type {
	DatabaseMod,
	Modloaders,
	Platforms,
	SortOrders,
} from "@/types/addons";
import { modLoaders, platforms } from "@/constants/loaders";

interface Props {
	page?: number;
	version?: string | "all";
	modloader?: Modloaders | "all";
	search?: string;
	sortOrder?: SortOrders;
	platform?: Platforms | "all";
}

export async function fetchSortedMods({
	page = 0,
	version = "all",
	modloader = "all",
	search = "",
	sortOrder = "downloads",
	platform = "all",
}: Props): Promise<
	| {
			error: false,
			page: number;
			mods: DatabaseMod[];
			totalMods: number;
			totalPages: number;
	  }
	| {
			error: true;
			message: string;
			status: number;
	  }
> {
	const modsPerPage =
		Number.parseInt(process.env.MODS_PER_PAGE as string) || 50;

	const modsRes = await db.query.mods.findMany();

	const mods = modsRes.map((mod) => ({
		...mod,
		versions: mod.versions as string[],
		categories: mod.categories as string[],
		modloaders: mod.modloaders as Modloaders[],
	}));

	const versions = mods.find((mod) => mod.slug === "create")?.versions || [];

	if (version !== "all" && !versions.includes(version))
		return {
			error: true,
			message: "Invalid version",
			status: 400,
		};

	if (modloader !== "all" && !modLoaders.includes(modloader))
		return {
			error: true,
			message: "Invalid modloader",
			status: 400,
		};

	if (platform !== "all" && !platforms.includes(platform))
		return {
			error: true,
			message: "Invalid platform",
			status: 400,
		};

	const fuse = new Fuse(mods, {
		keys: ["name", "description", "slug", "categories"],
		threshold: 0.4,
	});

	const searchFilteredMods: DatabaseMod[] =
		!search || search === ""
			? mods
			: fuse.search(search).map((result) => result.item);

	const filteredMods = searchFilteredMods.filter((mod) => {
		return (
			(modloader === "all" || mod.modloaders.includes(modloader)) &&
			(version === "all" || mod.versions.includes(version)) &&
			(platform === "all" || mod.platform === platform)
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
		error: false,
		page,
		mods: sortedMods.slice(page * modsPerPage, (page + 1) * modsPerPage),
		totalMods: sortedMods.length,
		totalPages: Math.ceil(sortedMods.length / modsPerPage),
	};
}
