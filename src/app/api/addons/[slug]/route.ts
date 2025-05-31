import db from "@/db/db";
import ratelimitHandler from "@/middlewares/ratelimit";
import { or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { mods as modsSchema } from "@/db/schema";
import type { DatabaseMod, Platforms } from "@/types/addons";
import { platforms } from "@/constants/loaders";

export type APIModResponse = DatabaseMod;

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	return await ratelimitHandler(req, async (headers: Headers) => {
		const url = new URL(req.url);
		const { slug } = await params;

		const platform = ((url.searchParams.get("platform")) || null) as Platforms | null;

		if (platform && !platforms.includes(platform)) return Response.json(
			{ error: "Invalid platform" },
			{ status: 400 },
		)

		const mod = platform
			? await db.query.mods.findFirst({
				where: sql`json_extract(${modsSchema.modData}, '$.modData.${platform}.slug') = ${slug}`,
			})
			: await db.query.mods.findFirst({
				where: or(
					sql`json_extract(${modsSchema.modData}, '$.modData.modrinth.slug') = ${slug}`,
					sql`json_extract(${modsSchema.modData}, '$.modData.curseforge.slug') = ${slug}`,
				)
			});

		if (!mod)
			return Response.json(
				{ error: `Mod "${slug}" not found` },
				{ status: 404 },
			);

		return Response.json(mod, {
			headers,
		});
	});
}
