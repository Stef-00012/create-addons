import type { ModrinthDatabaseMod, ModrinthModDatabaseKeys, ModrinthModDatabaseValues } from "@/types/modrinth";

export type Messages = CreateMessage | UpdateMessage;

export interface CreateMessage {
    mods: ModrinthDatabaseMod[];
    type: "create";
}

export interface UpdateMessageValues {
    old: ModrinthModDatabaseValues,
    new: ModrinthModDatabaseValues
}

export interface UpdateMessage {
    type: "update";
    mods: {
        slug: ModrinthDatabaseMod["slug"],
        platform: ModrinthDatabaseMod["platform"],
        changes: Record<ModrinthModDatabaseKeys, UpdateMessageValues>
    }[];
}