import type {
	ModrinthDependenciesResponse,
	ModrinthSearchResponse,
} from "@/types/modrinth";
import type { AxiosError } from "axios";
import { ratelimitFetch } from "./fetch";

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
			`Fetched ${mods.length} mods, total: ${data.total_hits}, offset: ${offset}`,
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

		console.log(
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
		console.log(index, "Fetching dependencies for", mod.slug);

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

			console.log(
				index,
				`Skipped mod ${mod.slug} for error ${error?.response?.status} ()${error?.response?.statusText})`,
			);
		}

		index++;
	}

	return mods;
}
