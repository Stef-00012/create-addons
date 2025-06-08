import ModelTable from "@/components/docs/ModelTable";
import { tableHeader, websocketPongMessageRows } from "@/constants/models";
import Link from "next/link";

export default function WebSocketPongMessageDocs() {
    return (
        <>
            <h1 className="text-3xl">Pong Message</h1>
            <h3 className="text-xl">Type: <code>1</code></h3>
            <h3 className="text-xl">Direction: <code>Client &rarr; Server</code></h3>

            <p className="pt-6">The <code>pong</code> message is a message that the client must send to the server within 30 seconds of receiving the <Link href="/docs/ws/ping" className="link2"><code>ping</code></Link> message therwise they&apos;ll get disconnected from the WebSocket.</p>

            <h3 className="py-4 text-2xl">Model</h3>
            
                        <ModelTable header={tableHeader} rows={websocketPongMessageRows} />
        </>
    )
}