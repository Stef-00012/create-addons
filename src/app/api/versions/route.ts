import db from "@/db/db";

export type APIVersionsResponse = string[];

export async function GET() {
	const createMod = await db.query.mods.findFirst({
		where: (mods, { eq }) => eq(mods.slug, "create"),
	});

	if (!createMod)
		return Response.json({ error: "Mod not found" }, { status: 500 });

	const versions = (createMod.versions as string[]) || [];

	return Response.json(versions);
}
