import { fetchSortedMods } from "@/functions/fetchSortedMods";
import type { Modloaders, SortOrders } from "@/types/modrinth";
import { type CommandResponseMessage, WSEvents, type CommandMessage, type CommandErrorMessage } from "@/types/websocket";
import type { WebSocket } from "ws";

interface CommandArgs {
    page?: number;
    version?: string | "all";
    modloader?: Modloaders | "all";
    search?: string;
    sortOrder?: SortOrders;
}

export default async function getMods(ws: WebSocket, command: string, args?: CommandMessage["d"]["args"] & CommandArgs) {
    const {
        page = 0,
        version = "all",
        modloader = "all",
        search = "",
        sortOrder = "downloads",
    } = (args || {});

    if (page < 0) {
        const error: CommandErrorMessage = {
            t: WSEvents.COMMAND_ERROR,
            c: command,
            d: {
                message: "Page must be greater than 0",
            }
        }

        return ws.send(JSON.stringify(error));
    }

    const res = await fetchSortedMods({
        page,
        version,
        modloader,
        search,
        sortOrder
    })

    const response: CommandResponseMessage = {
        t: WSEvents.COMMAND_RESPONSE,
        c: command,
        d: res
    }

    return ws.send(JSON.stringify(response));
}