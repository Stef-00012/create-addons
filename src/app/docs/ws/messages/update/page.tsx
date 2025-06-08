import ModelTable from "@/components/docs/ModelTable";
import { tableHeader, websocketUpdateMessageRows } from "@/constants/models";

export default function WebSocketUpdateMessageDocs() {
    return (
        <>
            <h1 className="text-3xl">Update Message</h1>
            <h3 className="text-xl">Type: <code>3</code></h3>
            <h3 className="text-xl">Direction: <code>Server &rarr; Client</code></h3>

            <p className="pt-6">The <code>update</code> message is a message sent to all the clients as soon as any addon is updated to the website.</p>

            <h3 className="py-4 text-2xl">Model</h3>
            
            <ModelTable header={tableHeader} rows={websocketUpdateMessageRows} />
        </>
    )
}