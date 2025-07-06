import type {
	DatabaseMod,
	DatabaseModData,
	ModDataDatabaseKeys,
	ModDataDatabaseValues,
	Platforms,
} from "@/types/addons";

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
	data: DatabaseMod[];
	type: WSEvents.CREATE;
}

export interface UpdateMessageValues {
	old: ModDataDatabaseValues;
	new: ModDataDatabaseValues;
}

export type UpdateMessageDataChanges = Partial<
	Record<
		ModDataDatabaseKeys,
		{ old: ModDataDatabaseValues | null; new: ModDataDatabaseValues | null }
	>
> | null;

export interface UpdateMessage extends WSmessage {
	type: WSEvents.UPDATE;
	data: {
		slugs: Record<Platforms, DatabaseModData["slug"] | null>;
		icons: Record<Platforms, DatabaseModData["icon"] | null>;
		names: Record<Platforms, DatabaseModData["name"] | null>;
		platforms: DatabaseMod["platforms"];
		changes: Record<Platforms, UpdateMessageDataChanges>;
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
