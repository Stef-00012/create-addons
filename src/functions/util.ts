import type { DatabaseModData } from "@/types/addons";
import type { UpdateMessageDataChanges } from "@/types/websocket";
import JSZip from "jszip";
import * as TOML from "@iarna/toml";
import type { FabricModJson, ForgeModJson } from "@/types/modloaders";
import { ratelimitFetch } from "./fetch";

type DeepComparable =
	| string
	| number
	| boolean
	| null
	| { [key: string]: DeepComparable }
	| DeepComparable[];

function isDeepEqual(object1: DeepComparable, object2: DeepComparable): boolean {
	if (object1 === object2) return true;

	if (
		typeof object1 !== "object" ||
		object1 === null ||
		typeof object2 !== "object" ||
		object2 === null
	) return false;

	const isArray1 = Array.isArray(object1);
	const isArray2 = Array.isArray(object2);

	if (isArray1 !== isArray2) return false;

	if (isArray1 && isArray2) {
		const array1 = object1 as DeepComparable[];
		const array2 = object2 as DeepComparable[];

		if (array1.length !== array2.length) return false;
		
		return array1.every((val, index) => isDeepEqual(val, array2[index]));
	}

	const record1 = object1 as Record<string, DeepComparable>;
	const record2 = object2 as Record<string, DeepComparable>;

	const keys1 = Object.keys(record1);
	const keys2 = Object.keys(record2);

	if (keys1.length !== keys2.length) return false;

	return keys1.every(
		(key) =>
			Object.hasOwn(record2, key) &&
			isDeepEqual(record1[key], record2[key]),
	);
}

function compareArrays<T extends DeepComparable>(
	array1: T[],
	array2: T[],
): boolean {
	if (array1.length !== array2.length) return false;

	const matchedIndices = new Set<number>();

	for (const item1 of array1) {
		let foundMatch = false;

		for (let i = 0; i < array2.length; i++) {
			if (matchedIndices.has(i)) continue;

			if (isDeepEqual(item1, array2[i])) {
				matchedIndices.add(i);

				foundMatch = true;

				break;
			}
		}

		if (!foundMatch) return false;
	}

	return true;
}

export function splitArray<T = unknown>(array: Array<T>, count = 700) {
	const groups = [];

	for (let i = 0; i < array.length; i += count) {
		groups.push(array.slice(i, i + count));
	}

	return groups;
}

export function compareAddons(
	oldAddon: DatabaseModData | null | undefined,
	newAddon: DatabaseModData | null | undefined,
): UpdateMessageDataChanges {
	const changes: NonNullable<ReturnType<typeof compareAddons>> = {};

	if (!oldAddon && !newAddon) {
		return null;
	}

	if (newAddon) {
		for (const _key in newAddon) {
			const key = _key as keyof typeof newAddon;

			if (!oldAddon) {
				changes[key] = { old: null, new: newAddon[key] };
				continue;
			}

			if (Array.isArray(newAddon[key]) && Array.isArray(oldAddon[key])) {
				if (!compareArrays(newAddon[key], oldAddon[key]))
					changes[key] = { old: oldAddon[key], new: newAddon[key] };
			} else if (newAddon[key] !== oldAddon[key]) {
				changes[key] = {
					old: oldAddon[key],
					new: newAddon[key],
				};
			}
		}
	} else if (oldAddon) {
		for (const _key in oldAddon) {
			const key = _key as keyof typeof oldAddon;

			if (!newAddon) {
				changes[key] = { old: oldAddon[key], new: null };
				continue;
			}

			if (Array.isArray(newAddon[key]) && Array.isArray(oldAddon[key])) {
				if (!compareArrays(newAddon[key], oldAddon[key]))
					changes[key] = { old: oldAddon[key], new: newAddon[key] };
			} else if (newAddon[key] !== oldAddon[key]) {
				changes[key] = {
					old: oldAddon[key],
					new: newAddon[key],
				};
			}
		}
	}

	return changes;
}

export function sortVersions(
	versions: string[],
	mcVersions: Map<string, number>,
): string[] {
	return versions.sort((a, b) => {
		const indexA = mcVersions.get(a) ?? Number.POSITIVE_INFINITY;
		const indexB = mcVersions.get(b) ?? Number.POSITIVE_INFINITY;

		return indexA - indexB;
	});
}

function unescapeUnicodeEscapes(string: string): string {
	return string.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
		String.fromCharCode(parseInt(hex, 16)),
	);
}

const validPaths = [
	"fabric.mod.json",
	"META-INF/mods.toml",
	"META-INF/neoforge.mods.toml",
	"quilt.mod.json",
	"mods.toml",
] as const;

export async function getCreatVersion(url: string): Promise<string | null> {
	try {
		const res = await ratelimitFetch(url, {
			responseType: "arraybuffer",
		});

		const zip = await JSZip.loadAsync(res.data);

		for (const validPath of validPaths) {
			const file = zip.file(validPath);

			if (!file) continue;

			const content = await file.async("text");

			if (validPath.endsWith(".json")) {
				const json = JSON.parse(content) as FabricModJson;

				const createVersion = json.depends.create;

				if (typeof createVersion !== "string") continue;

				const parsedVersion = parseFabricVersion(createVersion);

				if (!parsedVersion) continue;

				return `create ${parsedVersion}`;
			} else if (validPath.endsWith(".toml")) {
				const json = TOML.parse(content) as unknown as ForgeModJson;

				const modIds = json.mods
					.map((mod) => mod.modId)
					.filter((id) => id in json.dependencies);

				for (const modId of modIds) {
					const dependencies = json.dependencies[modId];

					const createDependency = dependencies.find(
						(dep) => dep.modId === "create",
					);

					if (!createDependency) continue;

					const versionRange = createDependency.versionRange;

					const createVersion = parseForgeVersionRange(versionRange);

					return createVersion;
				}

				break;
			}
		}

		return null;
	} catch (_e) {
		return null;
	}
}

function parseFabricVersion(string: string): string | null {
	const trimmedString = unescapeUnicodeEscapes(string).trim();

	const match = trimmedString.match(/^(>=|<=|>|<|=|\^|~)?\s*(\d+\.\d+\.\d+)/);
	if (!match) return null;

	const op = match[1] ?? "";
	const ver = match[2];
	return `${op} ${ver}`;
}

export function parseForgeVersionRange(version: string): string {
	const trimmedVersion = version.trim();

	if (!/^[\[(]/.test(trimmedVersion)) return `create = ${trimmedVersion}`;

	const match = trimmedVersion.match(/^(\[|\()([^,]*),([^)\]]*)(\]|\))$/);

	if (!match) return trimmedVersion;

	const leftBracket = match[1];
	const rawLower = match[2].trim();
	const rawUpper = match[3].trim();
	const rightBracket = match[4];

	const hasLower = rawLower.length > 0;
	const hasUpper = rawUpper.length > 0;

	const lowerOp = leftBracket === "[" ? ">=" : ">";
	const upperOp = rightBracket === "]" ? "<=" : "<";

	if (hasLower && !hasUpper) return `create ${lowerOp} ${rawLower}`;
	if (!hasLower && hasUpper) return `create ${upperOp} ${rawUpper}`;

	if (hasLower && hasUpper)
		return `${rawLower} ${lowerOp.replace(">", "<")} create ${upperOp} ${rawUpper}`.replace(
			"<==",
			"<=",
		);

	return `any create`;
}
