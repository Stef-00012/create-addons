"use client";
import { useEffect, useState } from "react";
import axios from "axios";

// import Image from "next/image";
import type { APIModsResponse } from "./api/addons/route";
import Card from "@/components/card";

export default function Home() {
	const [mods, setMods] = useState<APIModsResponse>([]);

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
					<div className="max-w-sm my-2 mr-2">
						{/* <!-- Filter by modloader --> */}
						<select
							multiple
							data-select='{
                        "placeholder": "<span className="inline-flex items-center"><span className="icon-[tabler--filter] shrink-0 size-4 me-2"></span> Filter by modloader</span>",
                        "toggleTag": "<button type="button" aria-expanded="false"></button>",
                        "toggleclassNamees": "advance-select-toggle select-disabled:pointer-events-none select-disabled:opacity-40",
                        "toggleCountText": "selected",
                        "toggleCountTextMinItems": 5,
                        "dropdownclassNamees": "advance-select-menu",
                        "optionclassNamees": "advance-select-option selected:select-active",
                        "optionTemplate": "<div className="flex justify-between items-center w-full"><span data-title></span><span className="icon-[tabler--check] shrink-0 size-4 text-primary hidden selected:block "></span></div>",
                        "extraMarkup": "<span className="icon-[tabler--caret-up-down] shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 "></span>"
                        }'
							className="hidden"
						>
							<option value="name">Fabric</option>
							<option value="email">Forge</option>
							<option value="description">Neoforge</option>
							<option value="user_id">Quilt</option>
						</select>
					</div>

					{/* <!-- Filter by version --> */}
					<div className="max-w-sm my-2 mr-2">
						<select
							multiple
							data-select='{
                        "placeholder": "<span className="inline-flex items-center"><span className="icon-[tabler--filter] shrink-0 size-4 me-2"></span> Filter by version</span>",
                        "toggleTag": "<button type="button" aria-expanded="false"></button>",
                        "toggleclassNamees": "advance-select-toggle select-disabled:pointer-events-none select-disabled:opacity-40",
                        "toggleCountText": "selected",
                        "toggleCountTextMinItems": 5,
                        "dropdownclassNamees": "advance-select-menu",
                        "optionclassNamees": "advance-select-option selected:select-active",
                        "optionTemplate": "<div className="flex justify-between items-center w-full"><span data-title></span><span className="icon-[tabler--check] shrink-0 size-4 text-primary hidden selected:block "></span></div>",
                        "extraMarkup": "<span className="icon-[tabler--caret-up-down] shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 "></span>"
                        }'
							className="hidden"
						>
							<option value="name">1.21.5</option>
							<option value="email">1.21.4</option>
							<option value="description">1.21.3</option>
							<option value="user_id">1.21.2</option>
						</select>
					</div>
				</div>

				<div className="input rounded-full max-w-56 sm:my-2">
					<span className="icon-[tabler--search] text-base-content/80 my-auto me-3 size-5 shrink-0" />
					<label className="sr-only" htmlFor="searchInput">
						Mod name
					</label>
					<input
						type="search"
						className="grow"
						placeholder="Search"
						id="searchInput"
					/>
				</div>
			</div>

			{/* <!-- Mods --> */}
			<div className="py-2 sm:flex sm:flex-wrap sm:justify-between my-2">
				{mods.length > 0 ? (
					<>
						{mods.map((mod) => (
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
						<p>Some Loading Screen</p>
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
