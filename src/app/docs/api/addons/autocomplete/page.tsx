import ApiBadge from "@/components/docs/ApiBadge";
import Divider from "@/components/docs/Divider";
import ModelTable from "@/components/docs/ModelTable";
import ResponsesBadge from "@/components/docs/ResponsesBadge";
import {
    apiAddonsAutocompleteError400ModelRows,
    apiAddonsAutocompleteQueryModelRows,
	apiAddonsAutocompleteResponseModelRows,
	tableHeader,
} from "@/constants/models";

export default function AddonsAPIDocs() {
	return (
		<>
			<ApiBadge path="/addons/autocomplete" type="GET" />

			<h3 className="py-4 text-3xl">Query</h3>

			<ModelTable header={tableHeader} rows={apiAddonsAutocompleteQueryModelRows} />

			<Divider />

			<h3 className="py-4 text-3xl">Responses</h3>

			<ResponsesBadge type={200} contentType="application/json" />

			<h3 className="py-4 text-2xl">Model</h3>
			
			<ModelTable header={tableHeader} rows={apiAddonsAutocompleteResponseModelRows} />

			<Divider />

			<ResponsesBadge type={400} contentType="application/json" />

			<h3 className="py-4 text-2xl">Model</h3>

			<ModelTable header={tableHeader} rows={apiAddonsAutocompleteError400ModelRows} />
		</>
	);
}
