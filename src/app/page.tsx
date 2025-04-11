"use client";
import { useEffect, useState } from "react";
import axios from "axios";

// import Image from "next/image";
import type { APIModsResponse } from "./api/addons/route";
import Card from "@/components/Card";

export default function Home() {
	const [mods, setMods] = useState<APIModsResponse>([]);
	const [loader, setLoader] = useState<
		APIModsResponse[0]["modloaders"][0] | "all"
	>("all");
	const [version, setVersion] = useState<
		APIModsResponse[0]["versions"][0] | "all"
	>("all");
	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		const fetchMods = async () => {
			const res = await axios.get("/api/addons");

			const data = (await res.data) as APIModsResponse;
			setMods(data);
		};

		fetchMods().catch((err) => console.error(err));
	}, []);

	return (
		<>
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
					<div className="select-floating w-96 mr-4">
						<select
							className="select"
							aria-label="Select floating label"
							defaultValue="all"
							id="selectFloating"
							onChange={(data) => {
								const loader = data.target.value as
									| APIModsResponse[0]["modloaders"][0]
									| "all";

								setLoader(loader);
							}}
						>
							<option value="all">All</option>
							<option value="fabric">Fabric</option>
							<option value="forge">Forge</option>
							<option value="neoforge">NeoForge</option>
							<option value="quilt">Quilt</option>
						</select>
						<label className="select-floating-label" htmlFor="selectFloating">
							Filter by modloader
						</label>
					</div>

					{/* <!-- Filter by version --> */}
					<div className="select-floating w-96">
						<select
							className="select"
							aria-label="Select floating label"
							id="selectFloating"
							onChange={(data) => {
								const version = data.target.value;

								setVersion(version);
							}}
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
						<label className="select-floating-label" htmlFor="selectFloating">
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
						onChange={(data) => {
							const searchTerm = data.target.value;

							setSearch(searchTerm);
						}}
					/>
				</div>
			</div>

			{/* <!-- Mods --> */}
			<div className="py-2 sm:flex sm:flex-wrap sm:justify-between my-2">
				{/* for orangc, <Card> element is in /src/components/Card.tsx */}

				{mods.length > 0 ? (
					<>
						{mods
							.filter((mod) => {
								return (
									(loader === "all" || mod.modloaders.includes(loader)) &&
									(version === "all" || mod.versions.includes(version)) &&
									(mod.name.toLowerCase().includes(search.toLowerCase()) ||
										mod.slug.toLowerCase().includes(search.toLowerCase()) ||
										mod.description
											.toLowerCase()
											.includes(search.toLowerCase()))
								);
							})
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
					<div>
						<b className="underline text-red-500">Some Loading Screen</b>
					</div>
				)}
			</div>

			<br />

			{/* <!-- Footer --> */}
			<footer className="footer bg-base-200/60 px-6 py-4 rounded-2xl">
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
		</>
	);
}
