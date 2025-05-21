import type {
	ModrinthDatabaseMod,
	ModrinthModDatabaseKeys,
	ModrinthModDatabaseValues,
} from "@/types/modrinth";

export type Messages = CreateMessage | UpdateMessage;

export enum WSEvents {
	PING = 0, // server to client only
	PONG = 1, // client to server only
	CREATE = 2, // server to client only
	UPDATE = 3, // server to client only
	COMMAND = 4, // client to server only
	COMMAND_RESPONSE = 5, // server to client only
	COMMAND_ERROR = 6, // server to client only
}

export interface WSmessage {
	data: unknown;
	type: WSEvents;
}

export interface PingMessage extends Omit<WSmessage, "data"> {
	type: WSEvents.PING;
}

export interface PongMessage extends Omit<WSmessage, "data"> {
	type: WSEvents.PONG;
}

export interface CreateMessage extends WSmessage {
	data: ModrinthDatabaseMod[];
	type: WSEvents.CREATE;
}

export interface UpdateMessageValues {
	old: ModrinthModDatabaseValues;
	new: ModrinthModDatabaseValues;
}

export interface UpdateMessage extends WSmessage {
	type: WSEvents.UPDATE;
	data: {
		slug: ModrinthDatabaseMod["slug"];
		platform: ModrinthDatabaseMod["platform"];
		name: ModrinthDatabaseMod["name"];
		changes: Record<ModrinthModDatabaseKeys, UpdateMessageValues>;
	}[];
}

export interface CommandMessage extends WSmessage {
	type: WSEvents.COMMAND;
	data: {
		command: string;
		args: Record<string, number | string>;
	};
}

export interface CommandResponseMessage extends WSmessage {
	type: WSEvents.COMMAND_RESPONSE;
    command: string;
	data: unknown;
}

export interface CommandErrorMessage extends WSmessage {
	type: WSEvents.COMMAND_ERROR;
    command?: string;
	data: {
		message: string;
	};
}
