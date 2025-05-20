import type {
	ModrinthDatabaseMod,
	ModrinthModDatabaseKeys,
	ModrinthModDatabaseValues,
} from "@/types/modrinth";

export type Messages = CreateMessage | UpdateMessage;

export enum WSEvents {
	CREATE = 1, // receive only
	UPDATE = 2, // receive only
	COMMAND = 3, // send only
	COMMAND_RESPONSE = 4, // receive only
	COMMAND_ERROR = 5, // receive only
}

export interface WSmessage {
	data: unknown;
	type: WSEvents;
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
