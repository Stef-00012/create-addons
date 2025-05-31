import type {
	CurseforgeGetModsResponse,
	CurseforgeSearchResponse,
} from "@/types/curseforge";
import type { AxiosError } from "axios";
import { ratelimitFetch, ratelimitPost } from "@/functions/fetch";
import { CurseforgeHashAlgo } from "@/types/curseforge";

const apiKey = process.env.CURSEFORGE_API_KEY;
const createModids = [
	624165, // create-fabric
	328085, // create
];

async function fetchMods(
	index = 0,
	skipIteration = false,
): Promise<CurseforgeSearchResponse["data"]> {
	const search = new URLSearchParams({
		gameId: "432", // 432 = Minecraft
		classId: "6", // 6 = mc-mods
		// categoryIds: '["426","6484"]', // 426 = mc-addons | 6484 = create
		categoryId: "6484", // 6484 = create
		sortField: "downloadCount",
		// sortField: '6', // 6 = TotalDownloads
		sortOrder: "desc",
		pageSize: "50",
		index: index.toString(),
	});

	const url = `https://api.curseforge.com/v1/mods/search?${search}`;

	const mods = [];

	try {
		const res = await ratelimitFetch(url, {
			headers: {
				Accept: "application/json",
				"x-api-key": apiKey,
			},
		});

		const data: CurseforgeSearchResponse = res.data;

		mods.push(...data.data);

		console.info(
			`\x1b[36mFetched \x1b[0;1m${mods.length}\x1b[0;36m mods from curseforge, total: \x1b[0;1m${data.pagination.totalCount}\x1b[0;36m, offset: \x1b[0;1m${data.pagination.index}\x1b[0m`,
		);

		const totalMods = data.pagination.totalCount;
		let currentOffset = data.pagination.index + 50;

		if (skipIteration) return mods;

		while (currentOffset < totalMods) {
			const newRes = await fetchMods(currentOffset, true);

			mods.push(...newRes);

			currentOffset += 50;
		}

		return mods.filter((mod) =>
			mod.latestFiles.some((file) =>
				file.dependencies.some((dependency) =>
					createModids.includes(dependency.modId),
				),
			),
		);
	} catch (e) {
		const error = e as AxiosError;

		console.error(
			error.message,
			error.code,
			error.response,
			error.response?.headers["retry-after"],
		);

		return [];
	}
}

async function getBaseCreateMod(): Promise<CurseforgeSearchResponse["data"]> {
	const url = "https://api.curseforge.com/v1/mods";

	const res = await ratelimitPost(
		url,
		{
			modIds: createModids,
		},
		{
			headers: {
				Accept: "application/json",
				"x-api-key": apiKey,
			},
		},
	);

	const data = res.data as CurseforgeGetModsResponse;

	return data.data;
}

export default async function getCurseforgeMods(): Promise<
	{
		mod: CurseforgeSearchResponse["data"][0];
		hashes: string[];
	}[]
> {
	const modsData = await fetchMods();
	const baseCreateMods = await getBaseCreateMod();

	const mods: CurseforgeSearchResponse["data"] = [
		...baseCreateMods,
		...modsData,
	];

	return mods.map((mod) => ({
		mod,
		hashes: mod.latestFiles.flatMap((file) =>
			file.hashes
				.filter((hash) => hash.algo === CurseforgeHashAlgo.Sha1)
				.map((hash) => hash.value),
		),
	}));
}
