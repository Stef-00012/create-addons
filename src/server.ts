import { handleFetching } from "@/lib/scheduler";
import { sendWSEvent } from "@/lib/websocket";
import schedule from "node-schedule";
import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import {
	type CommandErrorMessage,
	type CommandMessage,
	type PingMessage,
	WSEvents,
	type WSmessage,
} from "@/types/websocket";
import { wsCommandHandler } from "./lib/wsCommandHandler";

const port = Number.parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

const app = next({
	dev,
});

declare module "ws" {
	interface WebSocket {
		isAlive: boolean;
	}
}

const handle = app.getRequestHandler();

app.prepare().then(async () => {
	const server = createServer((req, res) => {
		if (!req.url) {
			res.statusCode = 400;
			res.end("Bad Request: URL is missing");

			return;
		}

		const parsedUrl = parse(req.url, true);
		handle(req, res, parsedUrl);
	});

	const wss = new WebSocketServer({
		noServer: true,
	});

	server.on("upgrade", (req, socket, head) => {
		switch (true) {
			case req.url === "/ws": {
				wss.handleUpgrade(req, socket, head, (ws) => {
					wss.emit("connection", ws, req);
				});

				break;
			}

			case req.url?.startsWith("/_next"): {
				return;
			}

			default: {
				socket.destroy();

				break;
			}
		}
	});

	wss.on("connection", (ws) => {
		ws.isAlive = true;

		ws.on("error", console.error);

		ws.on("message", (data) => {
			try {
				const message = JSON.parse(data.toString()) as WSmessage;

				if (message.type === WSEvents.PONG) {
					ws.isAlive = true;
				}

				if (message.type === WSEvents.COMMAND) {
					const commandData = message.data as CommandMessage["data"];

					const command = commandData.command;
					const args = commandData.args;

					wsCommandHandler({
						ws,
						command,
						args,
					});
				}
				//eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (e) {
				const error: CommandErrorMessage = {
					type: WSEvents.COMMAND_ERROR,
					data: {
						message: "Invalid JSON",
					},
				};

				ws.send(JSON.stringify(error));
			}
		});
	});

	const interval = setInterval(function ping() {
		for (const ws of wss.clients) {
			if (!ws.isAlive) {
				try {
					ws.terminate();
					//eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (e) {
					ws.close();
				}

				continue;
			}

			ws.isAlive = false;

			const message: PingMessage = {
				type: WSEvents.PING,
			};

			ws.send(JSON.stringify(message));
		}
	}, 30000);

	wss.on("close", function close() {
		clearInterval(interval);
	});

	server.listen(port, () => {
		console.info(
			`> \x1b[32mServer listening at \x1b[0;1mhttp://localhost:${port}\n\x1b[0m> \x1b[32mWebSocket listening at \x1b[0;1mws://localhost:${port}/ws\n\x1b[0m> \x1b[33mMode: \x1b[0;1m${dev ? "development" : process.env.NODE_ENV}\x1b[0m`,
		);
	});

	if (process.env.NODE_ENV === "production") {
		console.info(
			`\x1b[33m[\x1b[1m${new Date().toISOString()}\x1b[0;33m] \x1b[34mStarted fetching the mods from Modrinth\x1b[0m`,
		);

		const changedData = await handleFetching();

		sendWSEvent(wss, changedData);

		const cronJobInterval =
			process.env.MODS_FETCH_CRON_INTERVAL || "0 */3 * * *";

		schedule.scheduleJob(cronJobInterval, async () => {
			console.info(
				`\x1b[33m[\x1b[1m${new Date().toISOString()}\x1b[0;33m] \x1b[34mStarted fetching the mods from Modrinth\x1b[0m`,
			);

			const changedData = await handleFetching();

			sendWSEvent(wss, changedData);
		});
	} else {
		console.info("\x1b[31mFetching is not started in development mode\x1b[0m");
	}
});
