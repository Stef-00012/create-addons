import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { mods } from "@/db/schema";

const client = createClient({ url: "file:data/data.db" });

export default drizzle(client, {
	schema: {
		mods,
	},
});
