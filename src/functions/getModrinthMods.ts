import type {
	ModrinthDependenciesResponse,
	ModrinthSearchResponse,
} from "@/types/modrinth";
import type { AxiosError } from "axios";
import { ratelimitFetch } from "@/functions/fetch";

async function fetchMods(
	offset = 0,
	skipIteration = false,
): Promise<{
	mods: ModrinthSearchResponse["hits"];
	totalMods: number;
}> {
	const searchParams = new URLSearchParams({
		query: "create",
		limit: "100",
		offset: offset.toString(),
		facets: JSON.stringify([["project_type:mod"]]),
	});

	const url = `https://api.modrinth.com/v2/search?${searchParams}`;

	const mods = [];

	try {
		const res = await ratelimitFetch(url);

		const data: ModrinthSearchResponse = res.data;

		mods.push(...data.hits);

		console.log(
			`\x1b[36mFetched \x1b[0;1m${mods.length}\x1b[0;36m mods, total: \x1b[0;1m${data.total_hits}\x1b[0;36m, offset: \x1b[0;1m${offset}\x1b[0m`,
		);

		const totalMods = data.total_hits;
		let currentOffset = offset + 100;

		if (skipIteration)
			return {
				mods,
				totalMods,
			};

		while (currentOffset < totalMods) {
			const newRes = await fetchMods(currentOffset, true);
			mods.push(...newRes.mods);

			currentOffset += 100;
		}

		return {
			mods,
			totalMods,
		};
	} catch (e) {
		const error = e as AxiosError;

		console.error(
			error.message,
			error.code,
			error.response,
			error.response?.headers["retry-after"],
		);

		return {
			mods: [],
			totalMods: 0,
		};
	}
}

export default async function getModrinthMods(): Promise<
	ModrinthSearchResponse["hits"]
> {
	const modsData = await fetchMods();

	const mods: ModrinthSearchResponse["hits"] = [];

	let index = 0;

	for (const mod of modsData.mods) {
		console.log(`\x1b[34mFetching dependencies for "\x1b[0;1m${mod.slug}\x1b[0;34m" \x1b[33m[\x1b[1m${index}\x1b[0;33m]\x1b[0m`);

		if (mod.slug === "create" || mod.slug === "create-fabric") {
			mods.push(mod);
			index++;

			continue;
		}

		try {
			const res = await ratelimitFetch(
				`https://api.modrinth.com/v2/project/${mod.slug}/dependencies`,
			);

			const dependencies = res.data as ModrinthDependenciesResponse;

			if (
				dependencies.projects.find(
					(project) =>
						project.slug === "create" || project.slug === "create-fabric",
				)
			) {
				mods.push(mod);
			}
		} catch (e) {
			const error = e as AxiosError;

			console.log(error)

			console.log(
				`\x1b[31mSkipped mod "\x1b[0;1m${mod.slug}\x1b[0;31m" for error "\x1b[0;1m${error?.response?.status}\x1b[0;31m" (\x1b[0;1m${error?.response?.statusText}\x1b[0;31m) \x1b[0;33m[\x1b[1m${index}\x1b[0;33m]\x1b[0m`,
			);
		}

		index++;
	}

	return mods;
}
