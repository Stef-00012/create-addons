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
	d: unknown;
	t: WSEvents;
}

export interface CreateMessage extends WSmessage {
	d: ModrinthDatabaseMod[];
	t: WSEvents.CREATE;
}

export interface UpdateMessageValues {
	old: ModrinthModDatabaseValues;
	new: ModrinthModDatabaseValues;
}

export interface UpdateMessage extends WSmessage {
	t: WSEvents.UPDATE;
	d: {
		slug: ModrinthDatabaseMod["slug"];
		platform: ModrinthDatabaseMod["platform"];
		changes: Record<ModrinthModDatabaseKeys, UpdateMessageValues>;
	}[];
}

export interface CommandMessage extends WSmessage {
	t: WSEvents.COMMAND;
	d: {
		command: string;
		args: Record<string, number | string>;
	};
}

export interface CommandResponseMessage extends WSmessage {
	t: WSEvents.COMMAND_RESPONSE;
    c: string;
	d: unknown;
}

export interface CommandErrorMessage extends WSmessage {
	t: WSEvents.COMMAND_ERROR;
    c?: string;
	d: {
		message: string;
	};
}
