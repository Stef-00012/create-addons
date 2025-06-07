import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import localFont from 'next/font/local'

const minecraftFont = localFont({
	src: '../../public/assets/fonts/minecraft-font.otf',
})

import "./globals.css";

export const metadata: Metadata = {
	title: "Create Addons Index",
	description:
		"An open source index of all the Create Minecraft mod related addons.",
	openGraph: {
		title: "Create Addons Index",
		description:
			"An open source index of all the Create Minecraft mod related addons.",
		type: "website",
	},
};

export const viewport: Viewport = {
	initialScale: 1,
	width: "device-width",
	themeColor: "#fab387",
};

export const dynamic = "force-static";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="bg-rbase">
			<body className={`${minecraftFont.className} antialiased justify-center mx-auto max-w-[100rem] p-3 text-lg bg-rbase text-rtext`}>
				<Suspense>{children}</Suspense>
			</body>
		</html>
	);
}
