import db from "@/db/db";
import ratelimitHandler from "@/middlewares/ratelimit";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { mods as modsSchema } from "@/db/schema";
import type { DatabaseMod, Platforms } from "@/types/addons";

export type APIModResponse = DatabaseMod;

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	return await ratelimitHandler(req, async (headers: Headers) => {
		const url = new URL(req.url);
		const { slug } = await params;

		const platform = ((url.searchParams.get("platform")) || null) as Platforms | null;

		const mod = platform
			? await db.query.mods.findMany({
				where: and(
					eq(modsSchema.slug, slug),
					eq(modsSchema.platform, platform)
				),
			})
			: await db.query.mods.findMany({
				where: eq(modsSchema.slug, slug),
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
