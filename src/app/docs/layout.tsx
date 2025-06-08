"use client";

import Image from "next/image";
import icon from "#/assets/images/icon-512.png";
import Link from "next/link";
import SidebarButton from "@/components/docs/SidebarButton";
import { useState } from "react";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const sidebarWidth = 256;

	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

	return (
		<>
			<button
				type="button"
				className="btn btn-text max-sm:btn-square sm:hidden"
				aria-haspopup="dialog"
				aria-expanded="false"
				aria-controls="multilevel-with-separator"
				onClick={() => {
					setSidebarOpen((prev) => !prev);
				}}
			>
				<span className="icon-[tabler--menu-2] size-5" />
			</button>

			<aside
				id="multilevel-with-separator"
				style={{ width: `${sidebarWidth}px` }}
				// className="overlay [--auto-close:sm] overlay-open:translate-x-0 drawer drawer-start hidden max-w-64 sm:absolute sm:z-0 sm:flex sm:translate-x-0 sm:shadow-none"
				className={`drawer drawer-start max-w-64 sm:fixed sm:top-0 sm:left-0 z-10 sm:flex sm:translate-x-0 sm:shadow-none transition-[translate] ${sidebarOpen ? "translate-x-0 w-full h-full" : "-translate-x-[100%]"}`}
				tabIndex={-1}
			>
				<div className="drawer-header">
					<div>
						<div className="flex items-center gap-3">
							<Link href="/" className="flex items-center gap-3">
								<Image
									src={icon}
									alt="Create Addons Logo"
									width={64}
									height={64}
									className="rounded-xl"
								/>

								<h3 className="drawer-title text-xl font-semibold">
									Create Addons
								</h3>
							</Link>

							<button
								type="button"
								className="hover:cursor-pointer sm:hidden"
								onClick={() => {
									setSidebarOpen((prev) => !prev);
								}}
							>
								<p className="icon-[iconamoon--close] size-10 text-error hover:text-bg-error" />
							</button>
						</div>
					</div>
				</div>
				<div className="drawer-body px-2">
					<ul className="menu space-y-0.5 p-0">
						<SidebarButton
							path="/"
							name="Home"
							iconClass="icon-[tabler--home]"
						/>
						<SidebarButton
							path="/models"
							name=" Models"
							iconClass="icon-[mdi--code-json] align-sub"
						>
							<SidebarButton path="/models/addon" name="Addon" />
							<SidebarButton path="/models/websocket" name="WebSocket" />
						</SidebarButton>
						<SidebarButton
							path="/api"
							name=" API"
							iconClass="icon-[eos-icons--api-outlined] align-sub"
						>
							<SidebarButton path="/api/ratelimits" name="Ratelimits" iconClass="icon-[mdi--gauge]" />
							<SidebarButton path="/api/addons" name="/addons">
								<SidebarButton path="/api/addons/:slug" name="/:slug" />
							</SidebarButton>
						</SidebarButton>
						<SidebarButton
							path="/ws"
							name=" WebSocket"
							iconClass="icon-[cib--socket-io] align-sub"
						>
							<SidebarButton name="Messages">
								<SidebarButton path="/ws/messages/ping" name="Ping" />
								<SidebarButton path="/ws/messages/pong" name="Pong" />
								<SidebarButton path="/ws/messages/create" name="Create" />
								<SidebarButton path="/ws/messages/update" name="Update" />
								<SidebarButton path="/ws/messages/command" name="Command" />
								<SidebarButton path="/ws/messages/command-response" name="Command Response" />
								<SidebarButton path="/ws/messages/command-error" name="Command Error" />
							</SidebarButton>
							<SidebarButton path="/ws/command-list" name="Command List" />
						</SidebarButton>
					</ul>
				</div>
			</aside>

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
