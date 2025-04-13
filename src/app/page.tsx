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

const defaultCardAmount = 9;
const defaultAddCardAmont = 9;
const defaultScrollPercentageBottom = 80;
const defaultScrollPercentageTop = 30;

const defaultDisplayCardAmount = process.env.NEXT_PUBLIC_DEFAULT_CARD_AMOUNT
	? Math.abs(Number.parseInt(process.env.NEXT_PUBLIC_DEFAULT_CARD_AMOUNT)) ||
	defaultCardAmount
	: defaultCardAmount;

const addCardAmount = process.env.NEXT_PUBLIC_ADD_CARD_AMOUNT
	? Math.abs(Number.parseInt(process.env.NEXT_PUBLIC_ADD_CARD_AMOUNT)) ||
	defaultAddCardAmont
	: defaultAddCardAmont;

let addCardScrollPercentageBottom = process.env.NEXT_PUBLIC_ADD_CARD_SCROLL_PERCENTAGE_BOTTOM
	? Number.parseInt(process.env.NEXT_PUBLIC_ADD_CARD_SCROLL_PERCENTAGE_BOTTOM) ||
	defaultScrollPercentageBottom
	: defaultScrollPercentageBottom;

if (addCardScrollPercentageBottom > 100) addCardScrollPercentageBottom = 100;
else if (addCardScrollPercentageBottom < 0)
	addCardScrollPercentageBottom = defaultScrollPercentageBottom;

let addCardScrollPercentageTop = process.env.NEXT_PUBLIC_ADD_CARD_SCROLL_PERCENTAGE_TOP
	? Number.parseInt(process.env.NEXT_PUBLIC_ADD_CARD_SCROLL_PERCENTAGE_TOP) ||
	defaultScrollPercentageTop
	: defaultScrollPercentageTop;

if (addCardScrollPercentageTop > 100) addCardScrollPercentageTop = 100;
else if (addCardScrollPercentageTop < 0)
	addCardScrollPercentageTop = defaultScrollPercentageTop;

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

