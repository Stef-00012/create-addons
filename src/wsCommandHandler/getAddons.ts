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

export default async function getMods(ws: WebSocket, command: string, args?: CommandMessage["data"]["args"] & CommandArgs) {
    const {
        page = 0,
        version = "all",
        modloader = "all",
        search = "",
        sortOrder = "downloads",
    } = (args || {});

    if (page < 0) {
        const error: CommandErrorMessage = {
            type: WSEvents.COMMAND_ERROR,
            command: command,
            data: {
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
        type: WSEvents.COMMAND_RESPONSE,
        command: command,
        data: res
    }

    return ws.send(JSON.stringify(response));
}