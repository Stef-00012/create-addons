import Link from "next/link";

export default function DocsHome() {
    return (
        <>
            <h1 className="text-3xl">Create Addons Documentation</h1>

            <p>
                Welcome to the Create Addons documentation! Here you can find information about the <Link href="/docs/api" className="link2">API</Link>, the <Link href="/docs/ws" className="link2">WebSocket</Link> and how to use them.
            </p>

            <h2 className="text-2xl pt-6">API Documentation</h2>

            <p>The API is available on the <Link href="/docs/api" className="link2"><code>/api</code></Link> endpoint and it allows you to retrieve informations about a specific addon or a list of addons available on the website.</p>

            <h2 className="text-2xl pt-6">WebSocket Documentation</h2>

            <p>The WebSocket is available on the <Link href="/docs/ws" className="link2"><code>/ws</code></Link> endpoint and it allows you to retrieve informations about a specific addon or a list of addons available on the website, and also to get notified as soon as an addon gets added or removed on the website.</p>
        </>
    )
}