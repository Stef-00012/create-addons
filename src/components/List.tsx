import defaultModIcon from "#/assets/defaultModIcon.svg";
import neoforge from "#/assets/neoforge.png";
import fabric from "#/assets/fabric.png";
import forge from "#/assets/forge.ico";
import quilt from "#/assets/quilt.svg";

import millify from "millify";

import type { APIModsResponse } from "@/app/api/addons/route";

import { Tooltip } from "react-tooltip";
import Image from "next/image";

interface Props {
	mod: APIModsResponse[0];
}

export default function List({ mod }: Props) {
	return (
		<div className="card my-4 w-full">
			<div className="card-body">
				<div className="flex justify-between items-baseline pb-2">
					<h5 className="card-title mb-0">
						<Image
							src={mod.icon === "" ? defaultModIcon : mod.icon}
							className="size-10 inline-block rounded-2xl mr-2"
							alt="mod logo"
							width={20}
							height={20}
						/>
						<a
							href={`https://modrinth.com/mod/${mod.slug}`}
							className=""
							target="_blank"
							rel="noreferrer"
						>
							{mod.name}{" "}
						</a>
						{mod.modloaders.includes("fabric") && (
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
						{mod.modloaders.includes("forge") && (
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
						{mod.modloaders.includes("neoforge") && (
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
						{mod.modloaders.includes("quilt") && (
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
							href={`https://modrinth.com/mod/${mod.slug}`}
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
							{mod.versions.join(", ")}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--download] pt-2" />{" "}
							{millify(mod.downloads, {
								precision: 2,
							})}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--user] pt-2" />{" "}
							<a
								className="text-primary hover:underline"
								href={`https://modrinth.com/user/${mod.author}`}
								target="_blank"
								rel="noreferrer"
							>
								{mod.author}
							</a>
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--heart] pt-2" />{" "}
							{millify(mod.follows, {
								precision: 2,
							})}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--category] pt-2" />{" "}
							{mod.categories
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
