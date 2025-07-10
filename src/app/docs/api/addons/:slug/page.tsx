import ApiBadge from "@/components/docs/ApiBadge";
import Divider from "@/components/docs/Divider";
import ModelTable from "@/components/docs/ModelTable";
import ResponsesBadge from "@/components/docs/ResponsesBadge";
import {
	apiAddonsSlugError400ModelRows,
	apiAddonsSlugError404ModelRows,
	apiAddonsSlugParamsModelRows,
	apiAddonsSlugQueryModelRows,
	tableHeader,
} from "@/constants/models";
import Link from "next/link";

export default function AddonSlugAPIDocs() {
	return (
		<>
			<ApiBadge path="/addons/:slug" type="GET" />

			<h3 className="py-4 text-3xl">Params</h3>

			<ModelTable header={tableHeader} rows={apiAddonsSlugParamsModelRows} />

			<h3 className="py-4 text-3xl">Query</h3>

			<ModelTable header={tableHeader} rows={apiAddonsSlugQueryModelRows} />

			<Divider />

			<h3 className="py-4 text-3xl">Responses</h3>

			<ResponsesBadge type={200} contentType="application/json" />

			<h3 className="py-4 text-2xl">
				Model:{" "}
				<Link href="/docs/models/addon#Addon" className="link2">
					Addon
				</Link>
			</h3>

			<Divider />

			<ResponsesBadge type={400} contentType="application/json" />

			<h3 className="py-4 text-2xl">Model</h3>

			<ModelTable header={tableHeader} rows={apiAddonsSlugError400ModelRows} />

			<Divider />

			<ResponsesBadge type={404} contentType="application/json" />

			<h3 className="py-4 text-2xl">Model</h3>

			<ModelTable header={tableHeader} rows={apiAddonsSlugError404ModelRows} />
		</>
	);
}
