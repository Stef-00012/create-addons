import Image from "next/image";
import fabric from "#/assets/fabric.png";
import forge from "#/assets/forge.ico";
import neoforge from "#/assets/neoforge.png";
import quilt from "#/assets/quilt.svg";

import { modloaderNames } from "@/constants/loaders";
import type { APIModsResponse } from "@/app/api/addons/route";

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
	versions, // Array of versions, eg. ["1.21.1", "1.21.2"]
	modloaders
}: Props) {
	return (
		<div className="card sm:max-w-lg my-2">
			<div className="card-body">
				<h5 className="card-title mb-0">
					<Image
						src={icon}
						className="size-12 inline-block rounded-2xl"
						alt="mod logo"
						width={20}
						height={20}
					/>
					{name}
					{modloaders.includes("fabric") && (
						<Image
							src={fabric}
							alt="fabric logo"
							className="mask mask-squircle size-8 inline-block"
							width={32}
							height={32}
						/>
					)}
					{modloaders.includes("forge") && (
						<Image
							src={forge}
							alt="forge logo"
							className="mask mask-squircle size-8 inline-block"
							width={32}
							height={32}
						/>
					)}
					{modloaders.includes("neoforge") && (
						<Image
							src={neoforge}
							alt="neoforge logo"
							className="mask mask-squircle size-8 inline-block"
							width={32}
							height={32}
						/>
					)}
					{modloaders.includes("quilt") && (
						<Image
							src={quilt}
							alt="qulit logo"
							className="mask mask-squircle size-8 inline-block"
							width={32}
							height={32}
						/>
					)}
				</h5>
				<ul>
					<li>
						<span className="icon-[tabler--hash] pt-2" /> Version: {version}
						({modloaders.map(modloader => modloaderNames[modloader]).join(", ")})
					</li>
					<li>
						<span className="icon-[tabler--download] pt-2" /> Downloads:{" "}
						{downloads}
					</li>
					<li>
						<span className="icon-[tabler--user] pt-2" /> Creator:{" "}
                        <a href={`https://modrinth.com/user/${author}`}>{author}</a>
					</li>
					<li>
						<span className="icon-[tabler--heart] pt-2" /> Followers: {follows}
					</li>
					<li>
						<span className="icon-[tabler--category] pt-2" /> Categories: {categories.join(", ")}
					</li>
					<li><span className="icon-[tabler--text-caption] pt-2" /> Description: {description.length > 300 ? `${description.substring(0, 300)}...` : description}</li>
				</ul>
			</div>
		</div>
	);
}
