import type {
	DatabaseModData,
} from "@/types/addons";
import type { UpdateMessageDataChanges } from "@/types/websocket";

export function compareArrays<T>(a: T[], b: T[]): boolean {
	return a.length === b.length && a.every((value) => b.includes(value));
}

// function mergeColors(a: number, b: number) {
// 	const aRed = (a >> 16) & 0xff;
// 	const aGreen = (a >> 8) & 0xff;
// 	const aBlue = a & 0xff;

// 	const bRed = (b >> 16) & 0xff;
// 	const bGreen = (b >> 8) & 0xff;
// 	const bBlue = b & 0xff;

// 	return (
// 		(Math.round((aRed + bRed) / 2) << 16) |
// 		(Math.round((aGreen + bGreen) / 2) << 8) |
// 		Math.round((aBlue + bBlue) / 2)
// 	);
// }

// export function mergeAddons(modrinthAddon: DatabaseMod, curseforgeAddon: DatabaseMod): DatabaseMod {
//     return {
//         author: modrinthAddon.author,
//         categories: Array.from(
//             new Set([
//                 ...modrinthAddon.categories,
//                 ...curseforgeAddon.categories
//             ]),
//         ),
//         clientSide: modrinthAddon.clientSide,
//         color: mergeColors(modrinthAddon.color || 1825130, 15625524),
//         created:
//             new Date(modrinthAddon.created) < new Date(curseforgeAddon.created)
//                 ? modrinthAddon.created
//                 : curseforgeAddon.created,
//         description: modrinthAddon.description,
//         downloads: modrinthAddon.downloads,
//         follows: modrinthAddon.follows,
//         icon: modrinthAddon.icon,
//         license: modrinthAddon.license,
//         modified:
//             new Date(modrinthAddon.modified) < new Date(curseforgeAddon.modified)
//                 ? modrinthAddon.modified
//                 : curseforgeAddon.modified,
//         modloaders: Array.from(
//             new Set([
//                 ...modrinthAddon.modloaders,
//                 ...curseforgeAddon.modloaders
//             ]),
//         ) as Modloaders[],
//         name: modrinthAddon.name,
//         platform: (["modrinth", "curseforge"] as Platforms[]).join(",") as Platforms,
//         serverSide: modrinthAddon.serverSide,
//         slug: modrinthAddon.slug,
//         version: modrinthAddon.version,
//         versions: Array.from(
//             new Set([
//                 ...modrinthAddon.versions,
//                 ...curseforgeAddon.versions
//             ]),
//         ),
//     }
// }

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
