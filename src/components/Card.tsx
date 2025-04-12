import Image from "next/image";
import fabric from "#/assets/fabric.png";
import forge from "#/assets/forge.ico";
import neoforge from "#/assets/neoforge.png";
import quilt from "#/assets/quilt.svg";
import defaultModIcon from "#/assets/defaultModIcon.svg";

import { modloaderNames } from "@/constants/loaders";
import type { APIModsResponse } from "@/app/api/addons/route";
import millify from "millify";

interface Props {
	platform: APIModsResponse[0]["platform"];
	slug: APIModsResponse[0]["slug"];
	author: APIModsResponse[0]["author"];
	downloads: APIModsResponse[0]["downloads"];
	description: APIModsResponse[0]["description"];
	icon: APIModsResponse[0]["icon"];
	name: APIModsResponse[0]["name"];
	version: APIModsResponse[0]["version"];
	versions: APIModsResponse[0]["versions"];
	categories: APIModsResponse[0]["categories"];
	follows: APIModsResponse[0]["follows"];
	modloaders: APIModsResponse[0]["modloaders"];
}

export default function Card({
	icon,
	name,
	version,
	downloads,
	platform, // only "modrinth" for now
	author,
	categories,
	description,
	follows,
	slug, // used for the url, modrinth.com/mod/<SLUG>
	versions,
	modloaders,
}: Props) {
	return (
		<div className="card sm:max-w-lg my-4 sm:my-0 sm:flex-auto">
			<div className="card-body">
				<h5 className="card-title mb-0">
					<Image
						src={icon === "" ? defaultModIcon : icon}
						className="size-10 inline-block rounded-2xl mr-2"
						alt="mod logo"
						width={20}
						height={20}
					/>
					<a href={`https://modrinth.com/mod/${slug}`} className="link-primary">
						{name}
					</a>
					{modloaders.includes("fabric") && (
						<Image
							src={fabric}
							alt="fabric logo"
							className="mask mask-squircle size-6 inline-block mx-1"
							width={32}
							height={32}
						/>
					)}
					{modloaders.includes("forge") && (
						<Image
							src={forge}
							alt="forge logo"
							className="mask mask-squircle size-6 inline-block mx-1"
							width={32}
							height={32}
						/>
					)}
					{modloaders.includes("neoforge") && (
						<Image
							src={neoforge}
							alt="neoforge logo"
							className="mask mask-squircle size-6 inline-block mx-1"
							width={32}
							height={32}
						/>
					)}
					{modloaders.includes("quilt") && (
						<Image
							src={quilt}
							alt="quilt logo"
							className="mask mask-squircle size-6 inline-block mx-1"
							width={32}
							height={32}
						/>
					)}
				</h5>
				<ul>
					<li>
						<span className="icon-[tabler--brand-minecraft] pt-2" />{" "}
						Modloaders:
						{` ${modloaders
							.map((modloader) => modloaderNames[modloader])
							.join(", ")}`}
					</li>
					<li>
						<span className="icon-[tabler--hash] pt-2" /> Versions:{" "}
						{versions.join(", ")}
					</li>
					<li>
						<span className="icon-[tabler--download] pt-2" /> Downloads:{" "}
						{millify(downloads, {
							precision: 2,
						})}
					</li>
					<li>
						<span className="icon-[tabler--user] pt-2" /> Creator:{" "}
						<a
							className="text-primary hover:underline"
							href={`https://modrinth.com/user/${author}`}
							target="_blank"
							rel="noreferrer"
						>
							{author}
						</a>
					</li>
					<li>
						<span className="icon-[tabler--heart] pt-2" /> Followers:{" "}
						{millify(follows, {
							precision: 2,
						})}
					</li>
					<li>
						<span className="icon-[tabler--category] pt-2" /> Categories:{" "}
						{categories
							.map(
								(category) =>
									category.charAt(0).toUpperCase() + category.slice(1),
							)
							.join(", ")}
					</li>
					<li>
						<span className="icon-[tabler--text-caption] pt-2" /> Description:{" "}
						{description.length > 300
							? `${description.substring(0, 300)}...`
							: description}
					</li>
				</ul>
				<div className="card-actions mt-auto pt-2 -mb-3">
					<a href={`https://modrinth.com/mod/${slug}`} className="btn btn-outline btn-primary flex items-center">
						<span className="icon-[tabler--link] mt-1 me-1" />
						Modrinth
					</a>
				</div>
			</div>
		</div>
	);
}
