import { type CommandResponseMessage, WSEvents, type CommandMessage, type CommandErrorMessage } from "@/types/websocket";
import type { WebSocket } from "ws";
import db from "@/db/db";
import { mods as modsSchema } from "@/db/schema";
import { eq } from "drizzle-orm";

interface CommandArgs {
    slug?: string;
}

export default async function getMod(ws: WebSocket, command: string, args?: CommandMessage["data"]["args"] & CommandArgs) {
    const { slug } = (args || {});

    if (!slug) {
        const error: CommandErrorMessage = {
            type: WSEvents.COMMAND_ERROR,
            command: command,
            data: {
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
            type: WSEvents.COMMAND_ERROR,
            command: command,
            data: {
                message: `Mod "${slug}" not found`,
            }
        }

        return ws.send(JSON.stringify(error));
    }

    const response: CommandResponseMessage = {
        type: WSEvents.COMMAND_RESPONSE,
        command: command,
        data: mod
    }

    return ws.send(JSON.stringify(response))
}