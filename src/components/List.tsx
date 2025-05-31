import defaultModIcon from "#/assets/defaultModIcon.svg";
import neoforge from "#/assets/neoforge.png";
import fabric from "#/assets/fabric.png";
import forge from "#/assets/forge.ico";
import quilt from "#/assets/quilt.svg";

import { format } from "date-fns";
import millify from "millify";

import { Tooltip } from "react-tooltip";
import Image from "next/image";
import type { DatabaseMod, DatabaseModData, Platforms } from "@/types/addons";
import { useEffect, useState } from "react";
import { baseUrls } from "@/constants/loaders";
import ModloaderSwap from "./ModloaderSwap";

interface Props {
	mod: DatabaseMod["modData"];
}

export default function List({ mod }: Props) {
	const modPlatforms = Object.entries(mod)
		.filter((entry) => entry[1])
		.map((entry) => entry[0]) as Platforms[];

	const [platform, setPlatform] = useState<Platforms>(
		modPlatforms.includes("modrinth") ? "modrinth" : "curseforge",
	);
	const [modData, setModData] = useState(mod[platform] as DatabaseModData);

	useEffect(() => {
		setModData(mod[platform] as DatabaseModData);
	}, [platform, mod]);

	return (
		<div className="card my-4 w-full">
			<div className="card-body">
				<div className="flex justify-between items-baseline pb-2">
					<h5 className="card-title mb-0">
						<Image
							src={modData.icon === "" ? defaultModIcon : modData.icon}
							className="size-10 inline-block rounded-2xl mr-2"
							alt="mod logo"
							width={20}
							height={20}
						/>
						<a
							href={`${baseUrls[platform]}/${modData.slug}`}
							target="_blank"
							rel="noreferrer"
						>
							{modData.name}{" "}
						</a>
						{modData.modloaders.includes("fabric") && (
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
						{modData.modloaders.includes("forge") && (
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
						{modData.modloaders.includes("neoforge") && (
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
						{modData.modloaders.includes("quilt") && (
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
					<ModloaderSwap
						defaultPlatform={platform}
						disabled={modPlatforms.length <= 1}
						onChange={(newPlatform) => {
							setPlatform(newPlatform);
						}}
					/>
				</div>
				<div className="flex flex-wrap justify-start">
					<div className="flex-wrap sm:flex">
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--hash] pt-2" />{" "}
							{modData.versions.join(", ")}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--download] pt-2" />{" "}
							{millify(modData.downloads, {
								precision: 2,
							})}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--user] pt-2" />{" "}
							{modData.authors.map((author, index) => (
								<span key={author.name}>
									<a
										className="text-primary hover:underline"
										href={author.url}
										target="_blank"
										rel="noreferrer"
									>
										{author.name}
									</a>
									{index < modData.authors.length - 1 && ", "}
								</span>
							))}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--heart] pt-2" />{" "}
							{millify(modData.follows, {
								precision: 2,
							})}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--category] pt-2" />{" "}
							{modData.categories
								.map(
									(category) =>
										category.charAt(0).toUpperCase() + category.slice(1),
								)
								.join(", ")}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--clock] pt-2" />{" "}
							{format(new Date(modData.created), "dd/MM/yyyy")}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--clock-edit] pt-2" />{" "}
							{format(new Date(modData.modified), "dd/MM/yyyy")}
						</p>
					</div>
					<p className="flex-grow" />
				</div>
				<div className="flex justify-end">
					<div className="card-actions">
						{mod.modrinth && (
							<a
								href={`${baseUrls.modrinth}/${mod.modrinth.slug}`}
								className="btn btn-outline btn-primary flex items-center"
								target="_blank"
								rel="noreferrer"
							>
								<span className="icon-[tabler--link] me-1" />
								Modrinth
							</a>
						)}

						{mod.curseforge && (
							<a
								href={`${baseUrls.curseforge}/${mod.curseforge.slug}`}
								className="btn btn-outline btn-primary flex items-center"
								target="_blank"
								rel="noreferrer"
							>
								<span className="icon-[tabler--link] me-1" />
								Curseforge
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
