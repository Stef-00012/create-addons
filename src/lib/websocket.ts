import type { CreateMessage, UpdateMessage } from "@/types/websocket";
import type { FetchResult } from "@/lib/scheduler";
import type { WebSocketServer } from "ws";

export async function sendWSEvent(wss: WebSocketServer, data: FetchResult) {
	if (data.created.length > 0) {
		const message: CreateMessage = {
			type: "create",
			mods: data.created,
		};

		for (const client of wss.clients) {
			if (client.readyState === client.OPEN) {
				client.send(JSON.stringify(message));
			}
		}
	}

	if (data.updated.length > 0) {
		const message: UpdateMessage = {
			type: "update",
			mods: data.updated,
		};

		for (const client of wss.clients) {
			if (client.readyState === client.OPEN) {
				client.send(JSON.stringify(message));
			}
		}
	}
}
