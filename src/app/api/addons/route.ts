import db from "@/db/db";

type ResponseData = ({
    platform: string,
	slug: string,
	author: string,
	downloads: number,
	description: string,
	icon: string,
	name: string,
	version: string,
	versions: string[],
    categories: string[],
    follows: number,
})[]

export async function GET(
    req: Request
) {
	const mods = await db.query.mods.findMany()
	
	const formattedMods = mods.map(mod => ({
		...mod,
		versions: JSON.parse(mod.versions as string),
		categories: JSON.parse(mod.categories as string),
	}))
    
    return Response.json(formattedMods);
}