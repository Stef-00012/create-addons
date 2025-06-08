"use client";

import ModelTable from "@/components/docs/ModelTable";
import { defaultWebSocketMessageRows, tableHeader } from "@/constants/models";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WebSocketDocs() {
    const [currentOrigin, setCurrentOrigin] = useState<string>("http://localhost:3000");

    useEffect(() => {
        setCurrentOrigin(window.location.origin)
    }, [])

    return (
        <>
            <h1 className="text-3xl">API Documentation</h1>

            <p>The Create Addons WebSocket is used to retrieve informations about a specific addon or a list of addons available on the website, and also to get notified as soon as an addon gets added or removed on the website.</p>
            <p>The Websocket URL is <code>{currentOrigin.replace("http", "ws")}/ws</code>.</p>

            <h2 className="text-2xl pt-6">Messages</h2>

            <ul className="list-disc list-inside marker:text-primary pt-6">
                <li>
                    <Link href="/docs/ws/messages/ping" className="link2">Ping (<code>0</code>)</Link> - The server sends a ping to client.
                </li>
                <li>
                    <Link href="/docs/ws/messages/pong" className="link2">Pong (<code>1</code>)</Link> - The client response the the server&apos;s ping.
                </li>
                <li>
                    <Link href="/docs/ws/messages/create" className="link2">Create (<code>2</code>)</Link> - The server sends a message to all the clients with all the newly added addons.
                </li>
                <li>
                    <Link href="/docs/ws/messages/update" className="link2">Update (<code>3</code>)</Link> - The server sends a message to all the clients with all the added addons that were modified.
                </li>
                <li>
                    <Link href="/docs/ws/messages/command" className="link2">Command (<code>4</code>)</Link> - The client sends a command to the server to retrieve a specific addons or the list of addons.
                </li>
                <li>
                    <Link href="/docs/ws/messages/command-response" className="link2">Command Response (<code>5</code>)</Link> - The server replies successfully to the client&apos;s command.
                </li>
                <li>
                    <Link href="/docs/ws/messages/command-error" className="link2">Command Error (<code>6</code>)</Link> - The server replies with an error to the client&apos;s command.
                </li>
            </ul>

            <p className="py-6">A WebSocket message looks like so:</p>

            <ModelTable header={tableHeader} rows={defaultWebSocketMessageRows} />
        </>
    )
}