import db from "@/db/db";
import ratelimitHandler from "@/middlewares/ratelimit";
import type { ModrinthDatabaseMod } from "@/types/modrinth";
import Fuse from "fuse.js";
import type { NextRequest } from "next/server";
import { fetchSortedMods } from "@/functions/fetchSortedMods";

export type APIModsResponse = {
	page: number;
	mods: ModrinthDatabaseMod[];
	totalMods: number;
	totalPages: number;
};

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

		const res = await fetchSortedMods({
		    page,
		    version,
		    modloader,
		    search,
		    sortOrder,
		})

		return Response.json(
			res,
			{
				headers,
			},
		);
	});
}
