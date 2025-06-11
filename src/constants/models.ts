import type { ModelTableProps } from "@/components/docs/ModelTable";

export const tableHeader = ["Property", "Type", "Description"];
export const addonModelRows: ModelTableProps["rows"] = [
	{
		name: "platforms",
		type: '("modrinth" | "curseforge")[]',
		description: "The platforms where the addon is available.",
	},
	{
		name: "modData",
		type: "ModData",
		description: "An object containing the mod data for each platform.",
		url: "#ModData",
	},
];

export const modDataModelRows: ModelTableProps["rows"] = [
	{
		name: "modrinth?",
		type: "AddonData",
		url: "#AddonData",
		description: "The mod data for the Modrinth platform.",
	},
	{
		name: "curseforge?",
		type: "AddonData",
		url: "#AddonData",
		description: "The mod data for the Curseforge platform.",
	},
];

export const addonDataModelRows: ModelTableProps["rows"] = [
	{
		name: "name",
		type: "string",
		description: "The display name of the addon.",
	},
	{
		name: "modloaders",
		type: '("quilt" | "fabric" | "forge" | "neoforge" | "liteloader" | "modloader" | "rift" | "cauldron" | "any")[]',
		description: "A list of supported modloaders for the addon.",
	},
	{
		name: "description",
		type: "string",
		description: "A short description of the addon.",
	},
	{
		name: "clientSide",
		type: '"unknown" | "required" | "optional" | "unsupported"',
		description: "Client-side support type for the addon.",
	},
	{
		name: "serverSide",
		type: '"unknown" | "required" | "optional" | "unsupported"',
		description: "Server-side support type for the addon.",
	},
	{
		name: "slug",
		type: "string",
		description: "The unique slug identifier for the addon.",
	},
	{
		name: "versions",
		type: "string[]",
		description: "A list of all available versions for the addon.",
	},
	{
		name: "version",
		type: "string",
		description: "The current version of the addon.",
	},
	{
		name: "icon",
		type: "string",
		description: "A URL to the addon's icon.",
	},
	{
		name: "authors",
		type: "AddonAuthor[]",
		description: "A list of authors for the addon.",
		url: "#AddonAuthor",
	},
	{
		name: "created",
		type: "string",
		description: "The creation date of the addon (ISO format).",
	},
	{
		name: "modified",
		type: "string",
		description: "The last modified date of the addon (ISO format).",
	},
	{
		name: "categories",
		type: "string[]",
		description: "A list of categories the addon belongs to.",
	},
	{
		name: "license",
		type: "string",
		description: "The license under which the addon is distributed.",
	},
	{
		name: "downloads",
		type: "number",
		description: "The number of times the addon has been downloaded.",
	},
	{
		name: "follows",
		type: "number",
		description: "The number of users following the addon.",
	},
	{
		name: "color",
		type: "number",
		description: "A numeric color value associated with the addon.",
	},
	{
		name: "id",
		type: "string",
		description: "The unique identifier for the addon.",
	},
];

export const addonAuthorModelRows: ModelTableProps["rows"] = [
	{
		name: "name",
		type: "string",
		description: "The name of the author.",
	},
	{
		name: "url",
		type: "string",
		description: "A URL to the author's profile.",
	},
];

export const apiAddonsQueryModelRows: ModelTableProps["rows"] = [
	{
		name: "page?",
		type: "number",
		description: "The page number for pagination.",
	},
	{
		name: "version?",
		type: '"all" | string',
		description: "The Minecraft version to filter addons by.",
	},
	{
		name: "modloader?",
		type: '"all" | "quilt" | "fabric" | "forge" | "neoforge" | "liteloader" | "modloader" | "rift" | "cauldron" | "any"',
		description: "The modloader to filter addons by.",
	},
	{
		name: "search?",
		type: "string",
		description:
			"A search term to filter addons by name, description, slug or categories.",
	},
	{
		name: "sort?",
		type: '"downloads" | "name" | "created" | "followers" | "lastUpdated"',
		description: "The sorting order for the results.",
	},
	{
		name: "platform?",
		type: '"all" | "modrinth" | "curseforge"',
		description:
			"The platform to filter addons by (e.g., Modrinth, Curseforge).",
	},
];

export const apiAddonsResponseModelRows: ModelTableProps["rows"] = [
	{
		name: "error",
		type: "false",
		description: "Indicates if there was an error.",
	},
	{
		name: "page",
		type: "number",
		description: "The current page number of the results.",
	},
	{
		name: "totalMods",
		type: "number",
		description: "The total number of mods available matching the query.",
	},
	{
		name: "totalPages",
		type: "number",
		description: "The total number of pages available matching the query.",
	},
	{
		name: "mods",
		type: "Addon[]",
		description: "An array of addons matching the query.",
		url: "/docs/models/addon#Addon",
	},
];

