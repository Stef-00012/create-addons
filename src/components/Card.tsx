import defaultModIcon from "#/assets/defaultModIcon.svg";
import neoforge from "#/assets/neoforge.png";
import fabric from "#/assets/fabric.png";
import forge from "#/assets/forge.ico";
import quilt from "#/assets/quilt.svg";

import millify from "millify";

import { modloaderNames } from "@/constants/loaders";

import type { APIModsResponse } from "@/app/api/addons/route";

import { Tooltip } from "react-tooltip";
import Image from "next/image";

interface Props {
	mod: APIModsResponse["mods"][0];
}

export default function Card({ mod }: Props) {
	return (
		<div className="card sm:max-w-lg my-4 sm:my-0 sm:flex-auto">
			<div className="card-body">
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
						className="link-primary"
						target="_blank"
						rel="noreferrer"
					>
						{mod.name}
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
				<ul>
					<li>
						<span className="icon-[tabler--brand-minecraft] pt-2" />{" "}
						<strong>Modloaders:</strong>
						{` ${mod.modloaders
							.map((modloader) => modloaderNames[modloader])
							.join(", ")}`}
					</li>
					<li>
						<span className="icon-[tabler--hash] pt-2" />{" "}
						<strong>Versions:</strong> {mod.versions.join(", ")}
					</li>
					<li>
						<span className="icon-[tabler--download] pt-2" />{" "}
						<strong>Downloads:</strong>{" "}
						{millify(mod.downloads, {
							precision: 2,
						})}
					</li>
					<li>
						<span className="icon-[tabler--user] pt-2" />{" "}
						<strong>Creator:</strong>{" "}
						<a
							className="text-primary hover:underline"
							href={`https://modrinth.com/user/${mod.author}`}
							target="_blank"
							rel="noreferrer"
						>
							{mod.author}
						</a>
					</li>
					<li>
						<span className="icon-[tabler--heart] pt-2" />{" "}
						<strong>Followers:</strong>{" "}
						{millify(mod.follows, {
							precision: 2,
						})}
					</li>
					<li>
						<span className="icon-[tabler--category] pt-2" />{" "}
						<strong>Categories:</strong>{" "}
						{mod.categories
							.map(
								(category) =>
									category.charAt(0).toUpperCase() + category.slice(1),
							)
							.join(", ")}
					</li>
					<li>
						<span className="icon-[tabler--text-caption] pt-2" />{" "}
						<strong>Description:</strong>{" "}
						{mod.description.length > 300
							? `${mod.description.substring(0, 300)}...`
							: mod.description}
					</li>
				</ul>
				<div className="card-actions mt-auto pt-2 -mb-3">
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
		</div>
	);
}