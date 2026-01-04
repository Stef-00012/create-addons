import ratelimitHandler from "@/middlewares/ratelimit";
import type {
	DatabaseMod,
	Modloaders,
	Platforms,
	SortOrders,
} from "@/types/addons";
import type { NextRequest } from "next/server";
import { fetchSortedMods } from "@/functions/fetchSortedMods";

export type APIModsResponse = {
	page: number;
	mods: DatabaseMod[];
	totalMods: number;
	totalPages: number;
};

export async function GET(req: NextRequest) {
	return await ratelimitHandler(req, async (headers: Headers) => {
		const url = new URL(req.url);

		const page = Number.parseInt(url.searchParams.get("page") || "0", 10) || 0;

		if (page < 0)
			return Response.json(
				{ error: "Page must be greater than 0" },
				{ status: 400 },
			);

		const version = (url.searchParams.get("version") || "all") as string;
		const modloader = (url.searchParams.get("modloader") || "all") as
			| Modloaders
			| "all";
		const search = (url.searchParams.get("search") || "") as string;
		const sortOrder = (url.searchParams.get("sort") ||
			"downloads") as SortOrders;
		const platform = (url.searchParams.get("platform") || "all") as
			| Platforms
			| "all";
		const createVersion =
			url.searchParams.get("createVersion") === "1" ||
			url.searchParams.get("createVersion") === "true";

		const res = await fetchSortedMods({
			page,
			version,
			modloader,
			search,
			sortOrder,
			platform,
			createVersion,
		});

		if (res.error)
			return Response.json({ error: res.message }, { status: res.status });

		return Response.json(res, {
			headers,
		});
	});
}
