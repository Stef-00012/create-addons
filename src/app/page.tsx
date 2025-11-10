"use client";

import {
	Fragment,
	type KeyboardEvent as ReactKeyboardEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import axios from "axios";
import { platforms } from "@/constants/loaders";

import type { APIModsResponse } from "@/app/api/addons/route";
import type { DatabaseModData, Platforms, SortOrders } from "@/types/addons";

import { useSearchParams, useRouter } from "next/navigation";
import FilterSelect from "@/components/FilterSelect";
import SkeletonCard from "@/components/SkeletonCard";
import SkeletonList from "@/components/SkeletonList";
import Card from "@/components/Card";
import List from "@/components/List";
import Link from "next/link";

const modloaderOptions = [
	{ value: "all", label: "All" },
	{ value: "neoforge", label: "NeoForge" },
	{ value: "forge", label: "Forge" },
	{ value: "fabric", label: "Fabric" },
	{ value: "quilt", label: "Quilt" },
	{ value: "rift", label: "Rift" },
	{ value: "liteloader", label: "LiteLoader" },
	{ value: "modloader", label: "Risugami's ModLoader" },
	{ value: "cauldron", label: "Cauldron" },
];

const sortByOptions = [
	{ value: "name", label: "Name" },
	{ value: "downloads", label: "Downloads" },
	{ value: "followers", label: "Followers" },
	{ value: "lastUpdated", label: "Last Updated" },
	{ value: "created", label: "Created" },
];

const platformOptions = [
	{ value: "all", label: "All" },
	{ value: "modrinth", label: "Modrinth" },
	{ value: "curseforge", label: "Curseforge" },
];

const modloaders = modloaderOptions.map((modloader) => modloader.value);
const sortByOrders = sortByOptions.map((sortOption) => sortOption.value);

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialPage = searchParams.get("page");
	const initialLoader = searchParams.get("modloader") as
		| DatabaseModData["modloaders"][0]
		| "all";
	const initialSortBy = searchParams.get("sort") as SortOrders;
	const initialCompactMode = searchParams.get("compact") === "1";
	const initialVersion = searchParams.get("version") as string;
	const initialSearch = searchParams.get("search");
	const initialPlatform = searchParams.get("platform") as Platforms;

	const [versions, setVersions] = useState<string[]>([]);
	const [page, setPage] = useState<number>(
		Number.parseInt(initialPage || "1") || 1,
	);
	const [addonsData, setAddonsData] = useState<APIModsResponse | null>(null);

	const [loader, setLoader] = useState<
		DatabaseModData["modloaders"][0] | "all"
	>(modloaders.includes(initialLoader) ? initialLoader : "all");

	const [sortBy, setSortBy] = useState<SortOrders>(
		sortByOrders.includes(initialSortBy) ? initialSortBy : "downloads",
	);

	const [compactMode, setCompactMode] = useState(initialCompactMode);

	const [version, setVersion] = useState<DatabaseModData["version"] | "all">(
		versions.includes(initialVersion) ? initialVersion : "all",
	);

	const [platform, setPlatform] = useState<Platforms | "all">(
		platforms.includes(initialPlatform) ? initialPlatform : "all",
	);

	const [search, setSearch] = useState<string>(
		initialSearch ? decodeURIComponent(initialSearch) : "",
	);

	const searchInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		async function fetchVersions() {
			const res = await axios.get("/api/versions");

			const data = res.data as string[];

			setVersions(data);
		}

		fetchVersions().catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		const version = searchParams.get("version") as
			| DatabaseModData["version"]
			| "all";
		const loader = searchParams.get("modloader") as
			| DatabaseModData["modloaders"][0]
			| "all";
		const search = searchParams.get("search") as string;
		const sortBy = searchParams.get("sort") as SortOrders;
		const page = searchParams.get("page") as string;
		const platform = searchParams.get("platform") as Platforms;

		if (versions.includes(version)) {
			setVersion(version);
		}

		if (modloaders.includes(loader)) {
			setLoader(loader);
		}

		if (sortByOrders.includes(sortBy)) {
			setSortBy(sortBy);
		}

		if (platforms.includes(platform)) {
			setPlatform(platform);
		}

		if (Number.parseInt(page) > 1) {
			setPage(Number.parseInt(page));
		}
		setSearch(decodeURIComponent(search || ""));
	}, [searchParams, versions]);

	useEffect(() => {
		const fetchAddonsData = async () => {
			const apiSearchParams = new URLSearchParams({
				page: String(page - 1),
				version: version,
				modloader: loader,
				sort: sortBy,
				search: encodeURIComponent(search),
				platform,
			});

			scrollTo({
				top: 0,
				behavior: "smooth",
			});

			setAddonsData(null);

			const res = await axios.get(`/api/addons?${apiSearchParams}`);

			const data = (await res.data) as APIModsResponse;

			setAddonsData(data);
		};

		fetchAddonsData().catch((err) => console.error(err));
	}, [page, loader, sortBy, version, platform, search]);

	useEffect(() => {
		if (addonsData && page > (addonsData.totalPages || 1)) {
			setPage(addonsData?.totalPages || 1);
		}
	}, [addonsData, page]);

	useEffect(() => {
		const setSearchParams = new URLSearchParams();

		if (page > 1) setSearchParams.append("page", String(page));
		if (version !== "all") setSearchParams.append("version", version);
		if (loader !== "all") setSearchParams.append("modloader", loader);
		if (search) setSearchParams.append("search", encodeURIComponent(search));
		if (sortBy !== "downloads") setSearchParams.append("sort", sortBy);
		if (platform !== "all") setSearchParams.append("platform", platform);
		if (compactMode) setSearchParams.append("compact", "1");

		router.replace(`?${setSearchParams}`, {
			scroll: false,
		});
	}, [sortBy, search, loader, version, platform, compactMode, page, router]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyboardShortcut);

		return () => {
			document.removeEventListener("keydown", handleKeyboardShortcut);
		};
	}, []);

	function handleLoaderSelect(
		newValue: { label: string; value: string } | null,
	) {
		const loader = newValue?.value as DatabaseModData["modloaders"][0] | "all";

		setLoader(loader || "all");
	}

	function handleVersionSelect(
		newValue: { label: string; value: string } | null,
	) {
		const version = newValue?.value;

		setVersion(version || "all");
	}

	function handleSortSelect(newValue: { label: string; value: string } | null) {
		const sort = newValue?.value as SortOrders;

		setSortBy(sort || "name");
	}

	function handlePlatformSelect(
		newValue: { label: string; value: string } | null,
	) {
		const platform = newValue?.value as Platforms | "all";

		setPlatform(platform || "all");
	}

	function handleSearch() {
		setSearch(searchInput.current?.value || "");
	}

	function handleCompactMode() {
		setCompactMode((prev) => !prev);
	}

	function handleFirstPage() {
		setPage(1);
	}

	function handleLastPage() {
		setPage(addonsData?.totalPages || 1);
	}

	function handlePreviousPage() {
		setPage((prev) => prev - 1);
	}

	function handleNextPage() {
		setPage((prev) => prev + 1);
	}

	function handleInputKeydown(event: ReactKeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSearch();
		}

		if (event.key === "Escape") {
			event.preventDefault();
			searchInput.current?.blur();
		}
	}

	function handleKeyboardShortcut(event: KeyboardEvent) {
		if ((event.ctrlKey && event.key === "k") || event.key === "/") {
			event.preventDefault();
			searchInput.current?.focus();
		}
	}

	return (
		<div className="flex flex-col min-h-screen">
			{/* Main Content */}
			<div className="flex-grow">
				{/* Navbar */}
				<nav className="navbar rounded-box shadow-base-300/20 shadow-sm mt-4">
					Create Addons Index
				</nav>

				<br />

				{/* Search & Filter & Sort & View type */}
				<div className="md:flex md:justify-between md:flex-wrap gap-4">
					<div className="md:flex md:justify-start gap-2 md:gap-6 xl:gap-2 md:flex-wrap">
						{/* Grid/list view toggle */}
						<div>
							<button
								type="button"
								className="btn border-base-content/50 bg-accent-content"
								onClick={handleCompactMode}
							>
								<span
									className={`${compactMode ? "icon-[tabler--grid]" : "icon-[tabler--list]"} text-base-content`}
								/>
							</button>
						</div>

						{/* Filter by modloader */}
						<FilterSelect
							defaultValue={modloaderOptions[0]}
							options={modloaderOptions}
							label="Filter by modloader"
							value={
								modloaderOptions.find((option) => option.value === loader) ||
								null
							}
							isLoading={!addonsData}
							isDisabled={!addonsData}
							onChange={handleLoaderSelect}
						/>

						{/* Filter by platform */}
						<FilterSelect
							defaultValue={platformOptions[0]}
							options={platformOptions}
							label="Filter by platform"
							value={
								platformOptions.find((option) => option.value === platform) ||
								null
							}
							isLoading={!addonsData}
							isDisabled={!addonsData}
							onChange={handlePlatformSelect}
						/>

						{/* Filter by version */}
						<FilterSelect
							label="Filter by version"
							isLoading={!addonsData}
							isDisabled={!addonsData}
							defaultValue={{
								value: "all",
								label: "All",
							}}
							value={{
								value: version,
								label: version === "all" ? "All" : version,
							}}
							options={[
								{
									value: "all",
									label: "All",
								},
								...versions.map((version) => ({
									value: version,
									label: version,
								})),
							]}
							onChange={handleVersionSelect}
						/>

						{/* Sort by */}
						<FilterSelect
							label="Sort by"
							defaultValue={sortByOptions[0]}
							options={sortByOptions}
							value={
								sortByOptions.find((option) => option.value === sortBy) || null
							}
							isLoading={!addonsData}
							isDisabled={!addonsData}
							onChange={handleSortSelect}
						/>
					</div>

					<div className="join rounded-2xl max-w-xs">
						<div className="input-floating join-item flex-grow">
							<input
								placeholder="Search"
								disabled={!addonsData}
								type="search"
								defaultValue={search}
								className="input disabled:border-none disabled:bg-base-100! rounded-l-2xl rounded-r-none"
								id="floatingInput"
								ref={searchInput}
								onKeyDown={handleInputKeydown}
								onEmptied={handleSearch}
							/>

							<label
								className="input-floating-label flex items-center rounded-2xl"
								htmlFor="floatingInput"
							>
								<p className="mr-1 py-1">Search addons</p>

								<span className="my-auto flex gap-2">
									<kbd className="kbd kbd-sm font-minecraft pl-2 pt-0.5">Ctrl</kbd>
									<kbd className="kbd kbd-sm font-minecraft pl-2 pt-0.5">K</kbd>
								</span>
							</label>
						</div>

						<button
							type="button"
							className="btn btn-outline bg-accent-content hover:border-base-content/70 border-base-content/40 join-item h-auto rounded-r-2xl disabled:border-none"
							onClick={handleSearch}
							disabled={!addonsData}
						>
							<span className="icon-[tabler--search] size-5" />
						</button>
					</div>
				</div>

				{/* Mods */}
				<div className="py-2 my-2">
					{addonsData && addonsData.totalMods > 0 && (
						<p className="p-1 mb-2 rounded-2xl">
							{addonsData.totalMods} total addons served.
						</p>
					)}

					<div
						className={`${compactMode ? "" : "sm:flex sm:flex-row sm:flex-wrap sm:gap-4"}`}
					>
						{addonsData ? (
							<>
								{addonsData.mods.length > 0 ? (
									<>
										{addonsData.mods.map((mod) => (
											<Fragment
												key={
													mod.modData.modrinth?.id ?? mod.modData.curseforge?.id
												}
											>
												{compactMode ? (
													<List
														mod={mod.modData}
														defaultPlatform={
															platform === "all" ? undefined : platform
														}
													/>
												) : (
													<Card
														mod={mod.modData}
														defaultPlatform={
															platform === "all" ? undefined : platform
														}
													/>
												)}
											</Fragment>
										))}
									</>
								) : (
									<p className="text-center mx-auto text-4xl my-6 flex items-center">
										<span className="icon-[tabler--alert-triangle-filled] me-2 mt-1 text-error" />
										Sorry! No results were found...
									</p>
								)}
							</>
						) : (
							<div
								className={`py-2 my-2 ${compactMode ? "" : "sm:flex sm:flex-row sm:flex-wrap sm:gap-4"}`}
							>
								{[...Array(7).keys()].map((i) => (
									<Fragment key={i}>
										{compactMode ? (
											<SkeletonList key={i} />
										) : (
											<SkeletonCard key={i} />
										)}
									</Fragment>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Pagination */}
			{(addonsData?.totalPages || 1) > 1 && (
				<nav className="flex items-center gap-x-2 justify-center mb-6">
					<button
						type="button"
						className="btn btn-soft"
						disabled={page === 1}
						onClick={handlePreviousPage}
					>
						<span className="icon-[tabler--arrow-left] size-6" />
					</button>

					<div className="flex items-center gap-x-2">
						{page > 2 && (
							<button
								type="button"
								className="btn btn-soft"
								onClick={handleFirstPage}
							>
								1
							</button>
						)}

						<p>—</p>

						{page > 1 && (
							<button
								type="button"
								className="btn btn-soft"
								onClick={handlePreviousPage}
							>
								{page - 1}
							</button>
						)}

						<button type="button" className="btn btn-soft text-bg-soft-primary">
							{page}
						</button>

						{page < (addonsData?.totalPages || 1) && (
							<button
								type="button"
								className="btn btn-soft"
								onClick={handleNextPage}
							>
								{page + 1}
							</button>
						)}

						<p>—</p>

						{page < (addonsData?.totalPages || 1) - 1 && (
							<button
								type="button"
								className="btn btn-soft"
								onClick={handleLastPage}
							>
								{addonsData?.totalPages}
							</button>
						)}
					</div>

					<button
						type="button"
						className="btn btn-soft"
						disabled={page === addonsData?.totalPages}
						onClick={handleNextPage}
					>
						<span className="icon-[tabler--arrow-right] size-6" />
					</button>
				</nav>
			)}

			{/* Footer */}
			<footer className="footer shadow-lg bg-base-200 px-6 py-4 rounded-2xl sticky bottom-0">
				<div className="flex w-full items-center justify-between">
					<aside className="grid-flow-col items-center">
						<p>
							©2025{" "}
							<Link href="https://stefdp.com" className="link2 text-riris">
								Stef
							</Link>{" "}
							&{" "}
							<Link href="https://orangc.net" className="link2 text-[#fab387]">
								orangc
							</Link>
							. This project is not affiliated with or endorsed by Mojang® or
							the Create mod.
						</p>
					</aside>

					<div className="flex gap-4 h-5">
						<Link
							href="/docs"
							className="link"
							aria-label="Documentation Link"
							title="Documentation"
						>
							<span className="icon-[tabler--book-2] size-5" />
						</Link>

						<Link
							href="https://git.stefdp.com/Stef/create-addons"
							className="link"
							aria-label="Github Link"
							title="Source Code"
						>
							<span className="icon-[tabler--brand-github] size-5" />
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
