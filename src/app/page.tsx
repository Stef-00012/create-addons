"use client";
import { type ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import type { APIModsResponse } from "./api/addons/route";
import Card from "@/components/Card";
import Select from 'react-select';
import { useSearchParams } from 'next/navigation'

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
	{ value: "downloads", label: "downloads" },
	{ value: "followers", label: "Followers" },
	{ value: "lastUpdated", label: "Last Updated" },
];

export default function Home() {
	const searchParams = useSearchParams()

	const [mods, setMods] = useState<APIModsResponse>([]);
	const [filteredMods, setFilteredMods] = useState<APIModsResponse>([]);
	const [loader, setLoader] = useState<
		APIModsResponse[0]["modloaders"][0] | "all"
	>("all");
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

		const versions = mods.find(mod => mod.slug === "create")?.versions || [];
		const modloaders = modloaderOptions.map(modloader => modloader.value);

		const version = searchParams.get("version") as APIModsResponse[0]["versions"][0] | "all";
		const loader = searchParams.get("modloader") as APIModsResponse[0]["modloaders"][0] | "all";
		const search = searchParams.get("search") as string;

		if (versions.includes(version)) {
			setVersion(version);
		}

		if (modloaders.includes(loader)) {
			setLoader(loader);
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

	function handleLoaderSelect(newValue: { label: string; value: string } | null) {
		const loader = newValue?.value as
			| APIModsResponse[0]["modloaders"][0]
			| "all";

		setLoader(loader || "all");
		setDisplayCardAmount(defaultDisplayCardAmount);
	}

	function handleVersionSelect(newValue: { label: string; value: string } | null) {
		const version = newValue?.value;

		setVersion(version || "all");
		setDisplayCardAmount(defaultDisplayCardAmount);
	}

	function handleSearch(data: ChangeEvent<HTMLInputElement>) {
		const searchTerm = data.target.value;

		setSearch(searchTerm);
		setDisplayCardAmount(defaultDisplayCardAmount);
	}

	return (
		<div>
			{/* // <!-- Navbar --> */}
			<nav className="navbar rounded-box shadow-base-300/20 shadow-sm mt-4">Create Addons Index</nav>
			<br />

			{/* <!-- Search & Filter & Sort & View type --> */}
			<div className="md:flex md:justify-between">
				<div className="md:flex md:justify-start">
					{/* <!-- Grid/list view toggle --> */}
					<div className="my-6 md:my-0 mr-2">
						<button className="btn border-base-content/50 bg-accent-content"><span className="icon-[tabler--grid] text-base-content"></span></button>
					</div>
					{/* <!-- Filter by modloader --> */}
					<div className="select-floating w-96 my-6 md:my-0 mr-4">
						<label className="select-floating-label rounded-2xl px-2 z-10" htmlFor="selectFloating">
							Filter by modloader
						</label>

						<Select
							id="selectFloating"
							defaultValue={modloaderOptions[0]}
							options={modloaderOptions}
							value={modloaderOptions.find((option) => option.value === loader) || null}
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
								option: ({ isSelected }) => `rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
								menuList: () => "rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
							}}
							onChange={handleLoaderSelect}
						/>
					</div>

					{/* <!-- Filter by version --> */}
					<div className="select-floating w-96 my-6 md:my-0">
						<label className="select-floating-label rounded-2xl px-2 z-10" htmlFor="selectFloating">
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
								...(mods.find((mod) => mod.slug === "create")?.versions || []).map((version) => ({
									value: version,
									label: version,
								}))
							]}
							components={{
								DropdownIndicator: () => null,
								IndicatorSeparator: () => null,
							}}
							classNames={{
								control: () => "select",
								option: ({ isSelected }) => `rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
								menuList: () => "rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
							}}
							onChange={handleVersionSelect}
						/>
					</div>
					{/* <!-- Sort by --> */}
					<div className="select-floating w-96 my-6 md:my-0 md:ml-4">
						<label className="select-floating-label rounded-2xl px-2 z-10" htmlFor="selectFloating">
							Sort by
						</label>

						<Select
							id="selectFloating"
							defaultValue={sortByOptions[0]}
							options={sortByOptions}
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
								option: ({ isSelected }) => `rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
								menuList: () => "rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
							}}
							onChange={handleLoaderSelect}
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
			{/*<div className="py-2 my-2"> this is for list view */}
			<div className="py-2 my-2 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
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
									.slice(0, displayCardAmount)
									.map((mod) => (
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
									))}
							</>
						) : (
							<p className="text-center mx-auto text-4xl my-6 flex items-center"><span className="icon-[tabler--alert-triangle-filled] me-2 mt-1 text-error" />Sorry! No results were found...</p>
						)}
					</>
				) : (
					<div className="py-2 my-2 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
						<div className="card sm:max-w-lg my-4 sm:my-0 skeleton skeleton-animated sm:flex-auto">
							<div className="card-body">
								<ul>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--download] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--user] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--heart] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--category] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--text-caption] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--link] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
								</ul>
							</div>
							<div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								<span className="loading loading-spinner loading-lg text-primary" />
							</div>
						</div>
						<div className="card sm:max-w-lg my-4 sm:my-0 skeleton skeleton-animated sm:flex-auto">
							<div className="card-body">
								<ul>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--download] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--user] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--heart] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--category] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--text-caption] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--link] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
								</ul>
							</div>
							<div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								<span className="loading loading-spinner loading-lg text-primary" />
							</div>
						</div>
						<div className="card sm:max-w-lg my-4 sm:my-0 skeleton skeleton-animated sm:flex-auto">
							<div className="card-body">
								<ul>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--download] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--user] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--heart] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--category] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--text-caption] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--link] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
								</ul>
							</div>
							<div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								<span className="loading loading-spinner loading-lg text-primary" />
							</div>
						</div>
						<div className="card sm:max-w-lg my-4 sm:my-0 skeleton skeleton-animated sm:flex-auto">
							<div className="card-body">
								<ul>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--download] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--user] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--heart] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--category] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--text-caption] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--link] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
								</ul>
							</div>
							<div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								<span className="loading loading-spinner loading-lg text-primary" />
							</div>
						</div>
						<div className="card sm:max-w-lg my-4 sm:my-0 skeleton skeleton-animated sm:flex-auto">
							<div className="card-body">
								<ul>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--download] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--user] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--heart] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--category] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--text-caption] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--link] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
								</ul>
							</div>
							<div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								<span className="loading loading-spinner loading-lg text-primary" />
							</div>
						</div>
						<div className="card sm:max-w-lg my-4 sm:my-0 skeleton skeleton-animated sm:flex-auto">
							<div className="card-body">
								<ul>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--download] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--user] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--heart] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--category] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--text-caption] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--link] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
								</ul>
							</div>
							<div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								<span className="loading loading-spinner loading-lg text-primary" />
							</div>
						</div>
						<div className="card sm:max-w-lg my-4 sm:my-0 skeleton skeleton-animated sm:flex-auto">
							<div className="card-body">
								<ul>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--hash] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--download] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--user] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--heart] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--category] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--text-caption] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
									<li>
										<span className="icon-[tabler--link] pt-2" />
										<p className="skeleton skeleton-animated pr-70" />
									</li>
								</ul>
							</div>
							<div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								<span className="loading loading-spinner loading-lg text-primary" />
							</div>
						</div>
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
							. This project is not affiliated with or endorsed by Mojang® or the Create mod.
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
