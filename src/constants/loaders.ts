import type { Platforms } from "@/types/addons";
import { CurseforgeModLoaderType } from "@/types/curseforge";

export const modLoaders = [
	"quilt",
	"fabric",
	"forge",
	"neoforge",
	"liteloader",
	"modloader",
	"rift",
	"cauldron",
];

export const modloaderNames = {
	modloader: "Risugami's ModLoader",
	liteloader: "LiteLoader",
	neoforge: "NeoForge",
	fabric: "Fabric",
	quilt: "Quilt",
	forge: "Forge",
	rift: "Rift",
	cauldron: "Cauldron",
};

export const curseforgeModloaders = {
	[CurseforgeModLoaderType.Any]: "any",
	[CurseforgeModLoaderType.Cauldron]: "cauldron",
	[CurseforgeModLoaderType.Fabric]: "fabric",
	[CurseforgeModLoaderType.Forge]: "forge",
	[CurseforgeModLoaderType.LiteLoader]: "liteloader",
	[CurseforgeModLoaderType.NeoForge]: "neoforge",
	[CurseforgeModLoaderType.Quilt]: "quilt",
};

export const platforms: Platforms[] = ["curseforge", "modrinth"];
