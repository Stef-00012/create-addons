import Link from "next/link";

export interface ModelTableProps {
	rows: {
		name: string;
		type: string;
		description: string;
		url?: string;
	}[];
	header: string[];
}

export default function ModelTable({ header, rows }: ModelTableProps) {
	return (
		<div className="w-full overflow-x-auto rounded-xl border-2 border-base-100">
			<table className="table">
				<thead>
					<tr className="border-0 bg-base-100">
						{header.map((column) => (
							<th key={column}>{column}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.name}>
							<td>{row.name}</td>
							<td>
								{row.url ? (
									<Link href={row.url} className="link2">
										{row.type}
									</Link>
								) : (
									row.type
								)}
							</td>
							<td className="text-nowrap">{row.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
