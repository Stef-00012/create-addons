import type { NextApiRequest, NextApiResponse } from 'next'
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
// 	versions: text("versions", { mode: "json" }).notNull(),
//     categories: text("categories", { mode: "json" }).notNull(),
    follows: number,
})[]

export async function GET(
    req: Request,
    res: NextApiResponse<ResponseData>
) {
//   res.status(200).json({ message: 'Hello from Next.js!' })

    const mods = await db.query.mods.findMany()
	console.log(mods)
    
    return Response.json(mods);
}