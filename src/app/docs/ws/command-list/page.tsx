import Divider from "@/components/docs/Divider";
import ModelTable from "@/components/docs/ModelTable";
import { getAddonCommandArgsRows, getAddonsCommandArgsRows, getAddonsCommandResponseRows, tableHeader } from "@/constants/models";
import Link from "next/link";

export default function WebSocketCommandListDocs() {
    return (
        <>
            <h1 className="text-3xl">Command List</h1>

            {/* getAddons */}
            <h2 className="text-2xl pt-6">•<Link href="#getAddons" id="getAddons" className="link2"><code>getAddons</code></Link></h2>

            <h1 className="text-xl py-4">Args</h1>

            <ModelTable header={tableHeader} rows={getAddonsCommandArgsRows} />

            <h1 className="text-xl py-4">Success Response Data</h1>

            <ModelTable header={tableHeader} rows={getAddonsCommandResponseRows} />

            <Divider />

            {/* getAddons */}
            <h2 className="text-2xl">•<Link href="#getAddon" id="getAddon" className="link2"><code>getAddon</code></Link></h2>

            <h1 className="text-xl py-4">Args</h1>

            <ModelTable header={tableHeader} rows={getAddonCommandArgsRows} />

            <h1 className="text-xl py-4">Success Response Data: <Link href="/docs/models/addon#Addon" className="link2">Addon</Link></h1>
        </>
    )
}