type SortByType = "name" | "downloads" | "followers" | "lastUpdated";

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [mods, setMods] = useState<APIModsResponse>([]);
	const [filteredMods, setFilteredMods] = useState<APIModsResponse>([]);
	const [loader, setLoader] = useState<
		APIModsResponse[0]["modloaders"][0] | "all"
	>("all");
	const [sortBy, setSortBy] = useState<SortByType>("downloads");
	const [compactMode, setCompactMode] = useState(
		searchParams.get("compact") === "1",
	);
	const [version, setVersion] = useState<
		APIModsResponse[0]["versions"][0] | "all"
	>("all");
	const [search, setSearch] = useState<string>("");

	const [displayCardAmount, setDisplayCardAmount] = useState<number>(
		defaultDisplayCardAmount,
	);

	useEffect(() => {
		console.log(`Currently displaying mods ${displayCardAmount <= 36 ? 0 : displayCardAmount - 36}-${displayCardAmount} (Total: ${mods.length})`)
	}, [displayCardAmount, mods])

	useEffect(() => {
		const fetchMods = async () => {
			const res = await axios.get("/api/addons");

			const data = (await res.data) as APIModsResponse;

			setMods(data);
			setFilteredMods(data);
		};

		fetchMods().catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (mods.length === 0) return;

		const versions = mods.find((mod) => mod.slug === "create")?.versions || [];
		const modloaders = modloaderOptions.map((modloader) => modloader.value);
		const sortByOrders = sortByOptions.map((sortOption) => sortOption.value);

		const version = searchParams.get("version") as
			| APIModsResponse[0]["versions"][0]
			| "all";
		const loader = searchParams.get("modloader") as
			| APIModsResponse[0]["modloaders"][0]
			| "all";
		const search = searchParams.get("search") as string;
		const sortBy = searchParams.get("sortBy") as SortByType;

		if (versions.includes(version)) {
			setVersion(version);
		}

		if (modloaders.includes(loader)) {
			setLoader(loader);
		}

		if (sortByOrders.includes(sortBy)) {
			setSortBy(sortBy);
		}

		setSearch(decodeURIComponent(search || ""));
	}, [mods, searchParams.get]);

	useEffect(() => {
		const fuse = new Fuse(mods, {
			keys: ["name", "description", "slug", "categories"],
			threshold: 0.4,
		});

		if (search === "") {
			setFilteredMods(mods);

			return;
		}

		const searchResult = fuse.search(search);
		const resultMods = searchResult.map((result) => result.item);

		setFilteredMods(resultMods);
	}, [search, mods]);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + window.innerHeight;
			const scrollThresholdBottom =
				(addCardScrollPercentageBottom / 100) * document.body.scrollHeight;
			const scrollThresholdTop =
				(addCardScrollPercentageTop / 100) * document.body.scrollHeight;

			if (scrollPosition >= scrollThresholdBottom) {
				setDisplayCardAmount((prev) => Math.min(mods.length, prev + addCardAmount));
			}

			if (scrollPosition <= scrollThresholdTop) {
				setDisplayCardAmount((prev) => Math.max(defaultDisplayCardAmount, prev - addCardAmount));
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [mods]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (!document || !window) return;
			const scrollPosition = window.scrollY + window.innerHeight;

			const scrollThresholdTop =
				(addCardScrollPercentageTop / 100) * document.body.scrollHeight;

			if (scrollPosition <= scrollThresholdTop) {
				setDisplayCardAmount((prev) => Math.max(defaultDisplayCardAmount, prev - addCardAmount));
			}
		}, 500)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		router.replace(
			`?version=${version}&modloader=${loader}&sortBy=${sortBy}&compact=${compactMode ? 1 : 0}&search=${encodeURIComponent(search)}`,
		);
	}, [sortBy, search, loader, version, compactMode, router.replace]);

	function handleLoaderSelect(
		newValue: { label: string; value: string } | null,
	) {
		const loader = newValue?.value as
			| APIModsResponse[0]["modloaders"][0]
			| "all";

		setDisplayCardAmount(defaultDisplayCardAmount);
		setLoader(loader || "all");
	}

	function handleVersionSelect(
		newValue: { label: string; value: string } | null,
	) {
		const version = newValue?.value;

		setDisplayCardAmount(defaultDisplayCardAmount);
		setVersion(version || "all");
	}

	function handleSortSelect(newValue: { label: string; value: string } | null) {
		const sort = newValue?.value as SortByType;

		setDisplayCardAmount(defaultDisplayCardAmount);
		setSortBy(sort || "name");
	}

	function handleSearch(data: ChangeEvent<HTMLInputElement>) {
		const searchTerm = data.target.value;

		setDisplayCardAmount(defaultDisplayCardAmount);
		setSearch(searchTerm);
	}

	function handleCompactMode() {
		setDisplayCardAmount(defaultDisplayCardAmount);
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
								isLoading={mods.length === 0}
								isDisabled={mods.length === 0}
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
								isLoading={mods.length === 0}
								isDisabled={mods.length === 0}
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
									...(
										mods.find((mod) => mod.slug === "create")?.versions || []
									).map((version) => ({
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
									sortByOptions.find((option) => option.value === sortBy) || null
								}
								unstyled
								isSearchable={false}
								isLoading={mods.length === 0}
								isDisabled={mods.length === 0}
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
							disabled={mods.length === 0}
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
					<p className="p-1 mb-2 rounded-2xl">{mods.length} total addons served.</p>
					<div className={`${compactMode ? "" : "sm:flex sm:flex-row sm:flex-wrap sm:gap-4"}`}>
						{mods.length > 0 ? (
							<>
								{filteredMods.length > 0 ? (
									<>
										{filteredMods
											.filter((mod) => {
												return (
													(loader === "all" || mod.modloaders.includes(loader)) &&
													(version === "all" || mod.versions.includes(version))
												);
											})
											.sort((a, b) => {
												if (sortBy === "downloads") {
													return b.downloads - a.downloads;
												}

												if (sortBy === "followers") {
													return b.follows - a.follows;
												}

												if (sortBy === "lastUpdated") {
													return (
														new Date(b.modified).getTime() -
														new Date(a.modified).getTime()
													);
												}

												if (sortBy === "name") {
													return a.name.localeCompare(b.name);
												}

												return 0;
											})
											.slice(
												displayCardAmount <= 36 ? 0 : displayCardAmount - 36,
												displayCardAmount
											)
											.map((mod) => (
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
