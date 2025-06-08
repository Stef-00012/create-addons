const colors = {
	GET: "bg-green-400 text-black",
	POST: "bg-yellow-500 text-black",
	PUT: "bg-yellow-500 text-black",
	PATCH: "bg-yellow-500 text-black",
	DELETE: "bg-red-400 text-black",
};

interface ApiBadgeProps {
	type: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	path: string;
}

export default function ApiBadge({ type, path }: ApiBadgeProps) {
	const color = colors[type];

	return (
		<div className="p-4 bg-base-100 rounded-xl inline-block">
			<div className="flex">
				<div className="inline-block font-bold text-center rounded-md mr-4">
					<span className={`bg-gray-200 rounded-md p-1.5 ${color}`}>
						{type}
					</span>
				</div>
				<p>/api{path}</p>
			</div>
		</div>
	);
}
