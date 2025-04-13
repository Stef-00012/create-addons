"use client";

import { type ChangeEvent, Fragment, useEffect, useState } from "react";
import Fuse from "fuse.js";
import axios from "axios";

import type { APIModsResponse } from "@/app/api/addons/route";

import { useSearchParams, useRouter } from "next/navigation";
import SkeletonCard from "@/components/SkeletonCard";
import SkeletonList from "@/components/SkeletonList";
import Card from "@/components/Card";
import List from "@/components/List";
import Select from "react-select";

const modloaderOptions = [
	{ value: "all", label: "All" },
	{ value: "fabric", label: "Fabric" },
	{ value: "forge", label: "Forge" },
	{ value: "neoforge", label: "NeoForge" },
	{ value: "quilt", label: "Quilt" },
];

const sortByOptions = [
	{ value: "name", label: "Name" },
	{ value: "downloads", label: "Downloads" },
	{ value: "followers", label: "Followers" },
	{ value: "lastUpdated", label: "Last Updated" },
];

const modloaders = modloaderOptions.map((modloader) => modloader.value);
const sortByOrders = sortByOptions.map((sortOption) => sortOption.value);

type SortByType = "name" | "downloads" | "followers" | "lastUpdated";

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [versions, setVersions] = useState<string[]>([]);
	const [page, setPage] = useState<number>(0);
	const [addonsData, setAddonsData] = useState<APIModsResponse | null>(null);
	const [loader, setLoader] = useState<
		APIModsResponse["mods"][0]["modloaders"][0] | "all"
	>("all");
	const [sortBy, setSortBy] = useState<SortByType>("downloads");
	const [compactMode, setCompactMode] = useState(
		searchParams.get("compact") === "1",
	);
	const [version, setVersion] = useState<
		APIModsResponse["mods"][0]["versions"][0] | "all"
	>("all");
	const [search, setSearch] = useState<string>("");

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
			| APIModsResponse["mods"][0]["versions"][0]
			| "all";
		const loader = searchParams.get("modloader") as
			| APIModsResponse["mods"][0]["modloaders"][0]
			| "all";
		const search = searchParams.get("search") as string;
		const sortBy = searchParams.get("sort") as SortByType;
		const page = searchParams.get("page") as string;

		if (versions.includes(version)) {
			setVersion(version);
		}

		if (modloaders.includes(loader)) {
			setLoader(loader);
		}

		if (sortByOrders.includes(sortBy)) {
			setSortBy(sortBy);
		}

		setPage(Number.parseInt(page) < 0 ? 0 : Number.parseInt(page));
		setSearch(decodeURIComponent(search || ""));
	}, [searchParams, versions]);

	useEffect(() => {
		const fetchAddonsData = async () => {
			const apiSearchParams = new URLSearchParams({
				page: String(page),
				version: version,
				modloader: loader,
				sort: sortBy,
				search: encodeURIComponent(search),
			});

			const res = await axios.get(`/api/addons?${apiSearchParams}`);

			const data = (await res.data) as APIModsResponse;

			setAddonsData(data);
		};

		fetchAddonsData().catch((err) => console.error(err));
	}, [page, loader, sortBy, version, search]);

	useEffect(() => {
		const setSearchParams = new URLSearchParams();

		if (page > 0) setSearchParams.append("page", String(page));
		if (version !== "all") setSearchParams.append("version", version);
		if (loader !== "all") setSearchParams.append("modloader", loader);
		if (search) setSearchParams.append("search", encodeURIComponent(search));
		if (sortBy !== "downloads") setSearchParams.append("sort", sortBy);
		if (compactMode) setSearchParams.append("compact", "1");

		router.replace(`?${setSearchParams}`);
	}, [sortBy, search, loader, version, compactMode, page, router.replace]);

	function handleLoaderSelect(
		newValue: { label: string; value: string } | null,
	) {
		const loader = newValue?.value as
			| APIModsResponse["mods"][0]["modloaders"][0]
			| "all";

		setLoader(loader || "all");
	}

	function handleVersionSelect(
		newValue: { label: string; value: string } | null,
	) {
		const version = newValue?.value;

		setVersion(version || "all");
	}

	function handleSortSelect(newValue: { label: string; value: string } | null) {
		const sort = newValue?.value as SortByType;

		setSortBy(sort || "name");
	}

	function handleSearch(data: ChangeEvent<HTMLInputElement>) {
		const searchTerm = data.target.value;

		setSearch(searchTerm);
	}

	function handleCompactMode() {
		setCompactMode((prev) => !prev);
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
						<div className="">
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
						<div className="select-floating w-96 my-4 md:my-0">
							<label
								className="select-floating-label rounded-2xl px-2 z-10 flex items-center"
								htmlFor="selectFloating"
							>
								<span className="icon-[tabler--filter] me-2 size-5 shrink-0" />
								Filter by modloader
							</label>

							<Select
								id="selectFloating"
								defaultValue={modloaderOptions[0]}
								options={modloaderOptions}
								value={
									modloaderOptions.find((option) => option.value === loader) ||
									null
								}
								unstyled
								isSearchable={false}
								isLoading={!addonsData}
								isDisabled={!addonsData}
								components={{
									DropdownIndicator: () => null,
									IndicatorSeparator: () => null,
								}}
								classNames={{
									control: ({ isDisabled }) =>
										`select ${isDisabled ? "bg-base-100/50 border-none text-base-content/50" : ""}`,
									option: ({ isSelected }) =>
										`rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
									menuList: () =>
										"rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
								}}
								onChange={handleLoaderSelect}
							/>
						</div>

						{/* Filter by version */}
						<div className="select-floating w-96 my-4 md:my-0">
							<label
								className="select-floating-label rounded-2xl px-2 z-10 flex items-center"
								htmlFor="selectFloating"
							>
								<span className="icon-[tabler--filter] me-2 size-5 shrink-0" />
								Filter by version
							</label>

							<Select
								id="selectFloating"
								unstyled
								isSearchable={false}
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
								components={{
									DropdownIndicator: () => null,
									IndicatorSeparator: () => null,
								}}
								classNames={{
									control: ({ isDisabled }) =>
										`select ${isDisabled ? "bg-base-100/50 border-none text-base-content/50" : ""}`,
									option: ({ isSelected }) =>
										`rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
									menuList: () =>
										"rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
								}}
								onChange={handleVersionSelect}
							/>
						</div>
						{/* Sort by */}
						<div className="select-floating w-96 my-4 md:my-0">
							<label
								className="select-floating-label rounded-2xl px-2 z-10 flex items-center"
								htmlFor="selectFloating"
							>
								<span className="icon-[tabler--arrows-sort] me-2 size-5 shrink-0" />
								Sort by
							</label>

							<Select
								id="selectFloating"
								defaultValue={sortByOptions[0]}
								options={sortByOptions}
								value={
									sortByOptions.find((option) => option.value === sortBy) ||
									null
								}
								unstyled
								isSearchable={false}
								isLoading={!addonsData}
								isDisabled={!addonsData}
								components={{
									DropdownIndicator: () => null,
									IndicatorSeparator: () => null,
								}}
								classNames={{
									control: ({ isDisabled }) =>
										`select ${isDisabled ? "bg-base-100/50 border-none text-base-content/50" : ""}`,
									option: ({ isSelected }) =>
										`rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
									menuList: () =>
										"rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
								}}
								onChange={handleSortSelect}
							/>
						</div>
					</div>

					<div className="input-floating rounded-full max-w-56">
						<input
							placeholder="Search"
							disabled={!addonsData}
							type="search"
							value={search}
							onChange={handleSearch}
							className="input disabled:border-none"
							id="floatingInput"
						/>
						<label
							className="input-floating-label flex items-center rounded-2xl"
							htmlFor="floatingInput"
						>
							<span className="icon-[tabler--search] me-2 size-5 shrink-0 ml-1" />
							<p className="mr-1 py-1">Search addons</p>
						</label>
					</div>
				</div>

				{/* Mods */}
				<div className="py-2 my-2">
					<p className="p-1 mb-2 rounded-2xl">
						{addonsData?.totalMods} total addons served.
					</p>
					<div
						className={`${compactMode ? "" : "sm:flex sm:flex-row sm:flex-wrap sm:gap-4"}`}
					>
						{addonsData ? (
							<>
								{addonsData.mods.length > 0 ? (
									<>
										{addonsData.mods.map((mod) => (
											<Fragment key={mod.slug}>
												{compactMode ? <List mod={mod} /> : <Card mod={mod} />}
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
								{compactMode ? (
									<>
										{[...Array(7).keys()].map((i) => (
											<SkeletonList key={i} />
										))}
									</>
								) : (
									<>
										{[...Array(7).keys()].map((i) => (
											<SkeletonCard key={i} />
										))}
									</>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Pagination */}
			<nav className="flex items-center gap-x-2 justify-center mb-6">
				<button type="button" className="btn btn-soft">
					<span className="icon-[tabler--arrow-left] size-6" />
				</button>
				<div className="flex items-center gap-x-2">
					<button
						type="button"
						className="btn btn-soft btn-square aria-[current='page']:text-bg-soft-primary"
					>
						1
					</button>
					<button
						type="button"
						className="btn btn-soft btn-square aria-[current='page']:text-bg-soft-primary"
						aria-current="page"
					>
						2
					</button>
					<button
						type="button"
						className="btn btn-soft btn-square aria-[current='page']:text-bg-soft-primary"
					>
						3
					</button>
				</div>
				<button type="button" className="btn btn-soft">
					<span className="icon-[tabler--arrow-right] size-6" />
				</button>
			</nav>

			{/* Footer */}
			<footer className="footer shadow-lg bg-base-200 px-6 py-4 rounded-2xl sticky bottom-0">
				<div className="flex w-full items-center justify-between">
					<aside className="grid-flow-col items-center">
						<p>
							©2025{" "}
							<a href="https://stefdp.com" className="link2 text-riris">
								Stef
							</a>{" "}
							&{" "}
							<a href="https://orangc.net" className="link2 text-[#fab387]">
								orangc
							</a>
							. This project is not affiliated with or endorsed by Mojang® or
							the Create mod.
						</p>
					</aside>
					<div className="flex gap-4 h-5">
						<a
							href="https://github.com/Stef-00012/create-addons"
							className="link"
							aria-label="Github Link"
						>
							<span className="icon-[tabler--brand-github] size-5" />
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
