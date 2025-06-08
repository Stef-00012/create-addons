import ModelTable from "@/components/docs/ModelTable";
import { tableHeader, websocketCommandMessageRows, websocketCreateMessageRows } from "@/constants/models";
import Link from "next/link";

export default function WebSocketCommandMessageDocs() {
    return (
        <>
            <h1 className="text-3xl">Command Message</h1>
            <h3 className="text-xl">Type: <code>4</code></h3>
            <h3 className="text-xl">Direction: <code>Client &rarr; Server</code></h3>

            <p className="pt-6">The <code>command</code> message is a message sent by the client when it wants to request a specific addons or a list of addons.</p>

            <h3 className="py-4 text-2xl">Model</h3>
            
            <ModelTable header={tableHeader} rows={websocketCommandMessageRows} />
        </>
    )
}