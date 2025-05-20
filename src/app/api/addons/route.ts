import ratelimitHandler from "@/middlewares/ratelimit";
import type { ModrinthDatabaseMod } from "@/types/modrinth";
import type { NextRequest } from "next/server";
import { fetchSortedMods } from "@/functions/fetchSortedMods";
import type {
    Modloaders,
    SortOrders
} from "@/types/modrinth"

export type APIModsResponse = {
	page: number;
	mods: ModrinthDatabaseMod[];
	totalMods: number;
	totalPages: number;
};

export async function GET(req: NextRequest) {
	return await ratelimitHandler(req, async (headers: Headers) => {
		const url = new URL(req.url);
		
		const page = Number.parseInt(url.searchParams.get("page") || "0") || 0;

		if (page < 0)
			return Response.json(
				{ error: "Page must be greater than 0" },
				{ status: 400 },
			);

		const version = (url.searchParams.get("version") || "all") as string;
		const modloader = (url.searchParams.get("modloader") || "all") as Modloaders | "all";
		const search = (url.searchParams.get("search") || "") as string;
		const sortOrder = (url.searchParams.get("sort") || "downloads") as SortOrders;

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
