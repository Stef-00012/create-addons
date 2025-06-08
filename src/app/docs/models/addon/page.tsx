import Divider from "@/components/docs/Divider";
import ModelTable from "@/components/docs/ModelTable";
import {
	addonDataModelRows,
	addonModelRows,
	modDataModelRows,
	tableHeader,
	addonAuthorModelRows,
} from "@/constants/models";
import Link from "next/link";

export default function AddonModel() {
	return (
		<>
			{/* Addon */}
			<Link className="text-5xl link2" href="#Addon" id="Addon">
				Addon
			</Link>

			<p className="py-2">Represents an addon.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={addonModelRows} />

			<Divider />

			{/* ModData */}
			<Link className="text-5xl link2" href="#ModData" id="ModData">
				ModData
			</Link>

			<p className="py-2">Represents the mod data of an addon.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={modDataModelRows} />

			<Divider />

			{/* AddonData */}
			<Link className="text-5xl link2" href="#AddonData" id="AddonData">
				AddonData
			</Link>

			<p className="py-2">Represents the data of an addon.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={addonDataModelRows} />

			<Divider />

			{/* AddonAuthor */}
			<Link className="text-5xl link2" href="#AddonAuthor" id="AddonAuthor">
				AddonAuthor
			</Link>

			<p className="py-2">Represents the data of an author of an addon.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={addonAuthorModelRows} />
		</>
	);
}
