"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function APIDocs() {
    const [currentOrigin, setCurrentOrigin] = useState<string>("http://localhost:3000");

    useEffect(() => {
        setCurrentOrigin(window.location.origin)
    }, [])

    return (
        <>
            <h1 className="text-3xl">API Documentation</h1>

            <p>The Create Addons API is used to retrieve informations about a specific addon or a list of addons avaible on the website.</p>
            <p>The API base URL is <code>{currentOrigin}/api</code>.</p>

            <h2 className="text-2xl pt-6">Endpoints</h2>

            <ul className="list-disc list-inside marker:text-primary pt-6">
                <li>
                    <Link href="/docs/api/addons" className="link2"><code>GET /api/addons</code></Link> - Retrieve a list of addons.
                </li>
                <li>
                    <Link href="/docs/api/addons/:slug" className="link2"><code>GET /api/addons/:slug</code></Link> - Retrieve a secific addon.
                </li>
            </ul>
        </>
    )
}