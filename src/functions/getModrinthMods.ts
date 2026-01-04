import type {
	ModrinthDependenciesResponse,
	ModrinthGameVersion,
	ModrinthGetProjectsMod,
	ModrinthGetVersionsVersion,
	ModrinthSearchResponse,
	ModrinthTeamUsers,
} from "@/types/modrinth";
import type { AxiosError } from "axios";
import { ratelimitFetch } from "@/functions/fetch";
import { splitArray } from "./util";

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

		console.info(
			`\x1b[36mFetched \x1b[0;1m${mods.length}\x1b[0;36m mods from modrinth, total: \x1b[0;1m${data.total_hits}\x1b[0;36m, offset: \x1b[0;1m${offset}\x1b[0m`,
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

async function isCreateAddon(slug: string) {
	const res = await ratelimitFetch(
		`https://api.modrinth.com/v2/project/${slug}/dependencies`,
	);

	const dependencies = res.data as ModrinthDependenciesResponse;

	if (
		dependencies.projects.find(
			(project) =>
				project.slug === "create" || project.slug === "create-fabric",
		)
	)
		return true;

	return false;
}

async function getFullMods(IDs: string[]) {
	const ids = IDs.map((id) => `"${id}"`).join(",");

	const searchParams = new URLSearchParams({
		ids: `[${ids}]`,
	});

	const res = await ratelimitFetch(
		`https://api.modrinth.com/v2/projects?${searchParams}`,
	);

	const mods = res.data as ModrinthGetProjectsMod[];

	return mods;
}

async function fetchVersions(IDs: string[]) {
	const ids = IDs.map((id) => `"${id}"`).join(",");

	const searchParams = new URLSearchParams({
		ids: `[${ids}]`,
	});

	const res = await ratelimitFetch(
		`https://api.modrinth.com/v2/versions?${searchParams}`,
	);

	const data = res.data as ModrinthGetVersionsVersion[];

	return data;
}

async function getTeams(IDs: string[]) {
	const ids = IDs.map((id) => `"${id}"`).join(",");

	const searchParams = new URLSearchParams({
		ids: `[${ids}]`,
	});

	const res = await ratelimitFetch(
		`https://api.modrinth.com/v2/teams?${searchParams}`,
	);

	const data = res.data as ModrinthTeamUsers[][];

	return data;
}

export async function getMinecraftVersions() {
	const res = await ratelimitFetch(
		"https://api.modrinth.com/v2/tag/game_version",
	);

	const data = res.data as ModrinthGameVersion[];

	return new Map(data.reverse().map((v, idx) => [v.version, idx]));
}

interface GetModrinthModsResult {
	mod: ModrinthGetProjectsMod;
	authors: string[];
	hashes: string[];
	downloads: string[];
}

export default async function getModrinthMods(): Promise<
	GetModrinthModsResult[]
> {
	const modsData = await fetchMods();

	const modsIds: string[] = [];

	let index = 0;

	for (const mod of modsData.mods) {
		if (mod.slug === "create" || mod.slug === "create-fabric") {
			modsIds.push(mod.project_id);
			index++;

			continue;
		}

		console.info(
			`\x1b[34mFetching dependencies for "\x1b[0;1m${mod.slug}\x1b[0;34m" \x1b[33m[\x1b[1m${index}\x1b[0;33m]\x1b[0m`,
		);

		try {
			const check = await isCreateAddon(mod.slug);

			if (check) modsIds.push(mod.project_id);
		} catch (e) {
			const error = e as AxiosError;

			console.info(
				`\x1b[31mSkipped mod "\x1b[0;1m${mod.slug} (${mod.project_id})\x1b[0;31m" for error "\x1b[0;1m${error?.response?.status}\x1b[0;31m" (\x1b[0;1m${error?.response?.statusText}\x1b[0;31m) \x1b[0;33m[\x1b[1m${index}\x1b[0;33m]\x1b[0m`,
			);
		}

		index++;
	}

	const modsIdsGroups = splitArray<string>(modsIds, 700);

	const modData: GetModrinthModsResult[] = [];

	for (const modIdGroup of modsIdsGroups) {
		const modsRes = await getFullMods(modIdGroup);

		const formattedMods = modsRes.map((mod) => ({
			mod: mod,
			authors: [],
			hashes: [],
			downloads: [],
		}));

		modData.push(...formattedMods);
	}

	const teamsIds = modData.map((data) => data.mod.team);

	const teamsIdsGroups = splitArray<string>(teamsIds, 700);

	for (const teamIdGroup of teamsIdsGroups) {
		const teamsRes = await getTeams(teamIdGroup);

		for (const team of teamsRes) {
			const teamId = team[0].team_id;
			const authors = team.map((teamData) => teamData.user.username);

			const index = modData.findIndex((data) => data.mod.team === teamId);

			modData[index].authors = authors;
		}
	}

	const modsVersions = modData.flatMap((data) => data.mod.versions);

	const modsVersionsGroups = splitArray<string>(modsVersions, 700);

	const versions: ModrinthGetVersionsVersion[] = [];

	for (const modVersionGroup of modsVersionsGroups) {
		const modVersionRes = await fetchVersions(modVersionGroup);

		versions.push(...modVersionRes);
	}

	for (const version of versions) {
		const hashes = version.files.map((file) => file.hashes.sha1);
		const downloads = version.files.map((file) => file.url).filter(Boolean);
		const projectId = version.project_id;

		const index = modData.findIndex((data) => data.mod.id === projectId);
		modData[index].hashes.push(...hashes);
		modData[index].downloads.push(...downloads);
	}

	return modData;
}
