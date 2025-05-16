import db from "@/db/db";
import ratelimitHandler from "@/middlewares/ratelimit";
import type { NextRequest } from "next/server";

export type APIVersionsResponse = string[];

export async function GET(req: NextRequest) {
	return await ratelimitHandler(req, async (headers: Headers) => {
		const createMod = await db.query.mods.findFirst({
			where: (mods, { eq }) => eq(mods.slug, "create"),
		});

		if (!createMod)
			return Response.json({ error: "Mod not found" }, { status: 500 });

		const versions = (createMod.versions as string[]) || [];

		return Response.json(versions, {
			headers,
		});
	});
}
