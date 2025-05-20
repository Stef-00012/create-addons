import { type CommandResponseMessage, WSEvents, type CommandMessage, type CommandErrorMessage } from "@/types/websocket";
import type { WebSocket } from "ws";
import db from "@/db/db";
import { mods as modsSchema } from "@/db/schema";
import { eq } from "drizzle-orm";

interface CommandArgs {
    slug?: string;
}

export default async function getMod(ws: WebSocket, command: string, args?: CommandMessage["d"]["args"] & CommandArgs) {
    const { slug } = (args || {});

    if (!slug) {
        const error: CommandErrorMessage = {
            t: WSEvents.COMMAND_ERROR,
            c: command,
            d: {
                message: "Slug is required",
            }
        }

        return ws.send(JSON.stringify(error));
    }
        

    const mod = await db.query.mods.findFirst({
        where: eq(modsSchema.slug, slug),
    });

    if (!mod) {
        const error: CommandErrorMessage = {
            t: WSEvents.COMMAND_ERROR,
            c: command,
            d: {
                message: `Mod "${slug}" not found`,
            }
        }

        return ws.send(JSON.stringify(error));
    }

    const response: CommandResponseMessage = {
        t: WSEvents.COMMAND_RESPONSE,
        c: command,
        d: mod
    }

    return ws.send(JSON.stringify(response))
}