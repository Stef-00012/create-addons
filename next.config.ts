import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL("https://cdn.modrinth.com/data/*/*"),
			new URL("https://media.forgecdn.net/avatars/*/*/*"),
		],
	},
};

export default nextConfig;
