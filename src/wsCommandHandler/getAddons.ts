import { fetchSortedMods } from "@/functions/fetchSortedMods";
import type { Modloaders, Platforms, SortOrders } from "@/types/addons";
import {
	type CommandResponseMessage,
	WSEvents,
	type CommandMessage,
	type CommandErrorMessage,
} from "@/types/websocket";
import type { WebSocket } from "ws";

interface CommandArgs {
	page?: number;
	version?: string | "all";
	modloader?: Modloaders | "all";
	search?: string;
	sortOrder?: SortOrders;
	platform?: Platforms;
}

export default async function getMods(
	ws: WebSocket,
	command: string,
	args?: CommandMessage["data"]["args"] & CommandArgs,
) {
	const {
		page = 0,
		version = "all",
		modloader = "all",
		search = "",
		sortOrder = "downloads",
		platform = "all",
	} = args || {};

	if (page < 0) {
		const error: CommandErrorMessage = {
			type: WSEvents.COMMAND_ERROR,
			command: command,
			data: {
				message: "Page must be greater than 0",
			},
		};

		return ws.send(JSON.stringify(error));
	}

	const res = await fetchSortedMods({
		page,
		version,
		modloader,
		search,
		sortOrder,
		platform,
	});

	if (res.error) {
		const error: CommandErrorMessage = {
			type: WSEvents.COMMAND_ERROR,
			data: {
				message: res.message,
			},
		};

		return ws.send(JSON.stringify(error));
	}

	const response: CommandResponseMessage = {
		type: WSEvents.COMMAND_RESPONSE,
		command: command,
		data: res,
	};

	return ws.send(JSON.stringify(response));
}
