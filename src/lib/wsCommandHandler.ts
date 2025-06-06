import {
	type CommandErrorMessage,
	WSEvents,
	type CommandMessage,
} from "@/types/websocket";
import type { WebSocket } from "ws";

import getAddon from "@/wsCommandHandler/getAddon";
import getAddons from "@/wsCommandHandler/getAddons";

const handlers = {
	getAddon,
	getAddons,
};

type Props = Omit<CommandMessage["data"], "args"> & {
	args?: CommandMessage["data"]["args"];
	ws: WebSocket;
};

export async function wsCommandHandler({
	ws,
	command,
	args,
}: Props): Promise<unknown> {
	if (command in handlers) {
		const handler = handlers[command as keyof typeof handlers];

		try {
			return await handler(ws, command, args);
		} catch (e) {
			console.error(
				`\x1b[31mWebsocket command error (command: \x1b[0;1m${command}\x1b[0;31m):\x1b[1m`,
				e,
				"\x1b[0m",
			);

			const error: CommandErrorMessage = {
				type: WSEvents.COMMAND_ERROR,
				command: command,
				data: {
					message: "Something went wrong",
				},
			};

			ws.send(JSON.stringify(error));

			return;
		}
	}

	const error: CommandErrorMessage = {
		type: WSEvents.COMMAND_ERROR,
		command: command,
		data: {
			message: "Command not found",
		},
	};

	ws.send(JSON.stringify(error));

	return;
}
