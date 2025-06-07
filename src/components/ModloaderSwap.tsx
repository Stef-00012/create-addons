import curseforgeLogo from "#/assets/images/curseforge.svg";
import modrinthLogo from "#/assets/images/modrinth.svg";
import type { Platforms } from "@/types/addons";
import Image from "next/image";

interface Props {
	defaultPlatform?: Platforms;
	disabled?: boolean;
	onChange: (newPlatform: Platforms) => void;
}

export default function ModloaderSwap({
	defaultPlatform = "modrinth",
	disabled = false,
	onChange,
}: Props) {
	const defaultChecked = defaultPlatform === "modrinth";

	return (
		<label
			className={`swap swap-flip text-6xl relative ${disabled ? "cursor-not-allowed" : ""}`}
		>
			<input
				type="checkbox"
				defaultChecked={defaultChecked}
				disabled={disabled}
				onClick={() => {
					onChange(defaultPlatform === "modrinth" ? "curseforge" : "modrinth");
				}}
			/>
			<Image
				src={modrinthLogo}
				alt="Modrinth Logo"
				className="swap-on w-8 h-8"
			/>
			<Image
				src={curseforgeLogo}
				width={30}
				height={30}
				alt="Curseforge Logo"
				className="swap-off w-8 h-8"
			/>
		</label>
	);
}
