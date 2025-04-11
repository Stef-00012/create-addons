import type { NextApiRequest, NextApiResponse } from 'next'
import type { ModrinthSearchResponse } from "@/types/modrinth";
import db from "@/db/db";
 
type ResponseData = {
    platform: "modrinth" | "curseforge",
    id: string,
	slug: string,
	author: string,
	downloads: number,
	description: string,
	icon: string,
	name: string,
	version: string,
// 	versions: text("versions", { mode: "json" }).notNull(),
//     categories: text("categories", { mode: "json" }).notNull(),
    follows: number,
}
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
//   res.status(200).json({ message: 'Hello from Next.js!' })

    const mods = await db.query.mods.findMany()
    
    return res.status(200).json(mods);
}