export const apiAddonsError400ModelRows: ModelTableProps["rows"] = [
	{
		name: "error",
		type: "string",
		description: "An invalid query was provided.",
	},
];

export const apiAddonsSlugParamsModelRows: ModelTableProps["rows"] = [
	{
		name: "slug",
		type: "string",
		description: "The unique slug identifier for the addon.",
	},
];

export const apiAddonsSlugQueryModelRows: ModelTableProps["rows"] = [
	{
		name: "platform?",
		type: '"modrinth" | "curseforge"',
		description: "The platform to filter the addon by.",
	},
];

export const apiAddonsSlugError400ModelRows: ModelTableProps["rows"] = [
	{
		name: "error",
		type: "string",
		description: "An invalid query or params were provided.",
	},
];

export const apiAddonsSlugError404ModelRows: ModelTableProps["rows"] = [
	{
		name: "error",
		type: "string",
		description: "The provided slug does not exist.",
	},
];

export const defaultWebSocketMessageRows: ModelTableProps["rows"] = [
	{
		name: "type",
		type: "number",
		description:
			"The type of the WebSocket message, indicating the event (see above or each message's page to get its the type's number).",
	},
	{
		name: "data",
		type: "unknown",
		description:
			"The data associated with the WebSocket message, which varies based on the type of message.",
	},
];

export const websocketPingMessageRows: ModelTableProps["rows"] = [
	{
		name: "type",
		type: "0",
		description: "The type of the WebSocket message, indicating a ping event.",
	},
	{
		name: "data?",
		type: "null",
		description: "No data is sent with a ping message.",
	},
];

export const websocketPongMessageRows: ModelTableProps["rows"] = [
	{
		name: "type",
		type: "1",
		description: "The type of the WebSocket message, indicating a pong event.",
	},
	{
		name: "data?",
		type: "null",
		description: "No data is sent with a pong message.",
	},
];

export const websocketCreateMessageRows: ModelTableProps["rows"] = [
	{
		name: "type",
		type: "2",
		description:
			"The type of the WebSocket message, indicating a create event.",
	},
	{
		name: "data",
		type: "Addon[]",
		description: "An array of newly added addons.",
		url: "/docs/models/addon#Addon",
	},
];

export const websocketUpdateMessageRows: ModelTableProps["rows"] = [
	{
		name: "type",
		type: "3",
		description:
			"The type of the WebSocket message, indicating an update event.",
	},
	{
		name: "data",
		type: "UpdateMessageData[]",
		description:
			"An array of objects containing the updated addons and their previous versions.",
		url: "/docs/models/websocket#UpdateMessageData",
	},
];

export const websocketUpdateDataRows: ModelTableProps["rows"] = [
	{
		name: "slugs",
		type: "UpdateMessageDataSlugs",
		description:
			"An object containing the slugs of the updated addon for each supported platform.",
		url: "#UpdateMessageDataSlugs",
	},
	{
		name: "platforms",
		type: '("modrinth" | "curseforge")[]',
		description: "An array of platforms where the addons is available.",
	},
	{
		name: "names",
		type: "UpdateMessageDataNames",
		description: "An object containing the names of the updated addon for each supported platform.",
		url: "#UpdateMessageDataNames"
	},
	{
		name: "changes",
		type: "UpdateMessageDataChanges",
		description:
			"An object containing the changes made to the addon for each platform.",
		url: "#UpdateMessageDataChanges",
	},
];

export const websocketUpdateDataSlugsRows: ModelTableProps["rows"] = [
	{
		name: "modrinth?",
		type: "string | null",
		description: "The slug of the addon on the Modrinth platform.",
	},
	{
		name: "curseforge?",
		type: "string | null",
		description: "The slug of the addon on the Curseforge platform.",
	},
];

export const websocketUpdateDataNamesRows: ModelTableProps["rows"] = [
	{
		name: "modrinth?",
		type: "string | null",
		description: "The name of the addon on the Modrinth platform.",
	},
	{
		name: "curseforge?",
		type: "string | null",
		description: "The name of the addon on the Curseforge platform.",
	},
];

export const websocketUpdateDataChangesRows: ModelTableProps["rows"] = [
	{
		name: "modrinth?",
		type: "UpdateMessageDataChangesData",
		description:
			"The changes made to the addon on the Modrinth platform, or undefined if there are no changes.",
		url: "#UpdateMessageDataChangesData",
	},
	{
		name: "curseforge?",
		type: "UpdateMessageDataChangesData",
		description:
			"The changes made to the addon on the Curseforge platform, or undefined if there are no changes.",
		url: "#UpdateMessageDataChangesData",
	},
];

