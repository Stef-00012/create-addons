"use client";
import { type ChangeEvent, Fragment, useEffect, useState } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import type { APIModsResponse } from "./api/addons/route";
import Card from "@/components/Card";
import Select from "react-select";
import { useSearchParams } from "next/navigation";
import SkeletonCard from "@/components/SkeletonCard";
import List from "@/components/List";
import { useRouter } from 'next/navigation';

const defaultCardAmount = 9;
const defaultAddCardAmont = 9;
const defaultScrollPercentage = 60;

const defaultDisplayCardAmount = process.env.NEXT_PUBLIC_DEFAULT_CARD_AMOUNT
	? Math.abs(Number.parseInt(process.env.NEXT_PUBLIC_DEFAULT_CARD_AMOUNT)) ||
		defaultCardAmount
	: defaultCardAmount;

const addCardAmount = process.env.NEXT_PUBLIC_ADD_CARD_AMOUNT
	? Math.abs(Number.parseInt(process.env.NEXT_PUBLIC_ADD_CARD_AMOUNT)) ||
		defaultAddCardAmont
	: defaultAddCardAmont;

let addCardScrollPercentage = process.env.NEXT_PUBLIC_ADD_CARD_SCROLL_PERCENTAGE
	? Number.parseInt(process.env.NEXT_PUBLIC_ADD_CARD_SCROLL_PERCENTAGE) ||
		defaultScrollPercentage
	: defaultScrollPercentage;

if (addCardScrollPercentage > 100) addCardScrollPercentage = 100;
else if (addCardScrollPercentage < 0)
	addCardScrollPercentage = defaultScrollPercentage;

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
	const [compactMode, setCompactMode] = useState(false);
	const [version, setVersion] = useState<
		APIModsResponse[0]["versions"][0] | "all"
	>("all");
	const [search, setSearch] = useState<string>("");

	const [displayCardAmount, setDisplayCardAmount] = useState<number>(
		defaultDisplayCardAmount,
	);

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
			const scrollThreshold =
				(addCardScrollPercentage / 100) * document.body.scrollHeight;

			if (scrollPosition >= scrollThreshold) {
				setDisplayCardAmount((prev) => prev + addCardAmount);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		router.replace(`?version=${version}&modloader=${loader}&search=${encodeURIComponent(search)}&sortBy=${sortBy}`)
	}, [sortBy, search, loader, version, router.replace]);

	function handleLoaderSelect(
		newValue: { label: string; value: string } | null,
	) {
		const loader = newValue?.value as
			| APIModsResponse[0]["modloaders"][0]
			| "all";

		setLoader(loader || "all");
		setDisplayCardAmount(defaultDisplayCardAmount);
	}

	function handleVersionSelect(
		newValue: { label: string; value: string } | null,
	) {
		const version = newValue?.value;

		setVersion(version || "all");
		setDisplayCardAmount(defaultDisplayCardAmount);
	}

	function handleSortSelect(
		newValue: { label: string; value: string } | null,
	) {
		const sort = newValue?.value as SortByType;

		setSortBy(sort || "name");
		setDisplayCardAmount(defaultDisplayCardAmount);
	}

	function handleSearch(data: ChangeEvent<HTMLInputElement>) {
		const searchTerm = data.target.value;

		setSearch(searchTerm);
		setDisplayCardAmount(defaultDisplayCardAmount);
	}

	function handleCompactMode() {
		setCompactMode((prev) => !prev);
	}

	return (
		<div>
			{/* // <!-- Navbar --> */}
			<nav className="navbar rounded-box shadow-base-300/20 shadow-sm mt-4">
				Create Addons Index
			</nav>
			<br />

			{/* <!-- Search & Filter & Sort & View type --> */}
			<div className="md:flex md:justify-between">
				<div className="md:flex md:justify-start">
					{/* <!-- Grid/list view toggle --> */}
					<div className="my-6 md:my-0 mr-2">
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
					{/* <!-- Filter by modloader --> */}
					<div className="select-floating w-96 my-6 md:my-0 mr-4">
						<label
							className="select-floating-label rounded-2xl px-2 z-10"
							htmlFor="selectFloating"
						>
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
								control: () => "select",
								option: ({ isSelected }) =>
									`rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
								menuList: () =>
									"rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
							}}
							onChange={handleLoaderSelect}
						/>
					</div>

					{/* <!-- Filter by version --> */}
					<div className="select-floating w-96 my-6 md:my-0">
						<label
							className="select-floating-label rounded-2xl px-2 z-10"
							htmlFor="selectFloating"
						>
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
								control: () => "select",
								option: ({ isSelected }) =>
									`rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
								menuList: () =>
									"rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
							}}
							onChange={handleVersionSelect}
						/>
					</div>
					{/* <!-- Sort by --> */}
					<div className="select-floating w-96 my-6 md:my-0 md:ml-4">
						<label
							className="select-floating-label rounded-2xl px-2 z-10"
							htmlFor="selectFloating"
						>
							Sort by
						</label>

						<Select
							id="selectFloating"
							defaultValue={sortByOptions[0]}
							options={sortByOptions}
							value={sortByOptions.find((option) => option.value === sortBy) || null}
							unstyled
							isSearchable={false}
							isLoading={mods.length === 0}
							isDisabled={mods.length === 0}
							components={{
								DropdownIndicator: () => null,
								IndicatorSeparator: () => null,
							}}
							classNames={{
								control: () => "select",
								option: ({ isSelected }) =>
									`rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
								menuList: () =>
									"rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
							}}
							onChange={handleSortSelect}
						/>
					</div>
				</div>

				<div className="input rounded-full max-w-56">
					<span className="icon-[tabler--search] text-base-content/80 my-auto me-3 size-5 shrink-0" />
					<label className="sr-only" htmlFor="searchInput">
						Mod name
					</label>
					<input
						disabled={mods.length === 0}
						type="search"
						value={search}
						className="grow"
						placeholder="Search"
						id="searchInput"
						onChange={handleSearch}
					/>
				</div>
			</div>

			{/* <!-- Mods --> */}
			<div className={`py-2 my-2 ${compactMode ? "" : "sm:flex sm:flex-row sm:flex-wrap sm:gap-4"}`}>
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
									.slice(0, displayCardAmount)
									.map((mod) => (
										<Fragment key={mod.slug}>
											{compactMode ? (
												<List
													author={mod.author}
													categories={mod.categories}
													description={mod.description}
													downloads={mod.downloads}
													follows={mod.follows}
													icon={mod.icon}
													name={mod.name}
													platform={mod.platform}
													slug={mod.slug}
													version={mod.version}
													versions={mod.versions}
													key={mod.slug}
													modloaders={mod.modloaders}
												/>
											) : (
												<Card
													author={mod.author}
													categories={mod.categories}
													description={mod.description}
													downloads={mod.downloads}
													follows={mod.follows}
													icon={mod.icon}
													name={mod.name}
													platform={mod.platform}
													slug={mod.slug}
													version={mod.version}
													versions={mod.versions}
													key={mod.slug}
													modloaders={mod.modloaders}
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
					<div className="py-2 my-2 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</div>
				)}
			</div>

			{/* <!-- Footer --> */}
			<footer className="footer bg-base-200 px-6 py-4 mb-4 rounded-2xl absolute -bottom-px sticky start-0 w-full">
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
