import type { ModrinthSearchResponse } from "@/types/modrinth";
import axios, { type AxiosError } from "axios";
import { ratelimitFetch } from "./fetch";

async function fetchMods(offset = 0, skipIteration = false): Promise<{
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
    console.log(url)

	const mods = [];

	try {
		const res = await ratelimitFetch(url);

		const data: ModrinthSearchResponse = res.data;

		mods.push(...data.hits);
        
        console.log(`fetched ${mods.length} mods, total: ${data.total_hits}, offset: ${offset}`);

		const totalMods = data.total_hits;
		let currentOffset = offset + 100;

        if (skipIteration) return {
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

fetchMods().then(x => console.log(x, x.mods.length, x.totalMods));

export default async function getModrinthMods() {
    const modsData = await fetchMods()

    const mods = []

    for (const mod of modsData.mods) {
        const res = await axios.get(`https://api.modrinth.com/v2/project/${mod.slug}/dependencies`);

        const dependencies = res.data;

        
    }
}
