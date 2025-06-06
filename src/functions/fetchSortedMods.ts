import db from "@/db/db";
import Fuse from "fuse.js";

import { modLoaders, platforms } from "@/constants/loaders";
import type {
	DatabaseMod,
	Modloaders,
	Platforms,
	SortOrders,
} from "@/types/addons";

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
			error: false;
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

	const modsRes = await db.query.mods.findMany({
		columns: {
			id: false,
		},
	});

	const mods = modsRes.map((mod) => ({
		...mod,
		platforms: mod.platforms,
	}));

	const createMod = mods.find(
		(mod) =>
			(mod.modData.modrinth?.slug || mod.modData.curseforge?.slug) === "create",
	);

	const versions = [
		...(createMod?.modData.modrinth?.versions || []),
		...(createMod?.modData.curseforge?.versions || []),
	];

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

	const searchKeys = ["name", "description", "slug", "categories"];

	const fuse = new Fuse(mods, {
		keys: searchKeys.flatMap((key) =>
			platforms.map((platform) => `modData.${platform}.${key}`),
		),
		threshold: 0.4,
		ignoreLocation: true,
	});

	const searchFilteredMods =
		!search || search === ""
			? mods
			: fuse.search(search).map((result) => result.item);

	const filteredMods = searchFilteredMods.filter((mod) => {
		const modloaders =
			platform === "all"
				? [
						...(mod.modData.modrinth?.modloaders || []),
						...(mod.modData.curseforge?.modloaders || []),
					]
				: mod.modData[platform]?.modloaders || ([] as Modloaders[]);

		const versions =
			platform === "all"
				? [
						...(mod.modData.modrinth?.versions || []),
						...(mod.modData.curseforge?.versions || []),
					]
				: mod.modData[platform]?.versions || [];

		return (
			(modloader === "all" || modloaders.includes(modloader)) &&
			(version === "all" || versions.includes(version)) &&
			(platform === "all" || mod.platforms.includes(platform))
		);
	});

	const sortedMods = filteredMods.sort((_a, _b) => {
		if (sortOrder === "downloads") {
			const a =
				(_a.modData.modrinth?.downloads || 0) +
				(_a.modData.curseforge?.downloads || 0);
			const b =
				(_b.modData.modrinth?.downloads || 0) +
				(_b.modData.curseforge?.downloads || 0);

			return b - a;
		}

		if (sortOrder === "followers") {
			const a =
				(_a.modData.modrinth?.follows || 0) +
				(_a.modData.curseforge?.follows || 0);
			const b =
				(_b.modData.modrinth?.follows || 0) +
				(_b.modData.curseforge?.follows || 0);

			return b - a;
		}

		if (sortOrder === "lastUpdated") {
			const a =
				new Date(_a.modData.modrinth?.modified || 0) >
				new Date(_a.modData.curseforge?.modified || 0)
					? _a.modData.modrinth?.modified
					: _a.modData.curseforge?.modified;

			const b =
				new Date(_b.modData.modrinth?.modified || 0) >
				new Date(_b.modData.curseforge?.modified || 0)
					? _b.modData.modrinth?.modified
					: _b.modData.curseforge?.modified;

			return new Date(b || 0).getTime() - new Date(a || 0).getTime();
		}

		if (sortOrder === "created") {
			const a =
				new Date(_a.modData.modrinth?.created || 0) >
				new Date(_a.modData.curseforge?.created || 0)
					? _a.modData.modrinth?.created
					: _a.modData.curseforge?.created;

			const b =
				new Date(_b.modData.modrinth?.created || 0) >
				new Date(_b.modData.curseforge?.created || 0)
					? _b.modData.modrinth?.created
					: _b.modData.curseforge?.created;

			return new Date(b || 0).getTime() - new Date(a || 0).getTime();
		}

		if (sortOrder === "name") {
			// biome-ignore lint/style/noNonNullAssertion: atleast one of them is always present
			const a = (_a.modData.modrinth?.name || _a.modData.curseforge?.name)!;
			// biome-ignore lint/style/noNonNullAssertion: atleast one of them is always present
			const b = (_b.modData.modrinth?.name || _b.modData.curseforge?.name)!;

			return a.localeCompare(b);
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
