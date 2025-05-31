import { type CommandResponseMessage, WSEvents, type CommandMessage, type CommandErrorMessage } from "@/types/websocket";
import type { WebSocket } from "ws";
import db from "@/db/db";
import { mods as modsSchema } from "@/db/schema";
import { or, sql } from "drizzle-orm";
import type { Platforms } from "@/types/addons";
import { platforms } from "@/constants/loaders";

interface CommandArgs {
    slug?: string;
    platform?: Platforms;
}

export default async function getMod(ws: WebSocket, command: string, args?: CommandMessage["data"]["args"] & CommandArgs) {
    const { slug, platform } = (args || {});

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

    if (platform && !platforms.includes(platform)) {
        const error: CommandErrorMessage = {
            type: WSEvents.COMMAND_ERROR,
            command: command,
            data: {
                message: "Invalid platform",
            }
        }

        return ws.send(JSON.stringify(error));
    }

    const mod = platform
        ? await db.query.mods.findFirst({
            where: sql`json_extract(${modsSchema.modData}, '$.${platform}.slug') = ${slug}`,
            columns: {
                id: false
            }
        })
        : await db.query.mods.findFirst({
            where: or(
                sql`json_extract(${modsSchema.modData}, '$.modrinth.slug') = ${slug}`,
                sql`json_extract(${modsSchema.modData}, '$.curseforge.slug') = ${slug}`,
            ),
            columns: {
                id: false
            }
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