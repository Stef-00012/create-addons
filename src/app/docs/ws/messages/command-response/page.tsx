import ModelTable from "@/components/docs/ModelTable";
import { tableHeader, websocketCommandResponseMessageRows } from "@/constants/models";

export default function WebSocketCommandMessageDocs() {
    return (
        <>
            <h1 className="text-3xl">Command Response Message</h1>
            <h3 className="text-xl">Type: <code>5</code></h3>
            <h3 className="text-xl">Direction: <code>Server &rarr; Client</code></h3>

            <p className="pt-6">The <code>command response</code> message is a successful message sent by the server to the client as a response to a previously received message.</p>

            <h3 className="py-4 text-2xl">Model</h3>
            
            <ModelTable header={tableHeader} rows={websocketCommandResponseMessageRows} />
        </>
    )
}