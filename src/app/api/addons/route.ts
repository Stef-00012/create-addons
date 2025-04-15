import db from "@/db/db";
import ratelimitHandler from "@/middlewares/ratelimit";
import Fuse from "fuse.js";
import type { NextRequest } from "next/server";

export type APIMod = {
	platform: string;
	slug: string;
	author: string;
	downloads: number;
	description: string;
	icon: string;
	name: string;
	version: string;
	modloaders: (
		| "quilt"
		| "fabric"
		| "forge"
		| "neoforge"
		| "liteloader"
		| "modloader"
		| "rift"
	)[];
	versions: string[];
	categories: string[];
	follows: number;
	created: string;
	modified: string;
	color: number;
	license: string;
	clientSide: string;
	serverSide: string;
};

export type APIModsResponse = {
	page: number;
	mods: APIMod[];
	totalMods: number;
	totalPages: number;
};

export type SortByType =
	| "name"
	| "downloads"
	| "followers"
	| "lastUpdated"
	| "created";

export async function GET(req: NextRequest) {
	return await ratelimitHandler(req, async (headers: Headers) => {
		const url = new URL(req.url);
		const modsPerPage =
			Number.parseInt(process.env.MODS_PER_PAGE as string) || 50;

		const page = Number.parseInt(url.searchParams.get("page") || "0") || 0;

		if (page < 0)
			return Response.json(
				{ error: "Page must be greater than 0" },
				{ status: 400 },
			);

		const version = url.searchParams.get("version") || "all";
		const modloader = url.searchParams.get("modloader") || "all";
		const search = url.searchParams.get("search") || "";
		const sortOrder = url.searchParams.get("sort") || "downloads";

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

		return Response.json(
			{
				page,
				mods: sortedMods.slice(page * modsPerPage, (page + 1) * modsPerPage),
				totalMods: sortedMods.length,
				totalPages: Math.ceil(sortedMods.length / modsPerPage),
			},
			{
				headers,
			},
		);
	});
}
