import ModelTable from "@/components/docs/ModelTable";
import { tableHeader, websocketCreateMessageRows } from "@/constants/models";

export default function WebSocketCreateMessageDocs() {
    return (
        <>
            <h1 className="text-3xl">Create Message</h1>
            <h3 className="text-xl">Type: <code>2</code></h3>
            <h3 className="text-xl">Direction: <code>Server &rarr; Client</code></h3>

            <p className="pt-6">The <code>create</code> message is a message sent to all the clients as soon as any new addon is added to the website.</p>

            <h3 className="py-4 text-2xl">Model</h3>
            
            <ModelTable header={tableHeader} rows={websocketCreateMessageRows} />
        </>
    )
}