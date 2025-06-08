import Sidebar from "@/components/docs/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Create Addons Documentation",
	description:
		"Documentation for the Create Addons API & WebSocket.",
	openGraph: {
		title: "Create Addons Documentation",
		description:
			"Documentation for the Create Addons API & WebSocket.",
		type: "website",
	},
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const sidebarWidth = 256;

	return (
		<>
			<Sidebar sidebarWidth={sidebarWidth} />

			<div className="flex">
				<div
					className="hidden sm:block"
					style={{ minWidth: `${sidebarWidth + 15}px` }}
				/>
				<div
					className="flex-1 mt-6"
					style={{
						width: `calc(100% - ${sidebarWidth + 15}px)`,
					}}
				>
					{children}
				</div>
			</div>
		</>
	);
}
