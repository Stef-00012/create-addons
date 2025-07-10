import db from "@/db/db";
import ratelimitHandler from "@/middlewares/ratelimit";
import { sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { mods as modsSchema } from "@/db/schema";
import type { Platforms } from "@/types/addons";
import { platforms } from "@/constants/loaders";
import Fuse from "fuse.js";

export type APIModResponse = ModsResult[];

type ModsResult = {
	name: string;
	slug: string;
}

export async function GET(
	req: NextRequest,
) {
	return await ratelimitHandler(req, async (headers: Headers) => {
		const url = new URL(req.url);

		const platform = ((url.searchParams.get("platform")) || null) as Platforms | null;
		const query = ((url.searchParams.get("query")) || null) as string | null;

		if (!platform || !platforms.includes(platform)) return Response.json(
			{ error: "Invalid platform" },
			{ status: 400 },
		)

		const mods = (await db.query.mods.findMany({
			where: sql`EXISTS (
				SELECT 1 FROM json_each(${modsSchema.platforms})
				WHERE json_each.value = ${platform}
			)`,
		})).map(mod => ({
			name: mod.modData[platform]?.name,
			slug: mod.modData[platform]?.slug,
		}) as ModsResult);

		if (mods.length <= 0) return Response.json([]);

		if (!query) return Response.json(mods)

		const fuse = new Fuse(mods, {
			keys: ["name", "slug"],
			threshold: 0.4,
			ignoreLocation: true,
		});

		const filteredMods = fuse.search(query).map(result => result.item);

		return Response.json(filteredMods, {
			headers,
		});
	}, "/api/addons/autocomplete");
}
