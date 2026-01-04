import defaultModIcon from "#/assets/images/defaultModIcon.svg";
import neoforge from "#/assets/images/neoforge.svg";
import fabric from "#/assets/images/fabric.svg";
import forge from "#/assets/images/forge.svg";
import quilt from "#/assets/images/quilt.svg";

import { format, formatDistanceToNow } from "date-fns";
import millify from "millify";

import { modloaderNames, baseUrls } from "@/constants/loaders";

import { Tooltip } from "react-tooltip";
import Image from "next/image";
import type { DatabaseMod, DatabaseModData, Platforms } from "@/types/addons";
import { useEffect, useState } from "react";
import ModloaderSwap from "@/components/ModloaderSwap";

interface Props {
	mod: DatabaseMod["modData"];
	defaultPlatform?: Platforms;
}

export default function Card({ mod, defaultPlatform }: Props) {
	const modPlatforms = Object.entries(mod)
		.filter((entry) => entry[1])
		.map((entry) => entry[0]) as Platforms[];

	const basePlatform = defaultPlatform
		? defaultPlatform
		: modPlatforms.includes("modrinth")
			? "modrinth"
			: "curseforge";

	const [platform, setPlatform] = useState<Platforms>(basePlatform);
	const [modData, setModData] = useState(mod[platform] as DatabaseModData);

	useEffect(() => {
		setModData(mod[platform] as DatabaseModData);
	}, [platform, mod]);

	return (
		<div className="card sm:max-w-lg my-4 sm:my-0 sm:flex-auto">
			<div className="card-body">
				<h5 className="card-title mb-0 flex justify-between">
					<div className="max-w-[80%]">
						<Image
							src={modData.icon === "" ? defaultModIcon : modData.icon}
							unoptimized={modData.icon.endsWith(".gif")}
							className="size-10 inline-block rounded-2xl mr-2"
							alt="mod logo"
							width={20}
							height={20}
						/>
						<a
							href={`${baseUrls[platform]}/${modData.slug}`}
							className="link-primary"
							target="_blank"
							rel="noreferrer"
						>
							{modData.name}
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
					</div>
					<ModloaderSwap
						defaultPlatform={platform}
						disabled={modPlatforms.length <= 1}
						onChange={(newPlatform) => {
							setPlatform(newPlatform);
						}}
					/>
				</h5>
				<ul>
					<li>
						<span className="icon-[tabler--brand-minecraft] pt-2" />{" "}
						<strong>Modloaders:</strong>
						{` ${modData.modloaders
							.filter((modloader) => modloader !== "any")
							.map((modloader) => modloaderNames[modloader])
							.join(", ")}`}
					</li>
					<li>
						<span className="icon-[tabler--hash] pt-2" />{" "}
						<strong>Versions:</strong> {modData.versions.join(", ")}
					</li>
					{modData.createVersion && (
						<li>
							<span className="icon-[tabler--settings] pt-2" />{" "}
							<strong>Latest Create Version:</strong> {modData.createVersion}
						</li>
					)}
					<li>
						<span className="icon-[tabler--download] pt-2" />{" "}
						<strong>Downloads:</strong>{" "}
						{millify(modData.downloads, {
							precision: 2,
						})}
					</li>
					<li>
						<span className="icon-[tabler--user] pt-2" />{" "}
						<strong>Creators:</strong>{" "}
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
					</li>
					<li>
						<span className="icon-[tabler--heart] pt-2" />{" "}
						<strong>Followers:</strong>{" "}
						{millify(modData.follows, {
							precision: 2,
						})}
					</li>
					<li>
						<span className="icon-[tabler--category] pt-2" />{" "}
						<strong>Categories:</strong>{" "}
						{modData.categories
							.map(
								(category) =>
									category.charAt(0).toUpperCase() + category.slice(1),
							)
							.join(", ")}
					</li>
					<li>
						<span className="icon-[tabler--text-caption] pt-2" />{" "}
						<strong>Description:</strong>{" "}
						{modData.description.length > 300
							? `${modData.description.substring(0, 300)}...`
							: modData.description}
					</li>
					<li>
						<span className="icon-[tabler--clock] pt-2" />{" "}
						<strong>Created:</strong>{" "}
						{format(new Date(modData.created), "MMMM do, yyyy")} (
						{formatDistanceToNow(new Date(modData.created), {
							addSuffix: true,
							includeSeconds: true,
						})}
						)
					</li>
					<li>
						<span className="icon-[tabler--clock-edit] pt-2" />{" "}
						<strong>Last Updated:</strong>{" "}
						{format(new Date(modData.modified), "MMMM do, yyyy")} (
						{formatDistanceToNow(new Date(modData.modified), {
							addSuffix: true,
							includeSeconds: true,
						})}
						)
					</li>
				</ul>
				<div className="card-actions mt-auto pt-2 -mb-3">
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
	);
}