export const websocketUpdateDataChangesDataRows: ModelTableProps["rows"] = [
	{
		name: "slug?",
		type: "UpdateMessageDataChangesDataString",
		description: "The slug of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataString",
	},
	{
		name: "authors?",
		type: "UpdateMessageDataChangesDataAuthors",
		description: "The authors of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataAuthors",
	},
	{
		name: "downloads?",
		type: "UpdateMessageDataChangesDataNumber",
		description:
			"The number of downloads of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataNumber",
	},
	{
		name: "description?",
		type: "UpdateMessageDataChangesDataString",
		description: "The description of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataString",
	},
	{
		name: "icon?",
		type: "UpdateMessageDataChangesDataString",
		description: "The icon URL of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataString",
	},
	{
		name: "name?",
		type: "UpdateMessageDataChangesDataString",
		description: "The name of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataString",
	},
	{
		name: "version?",
		type: "UpdateMessageDataChangesDataString",
		description: "The version of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataString",
	},
	{
		name: "versions?",
		type: "UpdateMessageDataChangesDataStringArray",
		description: "The versions of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataStringArray",
	},
	{
		name: "categories?",
		type: "UpdateMessageDataChangesDataStringArray",
		description: "The categories of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataStringArray",
	},
	{
		name: "follows?",
		type: "UpdateMessageDataChangesDataNumber",
		description:
			"The number of follows of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataNumber",
	},
	{
		name: "created?",
		type: "UpdateMessageDataChangesDataString",
		description: "The creation date of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataString",
	},
	{
		name: "modified?",
		type: "UpdateMessageDataChangesDataString",
		description:
			"The last modified date of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataString",
	},
	{
		name: "color?",
		type: "UpdateMessageDataChangesDataNumber",
		description: "The color of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataNumber",
	},
	{
		name: "license?",
		type: "UpdateMessageDataChangesDataString",
		description: "The license of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataString",
	},
	{
		name: "clientSide?",
		type: "UpdateMessageDataChangesDataSide",
		description:
			"The client-side support type of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataSide",
	},
	{
		name: "serverSide?",
		type: "UpdateMessageDataChangesDataSide",
		description:
			"The server-side support type of the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataSide",
	},
	{
		name: "modloaders?",
		type: "UpdateMessageDataChangesDataModloadersArray",
		description:
			"The modloaders supported by the addon, with the old and new values.",
		url: "#UpdateMessageDataChangesDataModloadersArray",
	},
];

export const websocketUpdateDataChangesDataStringRows: ModelTableProps["rows"] =
	[
		{
			name: "old",
			type: "string | null",
			description:
				"The previous value of the string property, or null if it did not exist.",
		},
		{
			name: "new",
			type: "string | null",
			description:
				"The new value of the string property, or null if it does not exist.",
		},
	];

export const websocketUpdateDataChangesDataAuthorsRows: ModelTableProps["rows"] =
	[
		{
			name: "old",
			type: "AddonAuthor[] | null",
			description: "The previous list of authors, or null if it did not exist.",
			url: "/docs/models/addon#AddonAuthor",
		},
		{
			name: "new",
			type: "AddonAuthor[] | null",
			description: "The new list of authors, or null if it does not exist.",
			url: "/docs/models/addon#AddonAuthor",
		},
	];

export const websocketUpdateDataChangesDataNumberRows: ModelTableProps["rows"] =
	[
		{
			name: "old",
			type: "number | null",
			description:
				"The previous value of the number property, or null if it did not exist.",
		},
		{
			name: "new",
			type: "number | null",
			description:
				"The new value of the number property, or null if it does not exist.",
		},
	];

export const websocketUpdateDataChangesDataStringArrayRows: ModelTableProps["rows"] =
	[
		{
			name: "old",
			type: "string[] | null",
			description:
				"The previous array of strings, or null if it did not exist.",
		},
		{
			name: "new",
			type: "string[] | null",
			description: "The new array of strings, or null if it does not exist.",
		},
	];

export const websocketUpdateDataChangesDataSideRows: ModelTableProps["rows"] = [
	{
		name: "old",
		type: '"unknown" | "required" | "optional" | "unsupported" | null',
		description:
			"The previous clientSide or serverSide support type, or null if it did not exist.",
	},
	{
		name: "new",
		type: '"unknown" | "required" | "optional" | "unsupported" | null',
		description:
			"The new clientSide or serverSide support type, or null if it does not exist.",
	},
];

