import Link from "next/link";
import { type ReactNode, useState } from "react";

interface SidebarButtonProps {
	path?: string;
	name: string;
	divider?: boolean;
	iconClass?: string;
	children?: ReactNode;
}

export default function SidebarButton({
	path,
	name,
	divider,
	children,
	iconClass,
}: SidebarButtonProps) {
	const urlPath = `/docs${path}`;
	const [isCollapseOpen, setIsCollapseOpen] = useState(false);

	if (divider) {
		return (
			<div className="divider text-base-content/50 py-6 after:border-0">
				{iconClass && <span className={`${iconClass} size-5`} />}
				{name}
			</div>
		);
	}

	if (children) {
		return (
			<li className="space-y-0.5">
				{path ? (
					<>
						<div
							className={`flex justify-between ${isCollapseOpen ? "bg-base-content/10" : ""}`}
						>
							<Link href={urlPath}>
								{iconClass && <span className={`${iconClass} size-5 self-end`} />}
								{name}
							</Link>

							<span
								className={`icon-[tabler--chevron-down] ${isCollapseOpen ? "rotate-180" : ""} collapse-toggle size-4 transition-all duration-300`}
								onClick={() => {
									setIsCollapseOpen((prev) => !prev);
								}}
								onKeyDown={() => {
									setIsCollapseOpen((prev) => !prev);
								}}
							/>
						</div>
					</>
				) : (
					<>
						<div
							className={`flex justify-between ${isCollapseOpen ? "bg-base-content/10" : ""}`}
							onClick={() => {
								setIsCollapseOpen((prev) => !prev);
							}}
							onKeyDown={() => {
								setIsCollapseOpen((prev) => !prev);
							}}
						>
							<p>
								{iconClass && <span className={`${iconClass} size-5 self-end`} />}
								{name}
							</p>

							<span
								className={`icon-[tabler--chevron-down] ${isCollapseOpen ? "rotate-180" : ""} collapse-toggle size-4 transition-all duration-300`}
							/>
						</div>
					</>
				)}
				<ul
					className={`w-auto space-y-0.5 overflow-hidden transition-[max-height] ${isCollapseOpen ? "max-h-[9999px]" : "max-h-0"} duration-300`}
				>
					{children}
				</ul>
			</li>
		);
	}

	return (
		<li>
			<Link href={urlPath}>
				{iconClass && <span className={`${iconClass} size-5`} />}
				{name}
			</Link>
		</li>
	);
}
