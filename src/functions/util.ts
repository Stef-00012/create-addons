import type { DatabaseModData } from "@/types/addons";
import type { UpdateMessageDataChanges } from "@/types/websocket";

export function compareArrays<T>(a: T[], b: T[]): boolean {
	return a.length === b.length && a.every((value) => b.includes(value));
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
