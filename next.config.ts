import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL("https://cdn.modrinth.com/data/*/*")],
	},
};

export default nextConfig;
