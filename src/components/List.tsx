import Image from "next/image";
import fabric from "#/assets/fabric.png";
import forge from "#/assets/forge.ico";
import neoforge from "#/assets/neoforge.png";
import quilt from "#/assets/quilt.svg";
import defaultModIcon from "#/assets/defaultModIcon.svg";

import type { APIModsResponse } from "@/app/api/addons/route";
import millify from "millify";
import { Tooltip } from "react-tooltip";

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

export default function List({
	icon,
	name,
	version,
	downloads,
	platform, // only "modrinth" for now
	author,
	categories,
	description,
	follows,
	slug,
	versions,
	modloaders,
}: Props) {
	return (
		<div className="card my-4 w-full">
			<div className="card-body">
				<div className="flex justify-between items-baseline pb-2">
					<h5 className="card-title mb-0">
						<Image
							src={icon === "" ? defaultModIcon : icon}
							className="size-10 inline-block rounded-2xl mr-2"
							alt="mod logo"
							width={20}
							height={20}
						/>
						<a
							href={`https://modrinth.com/mod/${slug}`}
							className=""
							target="_blank"
							rel="noreferrer"
						>
							{name}{" "}
						</a>
						{modloaders.includes("fabric") && (
							<>
								<Image
									src={fabric}
									alt="fabric logo"
									className="mask mask-squircle size-6 inline-block mx-1"
									width={32}
									height={32}
									data-tooltip-content="Fabric"
									data-tooltip-id="fabric-tooltip"
								/>
								<Tooltip
									id="fabric-tooltip"
									disableStyleInjection={true}
									className="rounded-2xl bg-base-200 px-2 p-1 text-lg shadow"
								/>
							</>
						)}
						{modloaders.includes("forge") && (
							<>
								<Image
									src={forge}
									alt="forge logo"
									className="mask mask-squircle size-6 inline-block mx-1"
									width={32}
									height={32}
									data-tooltip-content="Forge"
									data-tooltip-id="forge-tooltip"
								/>
								<Tooltip
									id="forge-tooltip"
									disableStyleInjection={true}
									className="rounded-2xl bg-base-200 px-2 p-1 text-lg shadow"
								/>
							</>
						)}
						{modloaders.includes("neoforge") && (
							<>
								<Image
									src={neoforge}
									alt="neoforge logo"
									className="mask mask-squircle size-6 inline-block mx-1"
									width={32}
									height={32}
									data-tooltip-content="NeoForge"
									data-tooltip-id="neoforge-tooltip"
								/>
								<Tooltip
									id="neoforge-tooltip"
									disableStyleInjection={true}
									className="rounded-2xl bg-base-200 px-2 p-1 text-lg shadow"
								/>
							</>
						)}
						{modloaders.includes("quilt") && (
							<>
								<Image
									src={quilt}
									alt="quilt logo"
									className="mask mask-squircle size-6 inline-block mx-1"
									width={32}
									height={32}
									data-tooltip-content="Quilt"
									data-tooltip-id="quilt-tooltip"
								/>
								<Tooltip
									id="quilt-tooltip"
									disableStyleInjection={true}
									className="rounded-2xl bg-base-200 px-2 p-1 text-lg shadow"
								/>
							</>
						)}
					</h5>
					<div className="card-actions">
						<a
							href={`https://modrinth.com/mod/${slug}`}
							className="btn btn-outline btn-primary flex items-center"
							target="_blank"
							rel="noreferrer"
						>
							<span className="icon-[tabler--link] me-1" />
							Modrinth
						</a>
					</div>
				</div>
				<div className="flex flex-wrap justify-start">
					<div className="flex-wrap sm:flex">
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--hash] pt-2" />{" "}
							{versions.join(", ")}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--download] pt-2" />{" "}
							{millify(downloads, {
								precision: 2,
							})}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--user] pt-2" />{" "}
							<a
								className="text-primary hover:underline"
								href={`https://modrinth.com/user/${author}`}
								target="_blank"
								rel="noreferrer"
							>
								{author}
							</a>
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--heart] pt-2" />{" "}
							{millify(follows, {
								precision: 2,
							})}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--category] pt-2" />{" "}
							{categories
								.map(
									(category) =>
										category.charAt(0).toUpperCase() + category.slice(1),
								)
								.join(", ")}
						</p>
					</div>
					<p className="flex-grow" />
				</div>
			</div>
		</div>
	);
}
