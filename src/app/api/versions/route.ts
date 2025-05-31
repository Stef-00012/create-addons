import db from "@/db/db";
import ratelimitHandler from "@/middlewares/ratelimit";
import { or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { mods as modsSchema } from "@/db/schema";

export type APIVersionsResponse = string[];

export async function GET(req: NextRequest) {
	return await ratelimitHandler(req, async (headers: Headers) => {
		const createMod = await db.query.mods.findFirst({
			where:  or(
				sql`json_extract(${modsSchema.modData}, '$.modrinth.slug') = 'create'`,
				sql`json_extract(${modsSchema.modData}, '$.curseforge.slug') = 'create'`,
			),
		});

		if (!createMod)
			return Response.json({ error: "Mod not found" }, { status: 500 });

		const versions = [
			...(createMod.modData.modrinth?.versions || []),
			...(createMod.modData.curseforge?.versions || []),
		]

		return Response.json(versions, {
			headers,
		});
	});
}
