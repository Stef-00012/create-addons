"use client";
import { type ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import type { APIModsResponse } from "./api/addons/route";
import Card from "@/components/Card";

// import Image from "next/image";

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

export default function Home() {
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

	function handleLoaderSelect(data: ChangeEvent<HTMLSelectElement>) {
		const loader = data.target.value as
			| APIModsResponse[0]["modloaders"][0]
			| "all";

		setLoader(loader);
		setDisplayCardAmount(defaultDisplayCardAmount);
	}

	function handleVersionSelect(data: ChangeEvent<HTMLSelectElement>) {
		const version = data.target.value;

		setVersion(version);
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
			<nav className="navbar rounded-box shadow-base-300/20 shadow-sm mt-4">
				<a
					className="link text-base-content link-neutral text-xl no-underline"
					// biome-ignore lint/a11y/useValidAnchor: <explanation>
					href="#"
				>
					Create Mod Index
				</a>
			</nav>
			<br />

			{/* <!-- Search & Filter --> */}
			<div className="sm:flex sm:justify-between">
				<div className="sm:flex sm:justify-start">
					{/* <!-- Filter by modloader --> */}
					<div className="select-floating w-96 my-6 sm:my-0 mr-4">
						<select
							className="select"
							aria-label="Select floating label"
							defaultValue="all"
							id="selectFloating"
							onChange={handleLoaderSelect}
						>
							<option value="all">All</option>
							<option value="fabric">Fabric</option>
							<option value="forge">Forge</option>
							<option value="neoforge">NeoForge</option>
							<option value="quilt">Quilt</option>
						</select>
						<label className="select-floating-label rounded-lg" htmlFor="selectFloating">
							Filter by modloader
						</label>
					</div>

					{/* <!-- Filter by version --> */}
					<div className="select-floating w-96 my-6 sm:my-0">
						<select
							className="select"
							aria-label="Select floating label"
							id="selectFloating"
							onChange={handleVersionSelect}
						>
							<option value="all">All</option>
							{mods
								.find((mod) => mod.slug === "create")
								?.versions.map((version) => (
									<option value={version} key={version}>
										{version}
									</option>
								))}
						</select>
						<label className="select-floating-label rounded-lg" htmlFor="selectFloating">
							Filter by version
						</label>
					</div>
				</div>

				<div className="input rounded-full max-w-56">
					<span className="icon-[tabler--search] text-base-content/80 my-auto me-3 size-5 shrink-0" />
					<label className="sr-only" htmlFor="searchInput">
						Mod name
					</label>
					<input
						type="search"
						className="grow"
						placeholder="Search"
						id="searchInput"
						onChange={handleSearch}
					/>
				</div>
			</div>

			{/* <!-- Mods --> */}
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
							<p>No Mods found</p>
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
							.
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