export const websocketUpdateDataChangesDataModloadersArrayRows: ModelTableProps["rows"] =
	[
		{
			name: "old",
			type: '("modloader" | "quilt" | "fabric" | "forge" | "neoforge" | "liteloader" | "rift" | "cauldron" | "any")[] | null',
			description:
				"The previous array of modloaders, or null if it did not exist.",
		},
		{
			name: "new",
			type: '("modloader" | "quilt" | "fabric" | "forge" | "neoforge" | "liteloader" | "rift" | "cauldron" | "any")[] | null',
			description: "The new array of modloaders, or null if it does not exist.",
		},
	];

export const websocketCommandMessageRows: ModelTableProps["rows"] = [
	{
		name: "type",
		type: "4",
		description:
			"The type of the WebSocket message, indicating a command event.",
	},
	{
		name: "data",
		type: "CommandMessageData",
		description:
			"The data associated with the command message, containing the command and its arguments.",
		url: "/docs/models/websocket#CommandMessageData",
	},
];

export const websocketCommandDataRows: ModelTableProps["rows"] = [
	{
		name: "command",
		type: '"getAddon" | "getAddons"',
		description: "The command being requested.",
	},
	{
		name: "args",
		type: "CommandMessageDataArgs",
		description:
			"An object containing the arguments for the command, where keys are argument names and values are their respective values.",
		url: "#CommandMessageDataArgs",
	},
];

export const websocketCommandDataArgsRows: ModelTableProps["rows"] = [
	{
		name: "[string]",
		type: "string | number",
		description:
			"The value of the argument, which can be a string or a number.",
	},
];

export const websocketCommandResponseMessageRows: ModelTableProps["rows"] = [
	{
		name: "type",
		type: "5",
		description:
			"The type of the WebSocket message, indicating a command response event.",
	},
	{
		name: "command",
		type: '"getAddon" | "getAddons"',
		description: "The command that this response is associated with.",
	},
	{
		name: "data",
		type: "unknown",
		description:
			"The data associated with the command response message, which varies based on the command executed.",
	},
];

export const websocketCommandErrorMessageRows: ModelTableProps["rows"] = [
	{
		name: "type",
		type: "6",
		description:
			"The type of the WebSocket message, indicating a command error event.",
	},
	{
		name: "command",
		type: '"getAddon" | "getAddons"',
		description: "The command that this error is associated with.",
	},
	{
		name: "data",
		type: "CommandErrorMessageData",
		description: "An object containing the error message.",
		url: "/docs/models/websocket#CommandErrorMessageData",
	},
];

export const websocketCommandErrorRows: ModelTableProps["rows"] = [
	{
		name: "message",
		type: "string",
		description: "An message explaining the error that occurred.",
	},
];

export const getAddonsCommandArgsRows: ModelTableProps["rows"] = [
	{
		name: "page?",
		type: "number",
		description: "The page number for pagination.",
	},
	{
		name: "version?",
		type: '"all" | string',
		description: "The Minecraft version to filter addons by.",
	},
	{
		name: "modloader?",
		type: '"quilt" | "fabric" | "forge" | "neoforge" | "liteloader" | "modloader" | "rift" | "cauldron" | "any" | "all"',
		description: "The modloader to filter addons by.",
	},
	{
		name: "search?",
		type: "string",
		description:
			"A search term to filter addons by name, description, slug or categories.",
	},
	{
		name: "sortOrder?",
		type: '"name" | "created" | "downloads" | "followers" | "lastUpdated"',
		description: "The sorting order for the results.",
	},
	{
		name: "platform?",
		type: '"modrinth" | "curseforge" | "all"',
		description: "The platform to filter addons by.",
	},
];

export const getAddonsCommandResponseRows: ModelTableProps["rows"] = [
	{
		name: "error",
		type: "false",
		description: "Indicates if there was an error.",
	},
	{
		name: "page",
		type: "number",
		description: "The current page number of the results.",
	},
	{
		name: "totalMods",
		type: "number",
		description: "The total number of mods available matching the query.",
	},
	{
		name: "totalPages",
		type: "number",
		description: "The total number of pages available matching the query.",
	},
	{
		name: "mods",
		type: "Addon[]",
		description: "An array of addons matching the query.",
		url: "/docs/models/addon#Addon",
	},
];

export const getAddonCommandArgsRows: ModelTableProps["rows"] = [
	{
		name: "slug",
		type: "string",
		description: "The unique slug identifier for the addon.",
	},
	{
		name: "platform?",
		type: '"modrinth" | "curseforge"',
		description: "The platform to filter the addon by.",
	},
];
