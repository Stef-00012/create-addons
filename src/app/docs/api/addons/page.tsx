import ApiBadge from "@/components/docs/ApiBadge";
import Divider from "@/components/docs/Divider";
import ModelTable from "@/components/docs/ModelTable";
import ResponsesBadge from "@/components/docs/ResponsesBadge";
import {
	apiAddonsError400ModelRows,
	apiAddonsQueryModelRows,
	apiAddonsResponseModelRows,
	tableHeader,
} from "@/constants/models";

export default function AddonsAPIDocs() {
	return (
		<>
			<ApiBadge path="/api/addons" type="GET" />

			<h3 className="py-4 text-3xl">Query</h3>

			<ModelTable header={tableHeader} rows={apiAddonsQueryModelRows} />

			<Divider />

			<h3 className="py-4 text-3xl">Responses</h3>

			<ResponsesBadge type={200} contentType="application/json" />

			<h3 className="py-4 text-2xl">Model</h3>

			<ModelTable header={tableHeader} rows={apiAddonsResponseModelRows} />

			<Divider />

			<ResponsesBadge type={400} contentType="application/json" />

			<h3 className="py-4 text-2xl">Model</h3>

			<ModelTable header={tableHeader} rows={apiAddonsError400ModelRows} />
		</>
	);
}
