import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Create Addons Index",
		short_name: "Create Addons",
		description:
			"An open source index of all the Create Minecraft mod related addons.",
		start_url: "/",
		display: "standalone",
		background_color: "#fab387",
		theme_color: "#fab387",
		icons: [
			{
				src: "/assets/images/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/assets/images/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
