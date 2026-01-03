import semver from "semver";

type Version = {
    raw: string;
    sem: string | null;
    idx: number;
};

export function sortVersions(versions: string[], coerce = true): string[] {
	const items: Version[] = versions.map((raw, idx) => {
		const sem = coerce
			? (semver.coerce(raw)?.version ?? null)
			: (semver.valid(raw) ?? null);
		return { raw, sem, idx };
	});

	items.sort((a, b) => {
		if (a.sem && b.sem) return semver.rcompare(a.sem, b.sem);
		if (a.sem && !b.sem) return -1;
		if (!a.sem && b.sem) return 1;

		return a.idx - b.idx;
	});

	return items.map((i) => i.raw);
}