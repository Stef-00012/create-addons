import ModelTable from "@/components/docs/ModelTable";
import { tableHeader, websocketPingMessageRows } from "@/constants/models";
import Link from "next/link";

export default function WebSocketPingMessageDocs() {
    return (
        <>
            <h1 className="text-3xl">Ping Message</h1>
            <h3 className="text-xl">Type: <code>0</code></h3>
            <h3 className="text-xl">Direction: <code>Server &rarr; Client</code></h3>

            <p className="pt-6">The <code>ping</code> message is a message sent every 30 seconds to all the clients, if any client does not respond with a <Link href="/docs/ws/pong" className="link2"><code>pong</code></Link> message before the next <code>ping</code> message, it&apos;ll get disconnected from the WebSocket.</p>

            <h3 className="py-4 text-2xl">Model</h3>

            <ModelTable header={tableHeader} rows={websocketPingMessageRows} />
        </>
    )
}