import db from "@/db/db";
import ratelimitHandler from "@/middlewares/ratelimit";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { mods as modsSchema } from "@/db/schema";
import type { ModrinthDatabaseMod } from "@/types/modrinth";

export type APIModResponse = ModrinthDatabaseMod;

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
) {
	return await ratelimitHandler(req, async (headers: Headers) => {
		const { slug } = await params;

		const mod = await db.query.mods.findFirst({
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
